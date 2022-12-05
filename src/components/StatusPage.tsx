import NWSLogo from "../static/images/NWS_Logo.png";
import UptimeCard from "./UptimeCard";
import IncidentCard from "./IncidentCard";
import Footer from "./Footer";
import React, {useEffect, useState} from "react";
import {Incident, UptimeResponse} from "../nws-api/types";
import {getIncidents, getUptime} from "../nws-api/calls";
import "../App.css";


export default function StatusPage() {

    const [uptime, setUptime] = useState<UptimeResponse>({datacenters: [], services: [], lastUpdated: ""});
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

    return(
        <div className="App">

            <div className={"w-100 row"}>
                <div className={"col-md-6 d-flex justify-content-center flex-column align-items-center"}>
                    <img src={NWSLogo} alt="nws-logo" style={{width: "70%"}}/>
                </div>
                <div className={"col-md-6 text-center d-flex justify-content-center flex-column align-items-center"}>
                    <h1>Nick Web Services</h1>
                    <p style={{maxWidth: 500}} className={"col-md-6 text-center"}>
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
                            <UptimeCard uptime={e}/>
                        );
                    })}
                </div>
                <div className={"col-md-6 col-12"}>
                    <h3>Datacenter Status</h3>
                    {uptime.datacenters.map((e) => {
                        return (
                            <UptimeCard uptime={e}/>
                        );
                    })}
                </div>
            </div>

            <div style={{width: '75vw'}}>
                <hr/>
            </div>

            <div>
                <h3>Service Alerts</h3>
                {incidents !== null && incidents.map((e) => {
                    return (
                        <IncidentCard incident={e}/>
                    );
                })}
                {(incidents !== null || incidents.length == 0) &&
                    <div className={`row text-center`} style={{width: '75vw'}}>
                        <h5 className={"col-12"}>No service alerts.</h5>
                    </div>
                }
            </div>
        </div>
    );
}
