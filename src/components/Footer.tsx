import React from "react";

export default function Footer() {
    return (
        <footer className={"mt-2 p-3"} style={{backgroundColor: "#eee"}}>
            <p>NWS is owned and operated by <a href={"http://nickorlow.com"}>Nicholas Orlowsky</a>.</p>
            <p>Copyright © Nicholas Orlowsky {new Date().getFullYear()}</p>
        </footer>
    );
}
