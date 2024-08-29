use anyhow::anyhow;
use anyhow::Context;
use chrono::{Datelike, NaiveDate};
use log::*;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::time::sleep;

#[macro_use]
use dotenv::dotenv;
use std::env;

#[derive(Debug, PartialEq, Clone)]
pub enum UptimeType {
    Provider,
    Service,
    Datacenter,
    Unknown,
}

#[derive(Debug, PartialEq, Clone)]
pub enum UptimeStatus {
    Up,
    Down,
    Maintenance,
    Unknown,
}

#[derive(Debug, Clone)]
pub struct Uptime {
    pub name: String,
    pub uptime: String,
    pub response_time: String,
    pub status: UptimeStatus,
    pub uptime_type: UptimeType,
    pub url: String,
}

#[derive(Debug, Clone)]
pub struct UptimeServiceState {
    uptimes: Vec<Uptime>,
    last_updated: SystemTime,
}

#[derive(Debug, Clone)]
pub struct UptimeService {
    state: Arc<Mutex<UptimeServiceState>>,
}

impl UptimeService {
    const UPDATE_SECONDS: u64 = 300;

    pub fn new() -> Self {
        let init_state = Arc::new(Mutex::new(UptimeServiceState {
            uptimes: vec![],
            last_updated: UNIX_EPOCH,
        }));
        Self { state: init_state }
    }

    pub fn start(&self) {
        info!("Starting UptimeService");
        let cloned_state = Arc::clone(&self.state);
        tokio::spawn(async move {
            loop {
                let clonedx_state = Arc::clone(&cloned_state);
                let res = Self::update_data(clonedx_state).await;
                match res {
                    Err(err) => {
                        error!("{}", err);
                    }
                    _ => {}
                }
                sleep(tokio::time::Duration::from_secs(Self::UPDATE_SECONDS)).await;
            }
        });
    }

    pub fn get_data(&self) -> Vec<Uptime> {
        let state = self.state.lock().unwrap();
        let uptimes = state.uptimes.clone();
        return uptimes;
    }

    pub fn get_last_updated(&self) -> SystemTime {
        let state = self.state.lock().unwrap();
        let lu = state.last_updated.clone();
        return lu;
    }

    async fn update_data(arc_state: Arc<Mutex<UptimeServiceState>>) -> ::anyhow::Result<()> {
        debug!("Starting data update for UptimeService");

        let mut request_vars = HashMap::new();
        let api_key = env::var("UPTIMEROBOT_API_KEY")?;
        request_vars.insert("api_key", api_key.as_str());
        request_vars.insert("all_time_uptime_ratio", "1");
        let now = SystemTime::now();
        //let thirty_days_ago = now - Duration::from_secs(30 * 24 * 3600);

        let current_year = chrono::Utc::today().year();
        let january_1st = NaiveDate::from_ymd(current_year, 1, 1).and_hms(0, 0, 0);
        let duration =
            january_1st.signed_duration_since(NaiveDate::from_ymd(1970, 1, 1).and_hms(0, 0, 0));
        let year_start = UNIX_EPOCH + Duration::from_secs(duration.num_seconds() as u64);

        //let ranges = &format!(
        //    "{}_{}-{}_{}",
        //    thirty_days_ago.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
        //    now.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
        //    year_start.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
        //    now.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
        //);
        let ranges = &format!(
            "{}_{}",
            year_start.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
            now.duration_since(SystemTime::UNIX_EPOCH)?.as_secs(),
        );
        request_vars.insert("custom_uptime_ranges", ranges);
        request_vars.insert("response_times_average", "1440");
        request_vars.insert("response_times", "1");

        let client = reqwest::Client::new();
        let res = client
            .post("https://api.uptimerobot.com/v2/getMonitors")
            .form(&request_vars)
            .send()
            .await?;

        let resp = res.json::<serde_json::Value>().await?;

        let monitors = resp
            .get("monitors")
            .context("Response did not have a monitors subobject")?
            .as_array()
            .context("Monitors subobject was not an array")?;

        let mut state = match arc_state.lock() {
            Ok(val) => val,
            Err(_) => {
                return Err(anyhow!("Could not lock shared state"));
            }
        };
        state.uptimes.clear();
        for monitor in monitors {
            let monitor_fqn = monitor
                .get("friendly_name")
                .context("Monitor did not have property 'friendly_name'")?;

            debug!("Monitor '{}' processing", monitor_fqn);

            let split_str: Vec<&str> = monitor_fqn
                .as_str()
                .context("Expected 'friendly_name' to be a string")?
                .split(".")
                .collect();
            if split_str.len() != 2 {
                debug!("Monitor '{}' excluded due to bad format", monitor_fqn);
                continue;
            }

            let monitor_nt = String::from(
                *split_str
                    .get(0)
                    .context("Expected name to have first part")?,
            );
            let monitor_name = String::from(
                *split_str
                    .get(1)
                    .context("Expected name to have second part")?,
            );
            let monitor_type = match monitor_nt.as_str() {
                "datacenter" => UptimeType::Datacenter,
                "service" => UptimeType::Service,
                "competitor" => UptimeType::Provider,
                _ => UptimeType::Unknown,
            };

            if monitor_type == UptimeType::Unknown {
                debug!("Monitor '{}' excluded due to unknown type", monitor_fqn);
                continue;
            }

            let monitor_status_num = monitor
                .get("status")
                .context("Expected monitor to have 'status' property")?
                .as_u64()
                .context("Expected 'status' property to be u64")?;

            let monitor_status = match monitor_status_num {
                0 => UptimeStatus::Maintenance,
                1 | 8 | 9 => UptimeStatus::Down,
                2 => UptimeStatus::Up,
                _ => UptimeStatus::Unknown,
            };

            if monitor_status == UptimeStatus::Unknown {
                debug!(
                    "Monitor '{}' excluded due to unknown status (status was {})",
                    monitor_fqn, monitor_status_num
                );
                continue;
            }

            let monitor_rt_val = monitor
                .get("average_response_time")
                .context("Expected monitor to have property 'average_response_time'")?;

            // Because UptimeRobot has the world's worst API ever
            // and decided that it's okay to return multiple datatypes
            // for one property based on how they're feeling
            let monitor_rt = match monitor_rt_val.as_str() {
                Some(string) => format!("{}ms", string),
                _ => format!("N/A"),
            };

            let monitor_uptime = format!(
                "{}%",
                monitor
                    .get("custom_uptime_ranges")
                    .context("Expected monitor to have property 'custom_uptime_ranges'")?
                    .as_str()
                    .context("Expected 'custom_uptime_ranges' to be String")?
            );

            let monitor_url = String::from(
                monitor
                    .get("url")
                    .context("Expected monitor to have property 'url'")?
                    .as_str()
                    .context("Expected 'url' to be String")?,
            );

            state.uptimes.push(Uptime {
                name: monitor_name,
                uptime: monitor_uptime,
                response_time: monitor_rt,
                status: monitor_status,
                uptime_type: monitor_type,
                url: monitor_url,
            });
        }

        state.last_updated = SystemTime::now();

        Ok(())
    }
}
