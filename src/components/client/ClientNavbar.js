import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    IoPersonCircleOutline, 
    IoLogOutOutline,
    IoBookOutline,
    IoSettingsOutline,
    IoHelpCircleOutline,
    IoNotificationsOutline
} from "react-icons/io5";
import "./ClientStyles/ClientNavbar.css";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add your logout logic here
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="app-name">Domicile Hotels</div>
            <div className="nav-links">
                <div className="profile-menu">
                    <div 
                        className="profile-icon" 
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <IoPersonCircleOutline />
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                <IoPersonCircleOutline />
                                <span>Profile</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/booking-history')}>
                                <IoBookOutline />
                                <span>Booking History</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/notifications')}>
                                <IoNotificationsOutline />
                                <span>Notifications</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/settings')}>
                                <IoSettingsOutline />
                                <span>Settings</span>
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/help')}>
                                <IoHelpCircleOutline />
                                <span>Help & Support</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                <IoLogOutOutline />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;