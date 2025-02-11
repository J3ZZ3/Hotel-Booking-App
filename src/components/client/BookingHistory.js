import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore"; // Import addDoc, doc, and updateDoc
import Swal from "sweetalert2";
import "./ClientStyles/BookingHistory.css";
import { Navigate } from "react-router-dom";
import Navbar from './ClientNavbar';
import { useAuth } from '../../context/AuthContext'; // Import the Auth context
import BookingCard from './BookingCard';
import './ClientStyles/BookingCard.css';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [rating, setRating] = useState({});
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You need to be logged in to view your booking history.",
        confirmButtonText: "OK",
      });
      Navigate("/client-login"); // Redirect if not logged in
      return;
    }

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const userBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort bookings by date (most recent first)
        userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setBookings(userBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an issue fetching your booking history.",
        });
      }
    };

    fetchBookings();
  }, [currentUser]);

  const handleRatingClick = (bookingId, rate) => {
    setRating((prevRating) => ({
      ...prevRating,
      [bookingId]: rate,
    }));
  };

  const submitRating = async (bookingId, roomId) => {
    const userRating = rating[bookingId];

    if (!userRating || userRating < 1 || userRating > 5) {
      Swal.fire({
        icon: "error",
        title: "Invalid Rating",
        text: "Please select a rating between 1 and 5.",
      });
      return;
    }

    try {
      // Save the rating
      await addDoc(collection(db, "ratings"), {
        userId: currentUser.uid,
        roomId: roomId,
        bookingId: bookingId,
        rating: userRating,
        timestamp: new Date(),
      });

      // Update the room's average rating
      const ratingsQuery = query(collection(db, "ratings"), where("roomId", "==", roomId));
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      let totalRating = 0;
      let numberOfRatings = 0;
      
      ratingsSnapshot.forEach((doc) => {
        totalRating += doc.data().rating;
        numberOfRatings++;
      });

      const averageRating = totalRating / numberOfRatings;

      // Update room document with new average rating
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, {
        averageRating: averageRating,
        numberOfRatings: numberOfRatings
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your rating has been submitted.",
      });
    } catch (error) {
      console.error("Error submitting rating: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit rating. Please try again.",
      });
    }
  };

  const filterBookings = () => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === activeTab);
  };

  const getTabCount = (status) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status.toLowerCase() === status).length;
  };

  // Group bookings by month and year
  const groupBookingsByDate = (bookings) => {
    const groups = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(booking);
    });

    return groups;
  };

  const refreshBookings = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      const userBookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(userBookings);
    } catch (error) {
      console.error("Error refreshing bookings: ", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="booking-history-container">
        <Navbar />
        <div className="booking-history-content">
          <div className="loading-spinner">Loading booking history...</div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="booking-history-container">
        <Navbar />
        <div className="booking-history-content">
          <div className="no-bookings-message">
            You have no bookings in your history.
          </div>
        </div>
      </div>
    );
  }

  const groupedBookings = groupBookingsByDate(filterBookings());

  return (
    <div className="booking-history-container">
      <Navbar />
      <div className="booking-history-content">
        <h2>Your Booking History</h2>
        
        <div className="booking-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({getTabCount('all')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending approval' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending approval')}
          >
            Pending ({getTabCount('pending approval')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({getTabCount('approved')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({getTabCount('completed')})
          </button>
          <button 
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({getTabCount('cancelled')})
          </button>
        </div>

        <div className="booking-list">
          {Object.entries(groupedBookings).map(([monthYear, monthBookings]) => (
            <div key={monthYear} className="booking-month-group">
              <h3 className="month-year-header">{monthYear}</h3>
              <div className="booking-cards-grid">
                {monthBookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onBookingUpdate={refreshBookings}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;