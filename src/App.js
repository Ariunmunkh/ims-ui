import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MasterPage from './components/pages/MasterPage'
import Login from './components/pages/Login'
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
                    <Route exact path="/*" element={<MasterPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}