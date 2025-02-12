import React, { useEffect, useRef, useState } from 'react';
import Navbar from './common/ClientNavbar';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
         FaParking, FaWifi, FaSwimmingPool, FaConciergeBell } from 'react-icons/fa';
import hotelExterior from '../assets/hotel-front.jpg';
import lobby from '../assets/lobby.jpg';
import pool from '../assets/pool.jpg';
import './ClientStyles/HotelDetails.css';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'your_mapbox_access_token';

const HotelDetails = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [activeImage, setActiveImage] = useState(0);

    const hotelLocation = {
        lng: 28.0473,  // Pretoria, South Africa coordinates
        lat: -25.7479,
        zoom: 15
    };

    const images = [
        { url: hotelExterior, title: "Hotel Exterior" },
        { url: lobby, title: "Grand Lobby" },
        { url: pool, title: "Infinity Pool" }
    ];

    const highlights = [
        { icon: <FaParking />, text: "Free Secure Parking" },
        { icon: <FaWifi />, text: "High-Speed WiFi" },
        { icon: <FaSwimmingPool />, text: "Rooftop Pool" },
        { icon: <FaConciergeBell />, text: "24/7 Concierge" }
    ];

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [hotelLocation.lng, hotelLocation.lat],
            zoom: hotelLocation.zoom,
            scrollZoom: false
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl());

        // Add marker
        new mapboxgl.Marker()
            .setLngLat([hotelLocation.lng, hotelLocation.lat])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Domicile Hotels</h3><p>Luxury Stays</p>"))
            .addTo(map.current);

        // Clean up
        return () => map.current.remove();
    }, []);

    // Auto-rotate images
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImage((current) => (current + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hotel-details-page">
            <Navbar />
            
            <div className="hero-section">
                <div className="image-slider">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={image.title}
                            className={index === activeImage ? 'active' : ''}
                        />
                    ))}
                    <div className="image-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === activeImage ? 'active' : ''}`}
                                onClick={() => setActiveImage(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="hotel-content">
                <div className="hotel-info-section">
                    <h1>Welcome to Domicile Hotels</h1>
                    <p className="hotel-description">
                        Experience unparalleled luxury in the heart of Pretoria. Our five-star hotel 
                        combines elegant design, world-class amenities, and exceptional service to 
                        create unforgettable stays for our guests.
                    </p>

                    <div className="highlights-grid">
                        {highlights.map((highlight, index) => (
                            <div key={index} className="highlight-item">
                                {highlight.icon}
                                <span>{highlight.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="contact-info">
                        <div className="info-item">
                            <FaMapMarkerAlt />
                            <span>123 Luxury Avenue, Pretoria, South Africa</span>
                        </div>
                        <div className="info-item">
                            <FaPhone />
                            <span>+27 12 345 6789</span>
                        </div>
                        <div className="info-item">
                            <FaEnvelope />
                            <span>info@domicilehotels.com</span>
                        </div>
                        <div className="info-item">
                            <FaClock />
                            <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                        </div>
                    </div>
                </div>

                <div className="map-section">
                    <h2>Our Location</h2>
                    <div ref={mapContainer} className="map-container" />
                </div>
            </div>
        </div>
    );
};

export default HotelDetails; 