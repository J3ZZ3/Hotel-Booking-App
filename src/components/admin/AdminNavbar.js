import React from "react";
import "./AdminStyles/AdminNavbar.css";
import { Link } from "react-router-dom";

function AdminNavbar() {
    return (
        <nav className="admin-navbar">
            <div className="admin-app">Domicile Hotels</div>
            <div className="admin-links">
 <Link to="/admin-dashboard" className="admin-dash">Dashboard</Link>
<Link to="/customer-bookings" className="client-books"> Client Bookings</Link>
            </div>
            </nav>
    )
}

export default AdminNavbar;