import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddRoom from "./AddRoom";
import RoomList from "./AdminRoomList";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./AdminStyles/AdminDashboard.css";

const AdminDashboard = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    };

    const fetchBookings = async () => {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    };

    fetchRooms();
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: newStatus });
    alert(`Booking has been ${newStatus}`);
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  return (
    <div className="admin-dashboard-ad">
      <div className="overlay-ad">
      <h1>Admin Dashboard</h1>
      <div className="buttons-ad">
      <button  onClick={() => setIsAdding(true)}>Add Room</button>
      <Link to="/add-admin">
        <button >Add Admin</button>
      </Link>
      <Link to="/customer-bookings">
        <button >Bookings</button>
      </Link>
      </div>

      {isAdding && <AddRoom setIsAdding={setIsAdding} />}
<div className="rooms-ad">
      <h2>Rooms</h2>
      <RoomList rooms={rooms} />

    </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
