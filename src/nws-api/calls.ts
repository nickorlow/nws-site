import {Blog, Incident, Namespace, Service, SessionKey, UptimeResponse} from "./types";

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

export async function getBlogs(): Promise<Blog[]> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/blogs');
    let blogs: Blog[] = await response.json();
    return blogs;
}

export async function getSessionKey(accountId: string, password: string): Promise<SessionKey> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/Account/session',
        {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'id': accountId,
                'password': password
            })
        });

    let sessionKey: SessionKey = await response.json();
    return sessionKey;
}

export async function getNamespaces(accountId: string, skey: SessionKey): Promise<Namespace[]> {
    let response: Response = await fetch('https://api-nws.nickorlow.com/'+accountId+'/namespaces', {
        headers: {
            Authorization: skey.id
        }
    });
    let namespaces: Namespace[] = await response.json();
    return namespaces;
}

export async function enableSSL(accountId: string, serviceId: string, skey: SessionKey) {
    await fetch('https://api-nws.nickorlow.com/'+accountId+'/services/'+serviceId+"/ssl", {
        headers: {
            Authorization: skey.id
        },
        method: "POST"
    });
}
