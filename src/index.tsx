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
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarOffcanvas from "react-bootstrap/NavbarOffcanvas";

function Layout (props: {children: any}) {
    return (
        <div>
            <header  className={"w-100 sticky-top"}>
            <div className={"w-100"}>
                <Navbar sticky={"top"} expand="md" className={"row justify-content-center m-0 p-0"} style={{backgroundColor: "#eee"}}>
                    <div className={"row w-100"}>
                        <div className="row w-100 d-md-none d-sm-block">
                            <div className={"col-9"}>
                                <Navbar.Brand href="/">
                                    <img src={NWSLogo} width={150}/>
                                </Navbar.Brand>
                            </div>
                            <div className={"col-2 ml-3 d-flex align-content-center justify-content-center"}>
                                <Navbar.Toggle className={"h-50 align-self-center"} aria-controls="basic-navbar-nav"/>
                            </div>
                        </div>
                        <div className={"d-md-block d-none col-2"}>
                            <Navbar.Brand href="/">
                                <img src={NWSLogo} width={150}/>
                            </Navbar.Brand>
                        </div>
                        <Navbar.Collapse id="basic-navbar-nav" className={"col-10"}>
                            <Nav className="row w-100 ml-5">
                                <div className="col-md-4 row">
                                    <NavLink className="col-sm-12 col-md-3 nav-lnk align-self-center" to={"/"}>Home</NavLink>
                                    <NavLink className="col-sm-12 col-md-3 nav-lnk align-self-center" to={"/status"}>Status</NavLink>
                                </div>
                                <div className="col-md-6"/>
                                <div className={"col-md-2 d-md-block d-none"}>
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
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>


            </div>
        </header>
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
