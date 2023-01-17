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
import {Nav, Navbar, NavbarBrand, NavDropdown} from "react-bootstrap";
import NWSLogo from "./static/images/NWS_Logo_Transparent.png";
import Blogs from "./components/Blogs";
import NotFoundPage from "./components/NotFoundPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import VerifyPage from "./components/VerifyPage";
import DashboardPage from "./components/DashboardPage";
import CreateCruisePage from "./components/CreateCruisePage";
import HomePage from "./components/HomePage";

function Layout (props: {children: any}) {
    return (
        <div>
            <Navbar sticky={"top"} style={{height: "8vh", backgroundColor: "#eee", paddingLeft: "5vw", paddingRight: "5vw", maxWidth:"100%"}} className={"row m-0"}>
                <div className={"col-10"}>
                    <NavbarBrand>
                        <img src={NWSLogo} alt="nws-logo" style={{width: 120}}/>
                    </NavbarBrand>
                    <NavLink className={"nav-lnk"} to={"/"}>
                        Home
                    </NavLink>
                    <NavLink className={"nav-lnk"} to={"/status"}>
                        Status
                    </NavLink>
                </div>
                {/*<NavLink className={"nav-lnk"} to={"/blogs"}>*/}
                {/*    Blog*/}
                {/*</NavLink>*/}
                <div className={"col-2 d-none d-md-block"}>
                    { localStorage.getItem("session_key") === null &&
                        (
                            <NavLink className={"nav-lnk"} to={"/login"}>
                                Login
                            </NavLink>

                        )
                    }
                    { localStorage.getItem("session_key") === null ||
                        (
                            <NavDropdown title={"Account"} className={"nav-lnk"}>
                                <NavLink className={"nav-lnk"} to={"/dashboard"}>
                                    Dashboard
                                </NavLink>
                                <hr/>
                                <NavLink className={"nav-lnk"} to={"/login"} onClick={()=>{localStorage.removeItem("session_key")}}>
                                    Logout
                                </NavLink>
                            </NavDropdown>
                        )
                    }
                </div>
            </Navbar>
            <div style={{minHeight: "92vh"}}>
             {props.children}
            </div>
            <Footer/>
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element:
            <Layout>
                <HomePage/>
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
        path: "login",
        element:
            <Layout>
                <LoginPage/>
            </Layout>
    },
    {
        path: "verify",
        element:
            <Layout>
                <VerifyPage/>
            </Layout>
    },
    {
        path: "dashboard",
        element:
            <Layout>
                <DashboardPage/>
            </Layout>
    },
    {
        path: "register",
        element:
            <Layout>
                <RegisterPage/>
            </Layout>
    },
    {
        path: "cruise/new",
        element:
            <Layout>
                <CreateCruisePage/>
            </Layout>
    },
    {
        path: "*",
        element:
            <Layout>
                <NotFoundPage/>
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
