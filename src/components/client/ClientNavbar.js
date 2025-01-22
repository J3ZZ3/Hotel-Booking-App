import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import "./ClientStyles/ClientNavbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/client-login");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="app-name">Domicile Hotels</div>
            <div className="nav-links">
                <Link to="/client-dashboard" className="nav-link">Dashboard</Link>
                <Link to="/booking-history" className="nav-link">Booking History</Link>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;