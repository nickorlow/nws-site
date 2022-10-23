import {Incident} from "../nws-api/types";
import ReactTooltip from "react-tooltip";
import React from "react";

export default function IncidentCard(props: {incident: Incident}) {

    const severityText: string[] = [
        "Low Severity means that this issue does not affect any services running on NWS.",
        "Medium Severity means that this issue may cause some slowdowns or outages on some services.",
        "High Severity means that this issue causes an outage on the entire NWS network or most of the services running on it."
    ];
    let severityClass: string = props.incident.severity == 0 ? 'low' : (props.incident.severity == 1 ? 'med' : 'high');
    let severityString: string = props.incident.severity == 0 ? 'Low' : (props.incident.severity == 1 ? 'Medium' : 'High');

    return (
        <div className={`row text-left nws-card`} style={{width: '75vw'}}>
            <p className={"col-md-10 col-12 mb-2"}><b>{props.incident.title}</b></p>
            <div className={`col-md-2 col-12 mb-2`}>
                <div className={`severity-label w-max-content ${severityClass}-severity`}
                     data-tip={severityText[props.incident.severity]}>
                    <b>
                        {severityString} Severity ⓘ
                    </b>
                    <ReactTooltip />
                </div>
            </div>
            <p className={"mb-0"}>{props.incident.description}</p>
        </div>
    );
}
