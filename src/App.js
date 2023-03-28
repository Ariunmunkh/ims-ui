import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MasterPage from './components/pages/shared/MasterPage'
import Login from './components/pages/shared/Login'
import NotFound from './components/pages/shared/NotFound'
import useToken from './components/system/useToken';
import packageJson from '../package.json';
import './App.css'

export default function App() {

    useEffect(() => {
        let version = localStorage.getItem('version');
        if (version !== packageJson.version) {
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach(name => {
                        caches.delete(name);
                    })
                });
                window.location.reload(true);
            }

            localStorage.clear();
            localStorage.setItem('version', packageJson.version);
        }
    });

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