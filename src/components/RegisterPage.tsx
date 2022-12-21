import "./RegisterPage.css";
import {useState} from "react";
import {Account, ApiError} from "../nws-api/types";
import {useNonLoggedInRedirect} from "../nws-api/hooks";

export default function RegisterPage() {

    const [errorMessage, setErrorMessage] = useState<String>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [cpassword, setCpassword] = useState<string>("");
    const [inviteCode, setInviteCode] = useState<string>("");
    const [didRegister, setDidRegister] = useState<Boolean>(false);

    async function createAccount() {

        if(name == "" || email == "" || password == "" || cpassword == "" || inviteCode == "") {
            setErrorMessage("You must fill out all information before registering.")
            return;
        }

        if(cpassword != password) {
            setErrorMessage("Passwords don't match!")
            return;
        }

        if(!email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
            setErrorMessage("You have entered an invalid E-Mail address.")
            return;
        }

        let newAcc: Account = {
            email: email,
            name: name,
            password: password
        };

        fetch("https://api-nws.nickorlow.com/Account",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Invite-Code': inviteCode
            },
            body: JSON.stringify(newAcc)
        }).then((result) => {
            if(result.status == 200) {
                setDidRegister(true);
            } else {
                result.json().then((o: ApiError) => {
                    setErrorMessage(o.ErrorMessage);
                });
            }
        }).catch((e) =>{
            setErrorMessage("Server Error (This is NWS' fault)")
        });
    }

    useNonLoggedInRedirect();

    return(
        <div style={{minHeight: "100vh", display: "grid", width: "100%"}}>
            <div className={"reg-box"} style={{display: didRegister ? "none" : "flex"}}>
                <h3>Create an NWS Account</h3>

                { errorMessage != "" &&
                    <div className={"error-banner"}>
                        <p style={{color: "black"}}>{errorMessage}</p>
                    </div>
                }

                <p className={"reg-label"}>Name</p>
                <input onChange={(e)=>setName(e.target.value)} className={"reg-input"}/>

                <p className={"reg-label"}>E-Mail Address</p>
                <input onChange={(e)=>setEmail(e.target.value)} className={"reg-input"}/>

                <p className={"reg-label"}>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} className={"reg-input"} type={"password"}/>

                <p className={"reg-label"}>Confirm</p>
                <input onChange={(e)=>setCpassword(e.target.value)} className={"reg-input"} type={"password"}/>

                <div style={{width: "100%", marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: "#eee", borderRadius: 10}}>
                    <p className={"reg-label"}>Invite Code</p>
                    <input onChange={(e)=>setInviteCode(e.target.value)}  style={{width: "100%"}}/>
                    <small>Currently, NWS is invite only. Email me to get an invite code.</small>
                </div>

                <button onClick={createAccount} className={"reg-button"}>Create Account</button>
                <p>Already have an account? <a href={"/login"}>Login Here!</a></p>
            </div>

            <div className={"reg-box"} style={{display: didRegister ? "flex" : "none"}}>
                <h3>Verify your E-Mail address.</h3>

                <p>Please verify your E-Mail by clicking the link we sent to you at: <b>{email}</b></p>
            </div>
        </div>
    );
}