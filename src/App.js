import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './components/pages/LandingPage'
import Login from './components/pages/Login'
import RegisterPage from './components/pages/RegisterPage'
import HomePage from './components/pages/HomePage'
import NotFound from './components/pages/NotFound'
import useToken from './components/system/useToken';

import './App.css'

export default function App() {

    const { token, setToken } = useToken();
    if (!token) {
        return <Login setToken={setToken} />
    }
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home/*" element={<HomePage />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    )
}

const Footer = () => {
    return (
        <p className="text-center" style={FooterStyle}>Designed & coded by <a href="http://ontslog.com/" target="_blank" rel="noopener noreferrer">Ontslog</a></p>
    )
}

const FooterStyle = {
    background: "#222",
    fontSize: ".8rem",
    color: "#fff",
    position: "sticky",
    bottom: 0,
    padding: "1rem",
    margin: 0,
    width: "100%",
    opacity: ".5", zIndex: 1,
}