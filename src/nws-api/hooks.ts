import {useEffect, useState} from "react";
import {Account, Namespace, Service, SessionKey} from "./types";

export function useNonLoggedInRedirect() {
    useEffect(()=>{
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            if(session.expiry < new Date()) {
                localStorage.removeItem("session_key");
            } else {
                window.location.href = "/dashboard";
            }
        }
    }, []);
    return true;
}

export function useLoggedInRedirect() {
    useEffect(()=>{
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            if(session.expiry > new Date()) {
                window.location.href = "/login";
            }
        } else {
            window.location.href = "/login";
        }
    }, []);
    return true;
}

export function useGetAccountServices() {
    const [services, setService] = useState<Service[]>([]);

    useEffect(() => {
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            fetch("https://api-nws.nickorlow.com/Account/services?accountId=" + session.accountId,
                {
                    headers: {
                        "Authorization": btoa(session.accountId + ":" + session.id)
                    }
                }).then((response)=>{
                    response.json().then((svcs: Service[]) => {
                        console.log(svcs)
                        setService(svcs);
                    });
                });
        }
    }, []);

    return services;
}

export function useGetAccountNamespaces() {
    const [namespaces, setNamespaces] = useState<Namespace[]>([]);

    useEffect(() => {
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            fetch("https://api-nws.nickorlow.com/Account/" + session.accountId + "/namespaces",
                {
                    headers: {
                        "Authorization": btoa(session.accountId + ":" + session.id)
                    }
                }).then((response)=>{
                response.json().then((svcs: Namespace[]) => {
                    console.log(svcs)
                    setNamespaces(svcs);
                });
            });
        }
    }, []);

    return namespaces;
}

export function useNWSAuthKey() {
    const [key, setKey] = useState('');
    useEffect(() => {
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            setKey(btoa(session.accountId + ":" + session.id))
        }
    }, []);

    return key;
}

export function useGetServicesInNamespace() {
    const [services, setServices] = useState<Service[]>([]);
    const [ns, setNs] = useState<Namespace | null>(null);
    useEffect(() => {
        console.log(ns !== null ? ns.id : "null")
        if(ns === null) return;
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            fetch("https://api-nws.nickorlow.com/Account/" + session.accountId + "/namespaces/" + ns.id + "/services",
                {
                    headers: {
                        "Authorization": btoa(session.accountId + ":" + session.id)
                    }
                }).then((response)=>{
                response.json().then((svcs: Service[]) => {
                    console.log(svcs)
                    setServices(svcs);
                });
            });
        }
    }, [ns]);

    return {setNs, services, ns};
}

export function useNWSAccount() {
    const [accountInfo, setAccountInfo] = useState<Account>();

    useEffect(()=>{
        let rawSession: string | null = localStorage.getItem("session_key");

        if(rawSession != null) {
            let session: SessionKey = JSON.parse(rawSession);
            fetch("https://api-nws.nickorlow.com/Account/"+session.accountId, {
                headers: {
                    "Authorization": btoa(session.accountId+":"+session.id)
                }
            }).then((e)=>{
                if(e.status == 200) {
                    e.json().then((o: Account) => {
                        setAccountInfo(o)
                    })
                } else {
                    localStorage.removeItem("session_key");
                    window.location.href = "/login";
                }
            });
        } else {
            localStorage.removeItem("session_key");
            window.location.href = "/login";
        }
    }, []);

    return accountInfo;
}
