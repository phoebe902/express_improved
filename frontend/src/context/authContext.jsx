import React, { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loadProfile = async () => {
        try {
            const res = await API.get("/auth/profile");
            setUser(res.data.user);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) loadProfile();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loadProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};