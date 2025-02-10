import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import Swal from 'sweetalert2';
import './ClientStyles/BookingForm.css';

const BookingForm = ({ room }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room: roomData } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    contactNumber: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if bookings are available
      const roomRef = doc(db, "rooms", roomData.id);
      const roomDoc = await getDoc(roomRef);
      const roomData = roomDoc.data();
      
      if (roomData.currentBookings >= roomData.maxBookings) {
        Swal.fire({
          icon: "error",
          title: "Room Unavailable",
          text: "Sorry, this room is fully booked.",
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
        return;
      }

      // Create booking
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'You need to be logged in to book a room.',
        });
        return;
      }

      const bookingData = {
        userId: user.uid,
        roomId: roomData.id,
        roomName: roomData.name,
        ...formData,
        status: 'Pending Approval',
        paymentStatus: 'Paid',
        createdAt: new Date(),
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);

      // Update room booking count
      await updateDoc(roomRef, {
        currentBookings: roomData.currentBookings + 1,
        status: roomData.currentBookings + 1 >= roomData.maxBookings ? 
          "Unavailable" : "Available"
      });

      Swal.fire({
        icon: 'success',
        title: 'Booking Submitted',
        text: 'Your booking has been submitted successfully and is awaiting approval.',
      });

      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error submitting booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit booking. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    setIsPaid(true);
  };

  if (!roomData) {
    return <p>No room data available.</p>;
  }

  return (
    <>
      <h3>Booking Form for {roomData.name}</h3>
      <p><strong>Description:</strong> {roomData.description}</p>
      <p><strong>Price:</strong> ${roomData.price}</p>
      <p><strong>Status:</strong> {roomData.isBooked ? 'Booked' : 'Available'}</p>

      <form onSubmit={handleBooking}>
        <div className="input-container">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            required
          />
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-container">
          <div className="paypal-button-container">
            <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: roomData.price.toString(), 
                      },
                    }],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  handlePaymentSuccess(details);
                }}
                onError={(err) => {
                  console.error('Payment error:', err);
                  Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: 'There was an issue with the payment. Please try again.',
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit and Proceed"}
          </button>
        </div>
      </form>
    </>
  );
};

export default BookingForm;