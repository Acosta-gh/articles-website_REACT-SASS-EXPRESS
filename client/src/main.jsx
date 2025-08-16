import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { router } from "./router";
import { RouterProvider } from "react-router-dom"
import { SearchProvider } from "./context/SearchContext"
import { AuthProvider } from './context/AuthContext';

import "./styles/main.scss";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </AuthProvider>
  </StrictMode>,
)

