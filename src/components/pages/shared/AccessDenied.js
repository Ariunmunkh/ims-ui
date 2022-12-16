import React from 'react'
import { Link } from 'react-router-dom'

export default function AccessDenied() {
    return (
        <div className="content">
            <h1 >Access denied</h1>
            <h1 >403 Error</h1>
            <Link to="/">
                <button className="primary-button">Home</button>
            </Link>
        </div>
    )
}