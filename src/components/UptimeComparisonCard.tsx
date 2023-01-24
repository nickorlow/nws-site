import {UptimeRecord} from "../nws-api/types";
import React, {useState} from "react";
import '../App.css';
import "./UptimeCard.css"
import Modal from "react-modal";

function getUptimeClass(uptime: number) {
    if(uptime === 100) {
        return "stat-perfect";
    }

    if(uptime >= 95) {
        return "stat-middle";
    }

    return "stat-bad";
}

function getResponseTimeClass(respTime: number) {
    // https://www.littledata.io/average/server-response-time
    if(respTime < 205) {
        return "stat-perfect";
    }

    if(respTime < 495) {
        return "stat-middle";
    }

    return "stat-bad";
}

export default function UptimeComparisonCard(props: {uptime: UptimeRecord, isService: boolean}) {
    const [isModalOpen, setModalOpen] = useState(false);
    return(
        <div className={"col-12 col-md-2 mb-2 p-0 m-0 text-center nws-card-md"}>
                <div style={{height: 25, margin: 0}} className={"pt-2 pt-md-0"}>
                   <h4 className={"uptime-lnk"} onClick={()=>setModalOpen(true)}>{props.uptime.name}</h4>
                </div>
                <hr/>
                <p className={"fw-bold d-md-none"}>Uptime (Last Month)</p>
                <p className={getUptimeClass(props.uptime.uptimeMonth)}>{props.uptime.uptimeMonth}%</p>
                <hr className={"d-md-block d-none"}/>
                <p className={"fw-bold d-md-none"}>Uptime ({new Date().getFullYear()} YTD)</p>
                <p  className={getUptimeClass(props.uptime.uptimeYtd)}>{props.uptime.uptimeYtd}%</p>
                <hr className={"d-md-block d-none"}/>
                <p className={"fw-bold d-md-none"}>Avg Response Time (24hr)</p>
                <p  className={getResponseTimeClass(props.uptime.averageResponseTime)}>{props.uptime.averageResponseTime}ms</p>
                <hr className={"d-md-block d-none"}/>
                <p className={"fw-bold d-md-none"}>Current Status</p>
                <div className={`p-1 d-flex justify-content-start w-100`}>
                    <p className={`fw-bold severity-label w-100
                                        ${props.uptime.isUp ? 'low' : (props.uptime.undergoingMaintenance ? 'med' : 'high')}-severity`}
                    >
                        {props.uptime.isUp ? 'Up' : (props.uptime.undergoingMaintenance ? 'Maintenance' : 'Down')}
                    </p>
                </div>
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
