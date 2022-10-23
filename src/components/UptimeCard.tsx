import {UptimeRecord} from "../nws-api/types";
import React from "react";
import '../App.css';

export default function UptimeCard(props: {uptime: UptimeRecord}) {
    return(
        <div className={"nws-card row mb-2"} style={{maxWidth: '100%'}}>
            {props.uptime.url != null && <h3 className={"col-md-9 col-12"}><a href={props.uptime.url} style={{textDecoration: "none"}}>{props.uptime.name}</a></h3>}
            {props.uptime.url == null && <h3 className={"col-md-9 col-12"}>{props.uptime.name}</h3>}

            <div className={`col-md-3 col-12 d-flex d-md-none justify-content-start`}>
                <p className={`fw-bold severity-label 
                                    ${props.uptime.isUp ? 'low' : (props.uptime.undergoingMaintenance ? 'med' : 'high')}-severity`}
                   style={{width: "max-content"}}>
                    {props.uptime.isUp ? 'Up' : (props.uptime.undergoingMaintenance ? 'Maintenance' : 'Down')}
                </p>
            </div>
            <div className={`d-md-flex col-md-3 col-12 d-none justify-content-end`}>
                <p className={`fw-bold severity-label 
                                    ${props.uptime.isUp ? 'low' : (props.uptime.undergoingMaintenance ? 'med' : 'high')}-severity`}
                   style={{width: "max-content"}}>
                    {props.uptime.isUp ? 'Up' : (props.uptime.undergoingMaintenance ? 'Maintenance' : 'Down')}
                </p>
            </div>
            <p className={"col-md-12 col-12"}><b>Last Month Uptime:</b> {props.uptime.uptimeMonth}%</p>
            <p className={"col-md-6 col-12"}><b>All Time Uptime:</b> {props.uptime.uptimeAllTime}%</p>
        </div>
    );
}
