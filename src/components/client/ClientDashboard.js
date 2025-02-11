import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RoomCard from '../admin/RoomCard';
import "./ClientStyles/ClientDashboard.css";
import Navbar from "./ClientNavbar";
import SearchBar from "./SearchBar";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      // Redirect if not logged in
    }
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, [currentUser]);

  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`, { state: { room } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="client-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h1>Discover Your Perfect Stay</h1>
        <div className="welcome-message">
          <strong>Domicile Hotels</strong>, where luxury meets comfort. 
          Experience our carefully curated selection of rooms, each designed to 
          provide you with an <strong>unforgettable stay</strong>.
        </div>
        
        <div className="search-container">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search rooms by name or type..."
          />
        </div>

        <div className="rooms-grid">
          {rooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onClick={() => handleRoomClick(room)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;