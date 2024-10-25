import React from "react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="app-name">Domicile Hotels</div>
            <div className="nav-links">
                < a href="#">Home</a>
                < a href="#">About</a>
                < a href="#">Contact</a>
            </div>
            </nav>
    )
}

export default Navbar;