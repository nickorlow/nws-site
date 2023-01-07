import {Account, Service} from "../nws-api/types";
import {useGetAccountServices, useLoggedInRedirect, useNWSAccount} from "../nws-api/hooks";


export default function DashboardPage() {
    useLoggedInRedirect();
    let account: Account | undefined = useNWSAccount();
    let services: Service[] = useGetAccountServices();

    return(
      <div style={{minHeight: "100vh", padding: "50px"}}>
          <h1>Welcome to NWS, {account?.name}!</h1>
          <hr/>
          <div className={"d-flex justify-content-between"}>
              <h2>Your NWS Cruise™ Services</h2>
              <button onClick={(e) => {window.location.href = "/cruise/new"}}>Create Cruise Service</button>
          </div>
          {/*<h2>Your NWS Write™ Blogs</h2>*/}
          <div className={"row"}>
              {services.map((e)=>{
                  return (
                  <div className={"col-4"} style={{ padding: 5}}>
                      <div style={{backgroundColor: "#eee", borderRadius: 20, padding: 5}}>
                          <h3>{e.serviceName}</h3>
                          <p><b>Application Id</b></p>
                          <p>{e.serviceId}</p>
                          <p><b>Deployment Key</b></p>
                          <a href={"#regen"}>Regenerate Deploy Key</a>
                      </div>
                  </div>);
              })}
          </div>
      </div>
    );
}