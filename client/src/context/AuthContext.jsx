import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded JWT:", decoded);
            return token ? decoded : null;

        } catch {
            return null;
        }
    });

    // Chequea si el token está vencido
    const isTokenExpired = () => {
        if (!token) return true;
        try {
            const { exp } = jwtDecode(token);
            if (!exp) return true;
            const now = Math.floor(Date.now() / 1000);
            return exp < now;
        } catch {
            return true;
        }
    };

    // Si el token cambia, actualiza el usuario
    useEffect(() => {
        if (token) {
            try {
                setUser(jwtDecode(token));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    // Login y logout
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    // Auto-logout si el token vence, chequeado cada minuto
    useEffect(() => {
        if (token && isTokenExpired()) {
            logout();
        }
        const interval = setInterval(() => {
            if (token && isTokenExpired()) {
                logout();
            }
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [token]);

    const value = {
        token,
        user,
        isAuthenticated: !!token && !isTokenExpired(),
        isTokenExpired,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}