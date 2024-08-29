import {Account, Namespace, Service, SessionKey} from "../nws-api/types";
import {
    useGetAccountNamespaces,
    useGetAccountServices,
    useGetServicesInNamespace,
    useLoggedInRedirect,
    useNWSAccount,
    useNWSAuthKey
} from "../nws-api/hooks";
import {
    createNamespace 
} from "../nws-api/calls"
import {useState, useEffect} from "react";
import {enableSSL} from "../nws-api/calls";


export default function DashboardPage() {
    useLoggedInRedirect();
    let account: Account | undefined = useNWSAccount();
    let {setNs, services, ns} = useGetServicesInNamespace();
    let namespaces: Namespace[] = useGetAccountNamespaces();

    const urlParams = new URLSearchParams(window.location.search);

    return(
      <div style={{minHeight: "100vh", padding: "50px"}}>
          <div className={"row"}>
            <p>I don't really know what I was on when I wrote this but a lot of things in the web ui are goofy, sorry about that.. :/ A new one is on its way.</p>
            <h1 className={"col-md-10 col-12"}>Welcome to NWS, {account?.name}!</h1>
              <div className={"col-12 col-md-2"}>
                <p>Namespace</p>
                <select className="w-100">
                    <option value="" disabled selected={!urlParams.has('namespace')}>Select Namespace...</option>
                    {
                        namespaces.map((e)=>{
                            if (urlParams.get('namespace') === e.id && ns?.id != e.id)
                                setNs(e);
                            return <option onClick={(a)=>{
                                const url = new URL(window.location.toString());
                                url.searchParams.set('namespace', e.id);
                                window.history.pushState(null, '', url.toString());
                                setNs(e);
                            }} selected={urlParams.get('namespace') === e.id}>{e.name}</option>
                        })
                    }
                </select>
                <div>
                <button className="w-100 p-0 mt-2" onClick={async () => {
                    let name = prompt("Enter a name for the namespace");
                    let rawSession: string | null = localStorage.getItem("session_key");

                    if (rawSession != null) {
                        let session: SessionKey = JSON.parse(rawSession);
                        let newNamespace = await createNamespace(name!, account!.id!, session);
                        const url = new URL(window.location.toString());
                        url.searchParams.set('namespace', newNamespace.id);
                        window.history.pushState(null, '', url.toString());
                        window.location.reload();
                    } else {
                        alert("Error creating namespace");
                    }
                }}>
                 Create Namespace
                </button>
                </div>
              </div>
          </div>
          <hr/>
          <div className={"d-flex justify-content-between"}>
              <h2>Container Deployment Services</h2>
              <button onClick={(e) => {
                  if (ns != null)
                    window.location.href = "/cruise/new?namespaceId="+ns!.id
                  else
                      alert("Please select a namespace!")
              }}>Create Container Deployment</button>
          </div>
          <div className={"row"}>

              {services.map((e)=>{
                  return (
                  <div className={"col-4"} style={{ padding: 5}}>
                      <div style={{backgroundColor: "#eee", borderRadius: 20, padding: 5}}>
                          <h3>{e.serviceName}</h3>
                          <p><b>Application Id</b></p>
                          <p>{e.serviceId}</p>
                          {e.hostnames.map((host)=>{
                              return (
                                  <div className={"mb-2 p-2 d-flex justify-content-between"}>
                                      <a href={"http://"+host.hostname}>{host.hostname}</a>
                                      {!host.isSslEnabled ? <div><button onClick={async () => {
                                          let rawSession: string | null = localStorage.getItem("session_key");

                                          if (rawSession != null) {
                                              let session: SessionKey = JSON.parse(rawSession);
                                              await enableSSL(account!.id!, e.serviceId, host.hostname, session);
                                              alert(`SSL has been enabled on the hostname ${host.hostname}. It should be ready in 2-5 minutes.`);
                                              // hack but whatever
                                              window.location.reload();
                                          }
                                      }}>Enable SSL</button></div> : <p>SSL is enabled!</p>
                                      }
                                  </div>
                              )
                          })}

                      </div>
                  </div>);
              })}
          </div>
      </div>
    );
}
