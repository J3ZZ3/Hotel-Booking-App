import React, { useState, useEffect } from "react";
import AddRoom from "./AddRoom";
import RoomList from "./AdminRoomList";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import { auth } from "../../firebase/firebaseConfig";
import "./AdminStyles/AdminDashboard.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        Swal.fire({
          icon: "success",
          title: "Rooms Fetched",
          text: "Rooms have been fetched successfully.",
        });
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch rooms.",
        });
      }
    };

    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const bookingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch bookings.",
        });
      }
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out: ", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <div className="admin-dashboard-ad">
      <AdminNavbar />
      <div className="overlay-ad">
        <h1>Admin Dashboard</h1>
        {isAdding && <AddRoom setIsAdding={setIsAdding} />}
        <div className="rooms-ad">
          <h2>Rooms</h2>
          <RoomList rooms={rooms} />
        </div>
      </div>
      <button className="fab-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </div>
  );
};

export default AdminDashboard;
