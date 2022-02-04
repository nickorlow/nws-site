import React, {useEffect, useState} from 'react';
import NWSLogo from './static/images/NWS_Logo.png';
import './App.css';

function App() {
    const setup_time = 1643927861;
    const[uptime, setUptime] = useState("100%");
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("api_key", "ur1612363-492fa5df2a31fab5b52171b4");
        urlencoded.append("monitors", "790552884");
        urlencoded.append("custom_uptime_ranges", setup_time+"_"+(new Date().valueOf()/1000));
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
                setUptime(json.monitors[0].custom_uptime_ranges);
            }))
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }, []);

    let diff = new Date().getTime() - new Date(setup_time*1000).getTime();

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -=  days * (1000 * 60 * 60 * 24);

    let hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    let mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    let seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    return (
        <div className="App">
          <header className="App-header">
            <img src={NWSLogo} alt="nws-logo" />
            <p>
              NWS has had {uptime}% uptime since {(new Date(setup_time*1000)).toLocaleString()}
            </p>
              {uptime === "100.000" &&
                  <p>
                      Continuous 100% SLA uptime for {days + " days, " + hours + " hours, " + mins + " minutes, " + seconds + " seconds"}
                  </p>
              }
          </header>
        </div>
      );
}

export default App;
