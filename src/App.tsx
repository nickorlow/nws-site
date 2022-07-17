import React, {useEffect, useState} from 'react';
import NWSLogo from './static/images/NWS_Logo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const today = new Date();
    const setup_time = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const [monitors, setMonitors] = useState(new Array<any>());

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("api_key", "ur1612363-492fa5df2a31fab5b52171b4");

        urlencoded.append("custom_uptime_ranges", (setup_time.valueOf() / 1000) + "_" + (today.valueOf() / 1000));
        urlencoded.append("all_time_uptime_ratio", "1");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        // @ts-ignore
        fetch("https://api.uptimerobot.com/v2/getMonitors", requestOptions)
            .then(response => response.json().then(json => {
                setMonitors(json.monitors);
            }))
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }, []);

    let diff = new Date().getTime() - setup_time.getTime();

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    let hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    let mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    let seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    return (
        <div className="App">
            <div className={"row w-100"}>
                <div className={"col-md-7 d-flex justify-content-center align-items-center flex-column"}>
                    <img src={NWSLogo} alt="nws-logo" style={{width: "70%"}}/>
                    <h1>Nick Web Services</h1>
                    <p style={{ maxWidth: 500}}>
                        Nick Web Services is a hosting service based out of
                        Austin, Texas. It is committed
                        to achieving maximum uptime with better performance and a lower cost than any of the major cloud
                        services.
                    </p>
                </div>
                <div className={"col-md-5 d-flex justify-content-center  align-items-center  flex-column"}>
                    <h3>Datacenter Status</h3>
                    <p>
                        <table>
                            <tr>
                                <th>Location</th>
                                <th>Uptime (Last Month)</th>
                                <th>Uptime (All Time)</th>
                                <th>Current Status</th>
                            </tr>
                            {monitors.map((e) => {
                                let name_parts = e.friendly_name.split('.');
                                if (name_parts[0] === 'datacenter') {
                                    return (<tr>
                                        <td>{name_parts[1]}</td>
                                        <td>{e.custom_uptime_ranges}%</td>
                                        <td>{e.all_time_uptime_ratio}%</td>
                                        <td>{e.status === 2 ? 'Up' : 'Down'}</td>
                                    </tr>);

                                }
                            })}
                        </table>
                    </p>

                    <h3>Service Status</h3>
                    <p>
                        <table>
                            <tr>
                                <th>Service Name</th>
                                <th>Uptime (Last Month)</th>
                                <th>Uptime (All Time)</th>
                                <th>Current Status</th>
                            </tr>
                            {monitors.map((e) => {
                                let name_parts = e.friendly_name.split('.');
                                if (name_parts[0] === 'service') {
                                    return (<tr>
                                        <td><a href={e.url}>{name_parts[1]}</a></td>
                                        <td>{e.custom_uptime_ranges}%</td>
                                        <td>{e.all_time_uptime_ratio}%</td>
                                        <td>{e.status === 2 ? 'Up' : 'Down'}</td>
                                    </tr>);

                                }
                            })}
                        </table>
                    </p>
                </div>
            </div>
            <footer style={{margin: 25}}>
                NWS is owned and operated by <a href={"http://nickorlow.com"}>Nicholas Orlowsky</a>.
            </footer>
        </div>
    );
}

export default App;
