import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"; // Import addDoc
import { getAuth } from "firebase/auth"; // For getting logged-in user
import Swal from "sweetalert2";
import "./ClientStyles/BookingHistory.css";
import { Navigate } from "react-router-dom";
import Navbar from './ClientNavbar';
import { useAuth } from '../../context/AuthContext'; // Import the Auth context

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, [currentUser, Navigate]);

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
      await addDoc(collection(db, "ratings"), {
        userId: currentUser.uid,
        roomId: roomId,
        rating: userRating,
        timestamp: new Date(),
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

  if (loading) {
    return <p>Loading booking history...</p>;
  }

  if (bookings.length === 0) {
    return <p>You have no bookings in your history.</p>;
  }

  return (
    <div className="booking-history-container">
      <Navbar />
      <div className="booking-history-content">
        <h2>Your Booking History</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-item">
              <div className="booking-info">
                <h3>Booking ID: {booking.id}</h3>
                <p><strong>Room Name:</strong> {booking.roomName}</p>
                <p><strong>Check-In Date:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-Out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>

                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= (rating[booking.id] || 0) ? 'filled' : ''}`}
                      onClick={() => handleRatingClick(booking.id, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <button className="submit-rating" onClick={() => submitRating(booking.id, booking.roomId)}>
                  Submit Rating
                </button>
              </div>
              <img src={booking.roomImage} alt={booking.roomName} className="room-image" /> {/* Add room image */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingHistory;