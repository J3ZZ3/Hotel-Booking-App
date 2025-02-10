import React, { useState, useEffect } from "react";
import AddRoom from "./AddRoom";
import RoomList from "./AdminRoomList";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import { auth } from "../../firebase/firebaseConfig";
import "./AdminStyles/AdminDashboard.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import RoomCard from './RoomCard';
import RoomDetail from './RoomDetail';

const AdminDashboard = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "rooms");
        const roomSnapshot = await getDocs(roomsCollection);
        const roomList = roomSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRooms(roomList);
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Rooms fetched successfully!',
          confirmButtonColor: '#c0392b',
          background: '#1a1a1a',
          color: '#ffffff',
          customClass: {
            popup: 'dark-theme-popup',
            confirmButton: 'dark-theme-button',
            title: 'dark-theme-title',
            htmlContainer: 'dark-theme-content'
          }
        });
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch rooms. Please try again.',
          confirmButtonColor: '#c0392b',
          background: '#1a1a1a',
          color: '#ffffff',
          customClass: {
            popup: 'dark-theme-popup',
            confirmButton: 'dark-theme-button',
            title: 'dark-theme-title',
            htmlContainer: 'dark-theme-content'
          }
        });
      } finally {
        setLoading(false);
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

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseDetail = () => {
    setSelectedRoom(null);
  };

  const handleDeleteRoom = async (roomId, imageUrl) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#34495e',
        confirmButtonText: 'Yes, delete it!',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'dark-theme-popup',
          confirmButton: 'dark-theme-button',
          cancelButton: 'dark-theme-button',
          title: 'dark-theme-title',
          htmlContainer: 'dark-theme-content'
        }
      });

      if (result.isConfirmed) {
        // Delete the room document
        await deleteDoc(doc(db, "rooms", roomId));

        // Delete the image from storage if it exists
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef).catch(error => {
            console.log("Image might have already been deleted:", error);
          });
        }

        // Update local state
        setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Room has been deleted.',
          confirmButtonColor: '#c0392b',
          background: '#1a1a1a',
          color: '#ffffff',
          customClass: {
            popup: 'dark-theme-popup',
            confirmButton: 'dark-theme-button',
            title: 'dark-theme-title',
            htmlContainer: 'dark-theme-content'
          }
        });
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete room. Please try again.',
        confirmButtonColor: '#c0392b',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'dark-theme-popup',
          confirmButton: 'dark-theme-button',
          title: 'dark-theme-title',
          htmlContainer: 'dark-theme-content'
        }
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-dashboard-content">
        <h1>Room Management</h1>
        <div className="admin-room-grid">
          {rooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onClick={handleRoomClick}
            />
          ))}
        </div>
      </div>
      {selectedRoom && (
        <RoomDetail 
          room={selectedRoom} 
          onClose={handleCloseDetail}
        />
      )}
      <button className="fab-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </div>
  );
};

export default AdminDashboard;
