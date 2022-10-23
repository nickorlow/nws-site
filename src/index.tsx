import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    createBrowserRouter, NavLink,
    RouterProvider,
} from "react-router-dom";
import StatusPage from "./components/StatusPage";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import UptimeCard from "./components/UptimeCard";
import Footer from "./components/Footer";
import {Nav, Navbar, NavbarBrand} from "react-bootstrap";
import NWSLogo from "./static/images/NWS_Logo.png";
import Blogs from "./components/Blogs";

function Layout (props: {children: any}) {
    return (
        <div>
            <Navbar sticky={"top"} style={{backgroundColor: "#eee", paddingLeft: 100, paddingRight: 100}}>
                <NavbarBrand>
                    <img src={NWSLogo} alt="nws-logo" style={{width: 120}}/>
                </NavbarBrand>
                <NavLink className={"nav-lnk"} to={"/"}>
                    Home
                </NavLink>
                <NavLink className={"nav-lnk"} to={"/status"}>
                    Status
                </NavLink>
                <NavLink className={"nav-lnk"} to={"/blogs"}>
                    Blog
                </NavLink>
            </Navbar>
            {props.children}
            <Footer/>
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element:
            <Layout>
                <StatusPage/>
            </Layout>
    },
    {
        path: "status",
        element:
            <Layout>
                <StatusPage/>
            </Layout>
    },
    {
        path: "blog",
        element:
            <Layout>
                <Blogs/>
            </Layout>
    },
    {
        path: "blogs",
        element:
            <Layout>
                <Blogs/>
            </Layout>
    },
    {
        path: "*",
        element:
            <Layout>
                <StatusPage/>
            </Layout>
    },
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
