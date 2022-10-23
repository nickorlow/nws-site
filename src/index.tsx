import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import StatusPage from "./components/StatusPage";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import UptimeCard from "./components/UptimeCard";
import Footer from "./components/Footer";

function Layout (props: {children: any}) {
    return (
        <div>
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
        path: "blog",
        element:
            <Layout>
                <StatusPage/>
            </Layout>
    },
    {
        path: "blogs",
        element:
            <Layout>
                <StatusPage/>
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
