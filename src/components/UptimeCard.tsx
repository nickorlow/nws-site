import {UptimeRecord} from "../nws-api/types";
import React, {useState} from "react";
import '../App.css';
import "./UptimeCard.css"
import Modal from "react-modal";

export default function UptimeCard(props: {uptime: UptimeRecord, isService: boolean}) {
    const [isModalOpen, setModalOpen] = useState(false);
    return(
        <div className={"nws-card row mb-2 m-0"} style={{maxWidth: '100%'}}>
           <h4 className={"col-md-9 col-12 uptime-lnk"} onClick={()=>setModalOpen(true)}>{props.uptime.name}</h4>

            <div className={`col-md-3 col-12 d-flex d-md-none justify-content-start`}>
                <p className={`fw-bold severity-label w-100
                                    ${props.uptime.isUp ? 'low' : (props.uptime.undergoingMaintenance ? 'med' : 'high')}-severity`}
                   >
                    {props.uptime.isUp ? 'Up' : (props.uptime.undergoingMaintenance ? 'Maintenance' : 'Down')}
                </p>
            </div>
            <div className={`d-md-flex col-md-3 col-12 d-none justify-content-end`}>
                <p className={`fw-bold severity-label 
                                    ${props.uptime.isUp ? 'low' : (props.uptime.undergoingMaintenance ? 'med' : 'high')}-severity`}
                   style={{width: "max-content", height: 'max-content'}}>
                    {props.uptime.isUp ? 'Up' : (props.uptime.undergoingMaintenance ? 'Maintenance' : 'Down')}
                </p>
            </div>
            <p className={"col-md-12 col-12"}><b>Last Month Uptime:</b> {props.uptime.uptimeMonth}%</p>
            <p className={"col-md-6 col-12"}><b>{new Date().getFullYear()} Uptime:</b> {props.uptime.uptimeYtd}%</p>
            <p className={"col-md-6 col-12"}><b>Avg Response Time:</b> {props.uptime.averageResponseTime}ms</p>
            <Modal className={"uptime-modal"} isOpen={isModalOpen}>
                <div className={"mb-3"}>
                    <h1 className={"mb-0"}>{props.uptime.name}</h1>
                    {props.uptime.url && <p>(<a href={props.uptime.url}>{props.uptime.url}</a>)</p>}
                </div>
                <div className={"mb-3"}>
                    <p>Monitoring since {props.uptime.monitorStart}</p>
                    <p><b>{new Date().getFullYear()} Uptime (YTD):</b> {props.uptime.uptimeYtd}%</p>
                    <p><b>Last Month Uptime:</b> {props.uptime.uptimeMonth}%</p>
                    <p><b>All-Time Uptime:</b> {props.uptime.uptimeAllTime}%</p>
                    <p><b>Average Response Time:</b> {props.uptime.averageResponseTime}ms</p>
                </div>
                {
                    props.isService &&
                    <div className={"mb-3"}>
                        <i>Note that the uptime and performance of services hosted on NWS may be affected by factors not controlled by NWS such as bad bad optimization or buggy software.</i>
                    </div>
                }
                <button className={"w-100"} onClick={()=>setModalOpen(false)}>Close</button>
            </Modal>
        </div>
    );
}
