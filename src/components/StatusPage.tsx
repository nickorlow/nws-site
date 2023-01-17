import NWSLogo from "../static/images/NWS_Logo.png";
import UptimeCard from "./UptimeCard";
import IncidentCard from "./IncidentCard";
import Footer from "./Footer";
import React, {useEffect, useState} from "react";
import {Incident, UptimeResponse} from "../nws-api/types";
import {getIncidents, getUptime} from "../nws-api/calls";
import "../App.css";


export default function StatusPage() {

    const [uptime, setUptime] = useState<UptimeResponse>({datacenters: [], services: [], competitors: [], lastUpdated: ""});
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
        <div className="App" style={{padding: 20}}>
            <div className={"text-left row"} style={{width: '75vw'}}>
                <h1>NWS System Status</h1>
                <p>Last updated at {new Date(uptime.lastUpdated).toLocaleString()}</p>
                <div className={"col-md-6 col-12"}>
                    <h3>Service Status</h3>
                    {uptime.services.map((e) => {
                        return (
                            <UptimeCard uptime={e} isService={true}/>
                        );
                    })}
                </div>
                <div className={"col-md-6 col-12"}>
                    <h3>Datacenter Status</h3>
                    {uptime.datacenters.map((e) => {
                        return (
                            <UptimeCard uptime={e} isService={false}/>
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
                    return (
                        <IncidentCard incident={e}/>
                    );
                })}
                {incidents.length == 0 &&
                    <div className={`row text-center`} style={{width: '75vw'}}>
                        <h5 className={"col-12"}>No service alerts.</h5>
                    </div>
                }
            </div>
        </div>
    );
}
