import React from "react";
import "./ClientStyles/ClientNavbar.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="app-name">Domicile Hotels</div>
            <div className="nav-links">
            <Link to="/booking-history" className="view-history-button">View Booking History</Link>
            </div>
            </nav>
    )
}

export default Navbar;