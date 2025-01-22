import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RoomList from "../admin/RoomList";
import { Link, useNavigate } from "react-router-dom";
import "./ClientStyles/ClientDashboard.css";
import Navbar from "./ClientNavbar";
import { useAuth } from '../../context/AuthContext'; // Import the Auth context

const ClientDashboard = () => {
  const navigate = useNavigate(); // Get navigate function
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    if (!currentUser) {
      navigate("/client-login"); // Redirect if not logged in
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
  }, [currentUser, navigate]);

  return (
    <div className="client-dashboard-cd">
      <Navbar />
      <div className="overlay-cd">
        <h1 className="dashboard-title">Client Dashboard</h1>
        <RoomList className="room-list-cd" rooms={rooms} />
      </div>
    </div>
  );
};

export default ClientDashboard;