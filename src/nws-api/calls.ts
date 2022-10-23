import {Blog, Incident, UptimeResponse} from "./types";

export async function getUptime(): Promise<UptimeResponse> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/uptime');
    let uptime: UptimeResponse = await response.json();
    return uptime;
}

export async function getIncidents(): Promise<Incident[]> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/incidents');
    let incidents: Incident[] = await response.json();
    return incidents;
}

export async function getBlogs(): Promise<Blog[]> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/blogs');
    let blogs: Blog[] = await response.json();
    return blogs;
}


