import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { router } from "./router";
import {RouterProvider} from "react-router-dom"

import "./styles/main.scss";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

// https://reactrouter.com/en/main/start/tutorial