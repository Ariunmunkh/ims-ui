import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="text-center">
            <h1 className="main-title home-page-title">Page Not Found</h1>
            <h1 className="main-title home-page-title">404 Error</h1>
            <Link to="/home">
                <button className="primary-button">Home</button>
            </Link>
        </div>
    )
}