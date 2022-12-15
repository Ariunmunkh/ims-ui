import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="content">
            <h1 >Page Not Found</h1>
            <h1 >404 Error</h1>
            <Link to="/">
                <button className="primary-button">Home</button>
            </Link>
        </div>
    )
}