import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RoomCard from '../admin/RoomCard';
import "./ClientStyles/ClientDashboard.css";
import Navbar from "./ClientNavbar";
import { useAuth } from '../../context/AuthContext'; // Import the Auth context
import { IoFilterSharp, IoClose } from 'react-icons/io5';
import Filters from './Filters';

const ClientDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useAuth(); // Get current user from context
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priceRange: { min: 0, max: 5000 },
    view: 'all',
    roomType: 'all',
    bedType: 'all',
    amenities: [],
    capacity: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

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
    // Handle room selection/booking
    console.log('Selected room:', room);
  };

  return (
    <div className="client-dashboard">
      <Navbar />
      <h1>Discover Your Perfect Stay</h1>
      <div className="welcome-message">
        <strong>Domicile Hotels</strong>, where luxury meets comfort. 
        Experience our carefully curated selection of rooms, each designed to 
        provide you with an <strong>unforgettable stay</strong>.
      </div>
      
      <Filters 
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <div className="rooms-grid">
        {rooms.map(room => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onClick={handleRoomClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;