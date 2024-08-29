import NWSLogo from "../static/images/NWS_Logo_Transparent.png";
import UptimeCard from "./UptimeCard";
import IncidentCard from "./IncidentCard";
import Footer from "./Footer";
import React, {useEffect, useState} from "react";
import {Incident, UptimeResponse} from "../nws-api/types";
import {getIncidents, getUptime} from "../nws-api/calls";
import "../App.css";
import UptimeComparisonCard from "./UptimeComparisonCard";
import UptimeLabelCard from "./UptimeLabelCard";


export default function HomePage() {

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
        <div className="App">
            <div className={"w-100 row"}>
                <div className={"col-md-6 d-flex justify-content-center flex-column align-items-center"}>
                    <img src={NWSLogo} alt="nws-logo" style={{width: "70%"}}/>
                </div>
                <div className={"col-md-6 text-center d-flex justify-content-center flex-column align-items-center"}>
                    <h1>Sharpe Mountain Compute</h1>
                    <p  className={"col-md-6 text-center"}>
                      Sharpe Mountain Compute (fka Nick Web Services) is a reliable cloud compute provider. SMC is dedicated to achieving maximum uptime at a lower cost than traditional cloud compute providers.
                    </p>
                </div>
            </div>
            <div className={"w-100 mt-2 flex justify-content-center align-content-center text-center"}>
                <h3><i>100% Uptime from 1/1/2023 - 11/8/2023</i></h3>
                <h4><a href={"https://youtu.be/WHdXWMFHuqA"} target="_blank" rel="noopener noreferrer">Watch the SMC Deployment Demo</a></h4>
            </div>
            <div style={{width: '75vw'}}>
                <hr/>
            </div>

            <div className={"text-left row"} style={{width: '75vw'}}>
                <h2>Compare us to our competitors</h2>
                <p>Last updated at {new Date(uptime.lastUpdated).toLocaleString()}</p>
                <div className={"col-12 row w-100 m-0 align-content-center d-flex justify-content-center pt-2"}>
                    <UptimeLabelCard/>
                    {uptime.competitors.sort((a,b)=>{return b.uptimeMonth === a.uptimeMonth ? (a.name === "NWS" ? -1000 : b.name.localeCompare(a.name)) : b.uptimeMonth - a.uptimeMonth}).map((e) => {
                        return (
                            <UptimeComparisonCard uptime={e} isService={false}/>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
