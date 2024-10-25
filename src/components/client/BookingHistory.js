

import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // For getting logged-in user
import Swal from "sweetalert2";
import "./ClientStyles/BookingHistory.css";
import { Navigate } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({});
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You need to be logged in to view your booking history.",
            confirmButtonText: "OK",
            
          });
          Navigate("/client-login");
          return;
        }

        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
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
  }, []);

  const handleRatingChange = (e, bookingId) => {
    setRating((prevRating) => ({
      ...prevRating,
      [bookingId]: e.target.value,
    }));
  };



  const submitRating = async (bookingId, roomId) => {
    const userRating = rating[bookingId];

    if (!userRating || userRating < 1 || userRating > 10) {
      Swal.fire({
        icon: "error",
        title: "Invalid Rating",
        text: "Please select a rating between 1 and 5.",
      });
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, "ratings"), {
        userId: user.uid,
        roomId: roomId,
        rating: parseInt(userRating, 10),
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
    return <p>loading booking history...</p>;
  }

  if (bookings.length === 0) {
    return <p>You have no bookings in your history.</p>;
  }

  return (
    <div>
      <h1>Your Booking History</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            <h3>Booking ID: {booking.id}</h3>
            <p><strong>Room Name:</strong> {booking.roomName}</p>
            <p><strong>Check-In Date:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-Out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>

            <div className="rating">
              <label htmlFor={`rating-${booking.id}`}>Rate this room from 1-10:</label>
              <input
              className="rating-input"
                type="number"
                id={`rating-${booking.id}`}
                min="1"
                max="10"
                value={rating[booking.id] || ""}
                onChange={(e) => handleRatingChange(e, booking.id)}
              />
              <button className="submit-rating" onClick={() => submitRating(booking.id, booking.roomId)}>
                Submit Rating
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingHistory;