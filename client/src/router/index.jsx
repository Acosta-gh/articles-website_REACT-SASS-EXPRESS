import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
import Article from "../pages/Article"
import Sign from "../pages/Sign"
import Logout from "../pages/Logout"
import AdminPanel from "../pages/AdminPanel"
import MyAccount from "../pages/MyAccount"

import ErrorPage from "../error-page";
import Layout from "../components/Layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "aboutus",
                element: <About />,
            },
            {
                path: "contactus",
                element: <Contact />,
            },
            {
                path: "article/:id",
                element: <Article />,
            },
            {
                path: "privacypolicy",
                element: <Privacy />,
            },
            {
                path: "privacypolicy",
                element: <Privacy />,
            },
            {
                path: "sign",
                element: <Sign />,
            },
            {
                path: "logout",
                element: <Logout />,
            }, 
            {
                path: "adminpanel",
                element: <AdminPanel />,
            },
            {
                path: "myaccount",
                element: <MyAccount />,
            },

        ],
    },
]);
