import React, {useEffect, useState} from 'react';
import NWSLogo from './static/images/NWS_Logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Incident, UptimeResponse} from "./nws-api/types";
import {getIncidents, getUptime} from "./nws-api/calls";

function App() {
    const [uptime, setUptime] = useState<UptimeResponse>({datacenters: [], services:[]});
    const [incidents, setIncidents] = useState<Incident[]>([]);

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

    return (
        <div className="App">
            <div className={"row w-100"}>
                <div className={"col-md-7 d-flex justify-content-center align-items-center flex-column"}>
                    <img src={NWSLogo} alt="nws-logo" style={{width: "70%"}}/>
                    <h1>Nick Web Services</h1>
                    <p style={{ maxWidth: 500}}>
                        Nick Web Services is a hosting service based out of
                        Austin, Texas. It is committed
                        to achieving maximum uptime with better performance and a lower cost than any of the major cloud
                        services.
                    </p>
                </div>
                <div className={"col-md-5 d-flex justify-content-center  align-items-center  flex-column"}>
                    <h3>Datacenter Status</h3>
                    <p>
                        <table>
                            <tr>
                                <th>Location</th>
                                <th>Uptime (Last Month)</th>
                                <th>Uptime (All Time)</th>
                                <th>Current Status</th>
                            </tr>
                            {uptime.datacenters.map((e) => {
                                    return (<tr>
                                        <td>{e.name}</td>
                                        <td>{e.uptimeMonth}%</td>
                                        <td>{e.uptimeAllTime}%</td>
                                        <td>{e.isUp ? 'Up' : 'Down'}</td>
                                    </tr>);
                            })}
                        </table>
                    </p>

                    <h3>Service Status</h3>
                    <p>
                        <table>
                            <tr>
                                <th>Service Name</th>
                                <th>Uptime (Last Month)</th>
                                <th>Uptime (All Time)</th>
                                <th>Current Status</th>
                            </tr>
                            {uptime.services.map((e) => {

                                    return (<tr>
                                        <td><a href={e.url}>{e.name}</a></td>
                                        <td>{e.uptimeMonth}%</td>
                                        <td>{e.uptimeAllTime}%</td>
                                        <td>{e.isUp ? 'Up' : 'Down'}</td>
                                    </tr>);

                            })}
                        </table>
                    </p>

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
                        <div className={`row text-left incident ${severityClass}-severity`} style={{width: '75vw'}}>
                            <p className={"col-10"}><b>{e.title}</b></p>
                            <p className={"col-2"}><b>{severityString} Severity</b></p>
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
