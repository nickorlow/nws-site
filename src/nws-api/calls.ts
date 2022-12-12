import {Incident, UptimeResponse} from "./types";

export async function getUptime(): Promise<UptimeResponse> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/uptime');
    let uptime: UptimeResponse = await response.json();
    return uptime;
}

export async function getIncidents(): Promise<Incident[]> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/incidents');
    try {
        let incidents: Incident[] = await response.json();
        if(incidents === null || incidents === undefined || !Array.isArray(incidents)) return [];
        return incidents;
    } catch (e) {
        return [];
    }
}

