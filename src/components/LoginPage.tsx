import "./Login.css";
import {useEffect, useState} from "react";
import {Account, ApiError, SessionKey} from "../nws-api/types";
import {useNonLoggedInRedirect} from "../nws-api/hooks";

export default function LoginPage() {

    useNonLoggedInRedirect();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    function loginUser() {
        if(email == "" || password == "") {
            setErrorMessage("Please enter an email and password");
            return;
        }

        let acc: Account = {
            email: email,
            password: password
        };

        fetch("https://api-nws.nickorlow.com/Account/session",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(acc)
        }).then((result) => {
            if(result.status == 200) {
                result.json().then((o: SessionKey)=>{
                    localStorage.setItem("session_key", JSON.stringify(o));
                    window.location.href = '/dashboard';
                });

            } else {
                setErrorMessage("Server Error (This is NWS' fault)");
            }
        }).catch((e) =>{
            setErrorMessage("Server Error (This is NWS' fault)");
        });
    }

    return(
        <div style={{minHeight: "100vh", display: "grid", width: "100%"}}>
            <div className={"login-box"}>
                <h3>Login to NWS Dashboard</h3>
                { errorMessage != "" &&
                    <div className={"error-banner"}>
                        <p style={{color: "black"}}>{errorMessage}</p>
                    </div>
                }
                <p className={"login-label"}>E-Mail Address</p>
                <input onChange={(e)=>{setEmail(e.target.value)}} className={"login-input"}/>
                <p className={"login-label"}>Password</p>
                <input onChange={(e)=>{setPassword(e.target.value)}}className={"login-input"} type={"password"}/>
                <button className={"login-button"} onClick={loginUser}>Login</button>
                <p>No account? <a href={"/register"}>Register Here!</a></p>
            </div>
        </div>
    );
}