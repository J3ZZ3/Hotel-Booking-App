import React, { useState, useEffect } from 'react';
import './ClientStyles/ClientRoomDetail.css';
import { IoWifi, IoTv, IoRestaurant, IoWater, IoArrowBack } from 'react-icons/io5';
import { FaSwimmingPool, FaParking, FaWind } from 'react-icons/fa';
import { MdBalcony, MdKitchen } from 'react-icons/md';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from './ClientNavbar';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const amenityIcons = {
    'Wi-Fi': <IoWifi />,
    'TV': <IoTv />,
    'Room Service': <IoRestaurant />,
    'Ocean View': <IoWater />,
    'Pool Access': <FaSwimmingPool />,
    'Parking': <FaParking />,
    'Air Conditioning': <FaWind />,
    'Balcony': <MdBalcony />,
    'Kitchen': <MdKitchen />
};

const defaultImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80';

const ClientRoomDetail = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const [room, setRoom] = useState(location.state?.room || null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageUrl, setImageUrl] = useState(defaultImage);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!room) {
                try {
                    const roomDoc = await getDoc(doc(db, 'rooms', roomId));
                    if (roomDoc.exists()) {
                        const roomData = { id: roomDoc.id, ...roomDoc.data() };
                        setRoom(roomData);
                        if (roomData.imageUrl) {
                            setImageUrl(roomData.imageUrl);
                        }
                    } else {
                        console.log('No such room!');
                        navigate('/client-dashboard');
                    }
                } catch (error) {
                    console.error('Error fetching room:', error);
                    navigate('/client-dashboard');
                }
            } else if (room.imageUrl) {
                setImageUrl(room.imageUrl);
            }
        };

        fetchRoom();
    }, [roomId, room, navigate]);

    if (!room) {
        return (
            <div className="room-detail-page">
                <div className="animated-background">
                    <div className="gradient-overlay"></div>
                </div>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    const handleBookNow = () => {
        if (room.status.toLowerCase() === 'available') {
            navigate(`/booking/${roomId}`, { 
                state: { 
                    room: room,
                    imageUrl: imageUrl
                } 
            });
        }
    };

    return (
        <div className="room-detail-page">
            <div className="animated-background">
                <div className="gradient-overlay"></div>
            </div>
            <Navbar />
            <div className="room-image-hero">
                <img 
                    src={imageUrl} 
                    alt={room.name}
                    className="room-main-image"
                />
                <div className="hero-overlay">
                    <div className="hero-content">
                        <button className="back-button" onClick={() => navigate('/client-dashboard')}>
                            <IoArrowBack /> Back to Rooms
                        </button>
                        <h1>{room.name}</h1>
                    </div>
                </div>
            </div>

            <div className="content-container">
                <div className="main-content">
                    <div className="booking-card">
                        <div className="price-section">
                            <span className="price">${room.price}</span>
                            <span className="per-night">per night</span>
                        </div>
                        <div className="status-section">
                            <span className={`status-badge ${room.status.toLowerCase()}`}>
                                {room.status}
                            </span>
                        </div>
                        <button 
                            className={`book-now-btn ${room.status.toLowerCase() !== 'available' ? 'disabled' : ''}`}
                            onClick={handleBookNow}
                            disabled={room.status.toLowerCase() !== 'available'}
                        >
                            {room.status.toLowerCase() === 'available' ? 'Book Now' : 'Not Available'}
                        </button>
                    </div>

                    <section className="room-overview">
                        <h2>Room Overview</h2>
                        <div className="room-specs">
                            <div className="spec-item">
                                <span className="spec-label">View</span>
                                <span className="spec-value">{room.view}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Bed Type</span>
                                <span className="spec-value">{room.bedType}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Room Type</span>
                                <span className="spec-value">{room.type} </span>
                                </div>

                            <div className="spec-item">
                                <span className="spec-label">Capacity</span>
                                <span className="spec-value">{room.capacity} Persons</span>
                            </div>
                        </div>
                    </section>

                    <section className="room-description">
                        <h2>Description</h2>
                        <p>{room.description}</p>
                    </section>

                    <section className="room-amenities">
                        <h2>Amenities</h2>
                        <div className="amenities-grid">
                            {room.amenities?.map((amenity, index) => (
                                <div key={index} className="amenity-item">
                                    {amenityIcons[amenity]}
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ClientRoomDetail;