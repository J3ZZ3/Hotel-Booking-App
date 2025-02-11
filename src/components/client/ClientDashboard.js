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
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
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
        setFilteredRooms(roomsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentUser]);

  const handleRoomClick = (room) => {
    navigate(`/room/${room.id}`, { state: { room } });
  };

  const handleSearchResults = (results) => {
    setFilteredRooms(results);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="client-dashboard">
      <Navbar />
      <br></br>
      <br></br>
      <div className="dashboard-content">
        <h1>Discover Your Perfect Stay</h1>
        <div className="welcome-message">
          <strong>Domicile Hotels</strong>, where luxury meets comfort. 
          Experience our carefully curated selection of rooms, each designed to 
          provide you with an <strong>unforgettable stay</strong>.
        </div>
        
        <div className="search-container">
          <SearchBar rooms={rooms} onSearchResults={handleSearchResults} />
        </div>

        <div className="rooms-grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onClick={() => handleRoomClick(room)}
              />
            ))
          ) : (
            <div className="no-results">No rooms found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;