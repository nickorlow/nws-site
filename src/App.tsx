import React, {useEffect, useState} from 'react';
import NWSLogo from './static/images/NWS_Logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Incident, UptimeResponse} from "./nws-api/types";
import {getIncidents, getUptime} from "./nws-api/calls";
import ReactTooltip from 'react-tooltip';

function App() {

    const [uptime, setUptime] = useState<UptimeResponse>({datacenters: [], services:[], lastUpdated: ""});
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const severityText: string[] = [
        "Low Severity means that this issue does not affect any services running on NWS.",
        "Medium Severity means that this issue may cause some slowdowns or outages on some services.",
        "High Severity means that this issue causes an outage on the entire NWS network or most of the services running on it."
    ];

    const fetchUptime = async () => {
        let resp: UptimeResponse = await getUptime();
        setUptime(resp);
    }

    const fetchIncidents = async () => {
        let resp: Incident[] = await getIncidents();
        setIncidents(resp);
    }

    useEffect(() => {
        fetchUptime();
        fetchIncidents();
    }, []);

    // @ts-ignore
    return (
        <div className="App">


                <div className={"w-100 row"}>
                    <div className={"col-md-6 d-flex justify-content-center flex-column align-items-center"}>
                        <img src={NWSLogo} alt="nws-logo" style={{width: "70%"}}/>
                    </div>
                    <div className={"col-md-6 text-center d-flex justify-content-center flex-column align-items-center"}>
                        <h1>Nick Web Services</h1>
                        <p style={{ maxWidth: 500 }} className={"col-md-6 text-center"}>
                            Nick Web Services is a hosting service based out of
                            Austin, Texas. It is committed
                            to achieving maximum uptime with better performance and a lower cost than any of the major cloud
                            services.
                        </p>
                    </div>
                </div>
            <div style={{width: '75vw'}}>
                <hr/>
            </div>

            <div className={"text-left row"} style={{width: '75vw'}}>

                <h2>NWS System Status</h2>
                <p>Last updated at {new Date(uptime.lastUpdated).toLocaleString()}</p>
                <div className={"col-md-6 col-12"}>
                     <h3>Service Status</h3>
                        {uptime.services.map((e) => {
                            return (
                                <div className={"nws-card row mb-2"} style={{maxWidth: '100%'}}>
                                    <h3 className={"col-md-9 col-12"}><a href={e.url} style={{textDecoration: "none"}}>{e.name}</a></h3>
                                    <div className={`col-md-3 col-12 d-flex d-md-none justify-content-start`}>
                                        <p className={`fw-bold severity-label 
                                    ${e.isUp ? 'low' : (e.undergoingMaintenance ? 'med' : 'high')}-severity`}
                                           style={{width: "max-content"}}>
                                            {e.isUp ? 'Up' : (e.undergoingMaintenance ? 'Maintenance' : 'Down')}
                                        </p>
                                    </div>
                                    <div className={`d-md-flex col-md-3 col-12 d-none justify-content-end`}>
                                        <p className={`fw-bold severity-label 
                                    ${e.isUp ? 'low' : (e.undergoingMaintenance ? 'med' : 'high')}-severity`}
                                           style={{width: "max-content"}}>
                                            {e.isUp ? 'Up' : (e.undergoingMaintenance ? 'Maintenance' : 'Down')}
                                        </p>
                                    </div>
                                    <p className={"col-md-12 col-12"}><b>Last Month Uptime:</b> {e.uptimeMonth}%</p>
                                    <p className={"col-md-6 col-12"}><b>All Time Uptime:</b> {e.uptimeAllTime}%</p>
                                </div>
                            );
                        })}
                </div>
                <div className={"col-md-6 col-12"}>
                    <h3>Datacenter Status</h3>
                    {uptime.datacenters.map((e) => {
                        return (
                            <div className={"nws-card row mb-2"} style={{maxWidth: '100%'}}>
                                <h3 className={"col-md-9 col-12"}>{e.name}</h3>
                                <div className={`col-md-3 col-12 d-flex d-md-none justify-content-start`}>
                                    <p className={`fw-bold severity-label 
                                    ${e.isUp ? 'low' : (e.undergoingMaintenance ? 'med' : 'high')}-severity`}
                                       style={{width: "max-content"}}>
                                        {e.isUp ? 'Up' : (e.undergoingMaintenance ? 'Maintenance' : 'Down')}
                                    </p>
                                </div>
                                <div className={`d-md-flex col-md-3 col-12 d-none justify-content-end`}>
                                    <p className={`fw-bold severity-label 
                                    ${e.isUp ? 'low' : (e.undergoingMaintenance ? 'med' : 'high')}-severity`}
                                       style={{width: "max-content"}}>
                                        {e.isUp ? 'Up' : (e.undergoingMaintenance ? 'Maintenance' : 'Down')}
                                    </p>
                                </div>
                                <p className={"col-md-12 col-12"}><b>Last Month Uptime:</b> {e.uptimeMonth}%</p>
                                <p className={"col-md-6 col-12"}><b>All Time Uptime:</b> {e.uptimeAllTime}%</p>
                            </div>
                        );
                    })}
                </div>

            </div>

            <div style={{width: '75vw'}}>
                <hr/>
            </div>
            <div>
                <h3>Service Alerts</h3>
                {incidents.map((e) => {
                    let severityClass: string = e.severity == 0 ? 'low' : (e.severity == 1 ? 'med' : 'high');
                    let severityString: string = e.severity == 0 ? 'Low' : (e.severity == 1 ? 'Medium' : 'High');
                    return (
                        <div className={`row text-left nws-card`} style={{width: '75vw'}}>
                            <p className={"col-md-10 col-12 mb-2"}><b>{e.title}</b></p>
                            <div className={`col-md-2 col-12 mb-2`}>
                                <b className={`severity-label w-min-content ${severityClass}-severity`}
                                   data-tip={severityText[e.severity]}>
                                    {severityString} Severity ⓘ
                                </b>
                                <ReactTooltip />
                            </div>
                            <p className={"mb-0"}>{e.description}</p>
                        </div>
                    );
                })}
                {incidents.length == 0 &&  <div className={`row text-center`} style={{width: '75vw'}}>
                    <h5 className={"col-12"}>No service alerts.</h5>
                </div>}
            </div>


            <footer style={{margin: 25}}>
                NWS is owned and operated by <a href={"http://nickorlow.com"}>Nicholas Orlowsky</a>.
            </footer>
        </div>
    );
}

export default App;
