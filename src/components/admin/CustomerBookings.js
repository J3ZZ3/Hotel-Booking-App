import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import Swal from "sweetalert2";
import "./AdminStyles/CustomerBookings.css";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group bookings by month
      const groupedBookings = groupBookingsByMonth(bookingsList);
      setBookings(groupedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch bookings",
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

  const groupBookingsByMonth = (bookingsList) => {
    return bookingsList.reduce((groups, booking) => {
      const date = new Date(booking.checkIn);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(booking);
      return groups;
    }, {});
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteAllBookings = async () => {
    try {
      const result = await Swal.fire({
        title: 'Delete All Bookings?',
        text: "This action cannot be undone. Are you sure you want to delete all bookings?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#34495e',
        confirmButtonText: 'Yes, delete all',
        cancelButtonText: 'Cancel',
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
        setDeleting(true);
        const batch = writeBatch(db);
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        
        bookingsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        setBookings({});

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'All bookings have been deleted successfully.',
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
      console.error("Error deleting bookings:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete bookings. Please try again.',
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
      setDeleting(false);
    }
  };

  return (
    <div className="customer-bookings-page">
      <AdminNavbar />
      <div className="customer-bookings-container">
        <div className="bookings-header">
          <h1>Customer Bookings</h1>
          <button 
            className="delete-all-button"
            onClick={handleDeleteAllBookings}
            disabled={loading || deleting || Object.keys(bookings).length === 0}
          >
            {deleting ? (
              <>
                <ion-icon name="trash-outline"></ion-icon>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <ion-icon name="trash-outline"></ion-icon>
                <span>Delete All Bookings</span>
              </>
            )}
          </button>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          Object.keys(bookings).length === 0 ? (
            <p className="no-bookings">No bookings found</p>
          ) : (
            Object.entries(bookings).map(([monthYear, monthBookings]) => (
              <div key={monthYear} className="month-group">
                <h2 className="month-header">{monthYear}</h2>
                <div className="bookings-grid">
                  {monthBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <h3>Booking #{booking.id.slice(-6)}</h3>
                        <span className={`status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="label">Customer:</span>
                          <span>{booking.customerName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Email:</span>
                          <span>{booking.customerEmail}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Room:</span>
                          <span>{booking.roomName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Check-in:</span>
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Check-out:</span>
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Total Price:</span>
                          <span>${booking.totalPrice}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Booked On:</span>
                          <span>{formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default CustomerBookings;
