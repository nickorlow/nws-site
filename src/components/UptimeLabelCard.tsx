import {UptimeRecord} from "../nws-api/types";
import React, {useState} from "react";
import '../App.css';
import "./UptimeCard.css"
import Modal from "react-modal";

export default function UptimeLabelCard() {

    return(
        <div className={"col-2 p-0 d-none d-lg-block mb-2 m-0 text-center"}>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}   style={{fontSize: ".9em"}}>Service Name</p>
            </div>
                <hr className={"w-100"}/>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}  style={{fontSize: ".9em"}}>Uptime (Last Month)</p>
            </div>

            <hr className={"w-100"}/>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}   style={{fontSize: ".9em"}}>Uptime ({new Date().getFullYear()} YTD)</p>
            </div>
            <hr className={"w-100"}/>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}   style={{fontSize: ".9em"}}>Avg Response Time (24hr)</p>
            </div>

            <hr className={"w-100"}/>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}   style={{fontSize: ".9em"}}>Current Status</p>
            </div>

        </div>
    );
}
