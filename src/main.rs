use axum::{routing::get, Router};
use chrono::offset::Utc;
use chrono::DateTime;
use log::*;
use std::collections::HashMap;

#[macro_use]
extern crate dotenv_codegen;
extern crate dotenv;
use dotenv::dotenv;
use std::env;

use lazy_static::lazy_static;

mod uptime_service;

use uptime_service::{Uptime, UptimeService, UptimeStatus, UptimeType};

#[derive(askama::Template)]
#[template(path = "layout.html")]
struct ContentTemplate<T: askama::Template> {
    content: T,
    page_title: Option<String>,
    page_desc: Option<String>,
}

#[derive(askama::Template)]
#[template(path = "layout.html")]
struct RawContentTemplate {
    content: String,
    page_title: Option<String>,
    page_desc: Option<String>,
}

struct UptimeInfo {
    name: String,
    uptime: String,
    response_time: String,
    status: String,
    url: Option<String>,
}

#[derive(askama::Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    uptime_infos: Vec<UptimeInfo>,
    last_updated: String,
}

#[derive(askama::Template)]
#[template(path = "system_status.html")]
struct StatusTemplate {
    dctr_uptime_infos: Vec<UptimeInfo>,
    svc_uptime_infos: Vec<UptimeInfo>,
    last_updated: String,
}

#[derive(Clone)]
struct BlogInfo<'a> {
    title: &'a str,
    date: &'a str,
    url: &'a str,
}

#[derive(askama::Template)]
#[template(path = "blog.html")]
struct BlogTemplate<'a> {
    blogs: Vec<BlogInfo<'a>>,
}

#[derive(askama::Template)]
#[template(path = "dashboard.html")]
struct DashboardTemplate {}

#[derive(Clone)]
struct AppState {
    uptime_service: UptimeService,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    env_logger::init();

    info!("Starting Sharpe Mountain Compute Website");

    let uptime_service: UptimeService = UptimeService::new();
    uptime_service.start();

    let state = AppState { uptime_service };

    let app = Router::new()
        .route("/", get(index_handler))
        .route("/system_status", get(status_handler))
        .route("/dashboard", get(dashboard_handler))
        .route("/blog", get(blog_handler))
        .route("/blogs/:blog_name", get(single_blog_handler))
        .nest_service("/assets", tower_http::services::ServeDir::new("assets"))
        .with_state(state);

    let port_num = env::var("EXPOSE_PORT").unwrap_or("3000".to_string());

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port_num))
        .await
        .unwrap();

    info!("Listening on port {}", port_num);

    axum::serve(listener, app).await.unwrap();
}


lazy_static! {
    static ref blogs: HashMap<&'static str, BlogInfo<'static>> = {
        let mut m = HashMap::new();
        m.insert(
            "11-28-2024-postmortem", 
            BlogInfo {
                title: "Downtime Incident Postmortem (Nov 2024 - Present)",
                date: "December 28th, 2024",
                url: "11-28-2023-postmortem",
            },
        );
        m.insert(
            "11-08-2023-postmortem", 
            BlogInfo {
                title: "Downtime Incident Postmortem (Nov 2023)",
                date: "November 11th, 2023",
                url: "11-08-2023-postmortem",
            },
        );
        m.insert(
            "ssl-on-cds", 
            BlogInfo {
                title: "SSL on Container Deployment Service (at nickorlow.com)",
                date: "July 12th, 2023",
                url: "https://nickorlow.com/blogs/side-project-7-12-23.html",
            },
        );
        m
    };
}

async fn blog_handler(
) -> Result<ContentTemplate<impl askama::Template>, (axum::http::StatusCode, String)> {
    Ok(ContentTemplate {
        page_title: Some("NWS | Blog".to_string()),
        page_desc: Some("Read about the engineering behind NWS.".to_string()),
        content: BlogTemplate {
            blogs: blogs.values().cloned().collect::<Vec<BlogInfo>>()
        },
    })
}

async fn single_blog_handler(
    axum::extract::Path((blog_name)): axum::extract::Path<(String)>,
) -> Result<RawContentTemplate, (axum::http::StatusCode, String)> {
    let blog_content = match std::fs::read_to_string(format!("templates/blogs/{}.html", blog_name))
    {
        Ok(ctn) => ctn,
        _ => String::from("<h1>Not Found!</h1>"),
    };
    Ok(RawContentTemplate {
        page_title: Some("NWS | Blog Post".to_string()),
        page_desc: Some("A Nick Web Services Blog Post.".to_string()),
        content: blog_content,
    })
}

async fn dashboard_handler(
) -> Result<ContentTemplate<impl askama::Template>, (axum::http::StatusCode, String)> {
    Ok(ContentTemplate {
        page_title: Some("NWS | Dashboard".to_string()),
        page_desc: Some("Manage the services you have deployed on NWS.".to_string()),
        content: DashboardTemplate {},
    })
}

async fn index_handler(
    axum::extract::State(state): axum::extract::State<AppState>,
) -> Result<ContentTemplate<impl askama::Template>, (axum::http::StatusCode, String)> {
    let uptimes: Vec<Uptime> = state.uptime_service.get_data();
    let lu: DateTime<Utc> = state.uptime_service.get_last_updated().into();
    let lu_str = format!("{} UTC", lu.format("%B %e, %Y %T"));

    let mut uptime_infos: Vec<UptimeInfo> = vec![];

    for uptime in uptimes {
        if uptime.uptime_type != UptimeType::Provider {
            continue;
        }

        uptime_infos.push(UptimeInfo {
            name: uptime.name,
            uptime: uptime.uptime,
            response_time: uptime.response_time,
            status: match uptime.status {
                UptimeStatus::Up => String::from("Up"),
                UptimeStatus::Down => String::from("DOWN"),
                UptimeStatus::Maintenance => String::from("Undergoing Maintenance"),
                _ => String::from("Unknown"),
            },
            url: None,
        });
    }

    let index_template = IndexTemplate {
        uptime_infos,
        last_updated: lu_str,
    };
    Ok(ContentTemplate {
        page_title: None,
        page_desc: None,
        content: index_template,
    })
}

async fn status_handler(
    axum::extract::State(state): axum::extract::State<AppState>,
) -> Result<ContentTemplate<impl askama::Template>, (axum::http::StatusCode, String)> {
    let uptimes: Vec<Uptime> = state.uptime_service.get_data();
    let lu: DateTime<Utc> = state.uptime_service.get_last_updated().into();
    let lu_str = format!("{} UTC", lu.format("%B %e, %Y %T"));

    let mut dc_uptime_infos: Vec<UptimeInfo> = vec![];
    let mut sv_uptime_infos: Vec<UptimeInfo> = vec![];

    for uptime in uptimes {
        match uptime.uptime_type {
            UptimeType::Datacenter => {
                dc_uptime_infos.push(UptimeInfo {
                    name: uptime.name,
                    uptime: uptime.uptime,
                    response_time: uptime.response_time,
                    status: match uptime.status {
                        UptimeStatus::Up => String::from("Up"),
                        UptimeStatus::Down => String::from("DOWN"),
                        UptimeStatus::Maintenance => String::from("Undergoing Maintenance"),
                        _ => String::from("Unknown"),
                    },
                    url: None,
                });
            }
            UptimeType::Service => {
                sv_uptime_infos.push(UptimeInfo {
                    name: uptime.name,
                    uptime: uptime.uptime,
                    response_time: uptime.response_time,
                    status: match uptime.status {
                        UptimeStatus::Up => String::from("Up"),
                        UptimeStatus::Down => String::from("DOWN"),
                        UptimeStatus::Maintenance => String::from("Undergoing Maintenance"),
                        _ => String::from("Unknown"),
                    },
                    url: Some(uptime.url),
                });
            }
            _ => continue,
        }
    }

    let service_template = StatusTemplate {
        dctr_uptime_infos: dc_uptime_infos,
        svc_uptime_infos: sv_uptime_infos,
        last_updated: lu_str,
    };
    Ok(ContentTemplate {
        page_title: Some("NWS | System Status".to_string()),
        page_desc: Some("Check the health of NWS datacenters and services hosted on NWS.".to_string()),
        content: service_template,
    })
}
