import "./RegisterPage.css";
import {useEffect, useState} from "react";
import {Account, SessionKey} from "../nws-api/types";
import {useSearchParams} from "react-router-dom";
import {Session} from "inspector";

export default function VerifyPage() {
    const [pageState, setPageState] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(()=>{
        let verificationKey: string | null = searchParams.get("key");

        if(verificationKey == null) {
            setPageState("invalid_code");
            return;
        } else {
            fetch("https://api-nws.nickorlow.com/Account/verify?verificationKey=" + verificationKey, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.status == 200) {
                    result.json().then((o: SessionKey)=>{
                        localStorage.setItem("session_key", JSON.stringify(o));
                        window.location.href = '/dashboard';
                    });
                }

                if (result.status == 500) {
                    setPageState("server_error");
                } else {
                    result.json().then((o) => {
                        if (o.ErrorMessage == "Invalid verification key.") {
                            setPageState("invalid_code");
                        } else {
                            setPageState("expired_code");
                        }
                    });
                }
            }).catch((e) => {
                setPageState("invalid_code");
            });
        }
    }, [])

    return(
        <div style={{minHeight: "100vh", display: "grid", width: "100%"}}>
            <div className={"reg-box"} style={{display: pageState == "invalid_code" ? "flex" : "none"}}>
                <h3>Uh Oh!</h3>

                <p>Looks like the verification code you provided didn't work!</p>

                <p className={"mt-2"}>Try to click on the link in the E-Mail sent to you instead of copying it.</p>
            </div>
            <div className={"reg-box"} style={{display: pageState == "expired_code"  ? "flex" : "none"}}>
                <h3>Expired Link</h3>

                <p>It looks like the link you used to verify your account has expired.</p>

                <p className={"mt-2"}>We've sent a new link to your email that is valid for 30 minutes.</p>
            </div>
        </div>

    );
}