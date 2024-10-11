import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Articles from "../pages/Articles";

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
                path: "about",
                element: <About />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "articles",
                element: <Articles />,
            },
        ],
    },
]);
