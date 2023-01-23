import {UptimeRecord} from "../nws-api/types";
import React, {useState} from "react";
import '../App.css';
import "./UptimeCard.css"
import Modal from "react-modal";

export default function UptimeLabelCard() {

    return(
        <div className={"col-2 p-0 d-none d-md-block mb-2 m-0 text-center"}>
            <div style={{height: 25, margin: 0}}>
                <p className={"fw-bold"}>Service Name</p>
            </div>
                <hr/>
                <p className={"fw-bold"}>Uptime (Last Month)</p>
                <hr/>
                <p className={"fw-bold"}>Uptime ({new Date().getFullYear()} YTD)</p>
                <hr/>
                <p className={"fw-bold"}>Avg Response Time (24hr)</p>
                <hr/>
                <p className={"fw-bold"}>Current Status</p>
        </div>
    );
}
