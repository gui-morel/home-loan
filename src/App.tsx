import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {HomeLoan} from './components/home-loan/HomeLoan';
import {Investment} from './components/financial-investment/Investment';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import React from "react";
import {Layout} from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "home-loan",
                element: <HomeLoan></HomeLoan>
            },
            {
                path: "investment",
                element: <Investment></Investment>
            }
        ],
    },
], {basename: "/home-loan"});

function App() {
    return <RouterProvider router={router}/>
}

export default App
