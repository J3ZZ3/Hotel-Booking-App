
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RoomList from "../admin/RoomList";
import { Link } from "react-router-dom";
import "./ClientStyles/ClientDashboard.css";
import Navbar from "./ClientNavbar";

const ClientDashboard = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    
     
    


    <div className="client-dashboard-cd">
    <Navbar />
      <div className="overlay-cd">
      <h1>Client Dashboard</h1>

      <RoomList className="room-list-cd" rooms={rooms} />
    </div>
    </div>
  );
};

export default ClientDashboard;