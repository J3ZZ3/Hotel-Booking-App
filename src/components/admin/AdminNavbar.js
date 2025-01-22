import React from "react";
import "./AdminStyles/AdminNavbar.css";
import { Link } from "react-router-dom";

function AdminNavbar() {
    return (
        <nav className="admin-navbar">
            <div className="admin-app">Domicile Hotels</div>
            <div className="admin-links">
                <Link to="/admin-dashboard" className="admin-link">Dashboard</Link>
                <Link to="/add-room" className="admin-link">Add Room</Link>
                <Link to="/add-admin" className="admin-link">Add Admin</Link>
                <Link to="/customer-bookings" className="admin-link">Bookings</Link>
            </div>
        </nav>
    );
}

export default AdminNavbar;