import {Account, Namespace, Service, SessionKey} from "../nws-api/types";
import {
    useGetAccountNamespaces,
    useGetAccountServices,
    useGetServicesInNamespace,
    useLoggedInRedirect,
    useNWSAccount
} from "../nws-api/hooks";
import {useState} from "react";
import {enableSSL} from "../nws-api/calls";


export default function DashboardPage() {
    useLoggedInRedirect();
    let account: Account | undefined = useNWSAccount();
    let {setNs, services, ns} = useGetServicesInNamespace();
    let namespaces: Namespace[] = useGetAccountNamespaces();

    return(
      <div style={{minHeight: "100vh", padding: "50px"}}>
          <div className={"row"}>
            <h1 className={"col-md-10 col-12"}>Welcome to NWS, {account?.name}!</h1>
              <select className={"col-12 col-md-2"} defaultValue={"Select Namespace..."}>
                  <option value="" disabled selected>Select Namespace...</option>
                  {
                      namespaces.map((e)=>{
                          return <option onClick={(a)=>{setNs(e)}}>{e.name}</option>
                      })
                  }
                  <option value="" disabled>---</option>
                  <option value="create-ns">Create Namespace</option>
              </select>
          </div>
          <hr/>
          <div className={"d-flex justify-content-between"}>
              <h2>Container Deployment Services</h2>
              <button onClick={(e) => {window.location.href = "/cruise/new?namespaceId="+ns!.id}}>Create Cruise Service</button>
          </div>
          <div className={"row"}>

              {services.map((e)=>{
                  return (
                  <div className={"col-4"} style={{ padding: 5}}>
                      <div style={{backgroundColor: "#eee", borderRadius: 20, padding: 5}}>
                          <h3>{e.serviceName}</h3>
                          <p><b>Application Id</b></p>
                          <p>{e.serviceId}</p>
                          <a onClick={async ()=> {
                              let rawSession: string | null = localStorage.getItem("session_key");

                              if(rawSession != null) {
                                  let session: SessionKey = JSON.parse(rawSession);
                                  await enableSSL(account!.id!, e.serviceId, session);
                              }
                          }}>Enable SSL</a>
                      </div>
                  </div>);
              })}
          </div>
      </div>
    );
}
