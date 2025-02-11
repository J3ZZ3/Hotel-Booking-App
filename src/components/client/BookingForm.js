import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { IoCalendar, IoPersonCircle, IoHome, IoCall, IoArrowBack } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './ClientStyles/BookingForm.css';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room: roomData, imageUrl } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    contactNumber: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Enhanced validation function
  const validateForm = () => {
    const isValid = 
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.contactNumber.trim() !== '' &&
      formData.checkInDate !== '' &&
      formData.checkOutDate !== '';
    
    setIsFormValid(isValid);
    return isValid;
  };

  // Update handleChange to validate form immediately
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Validate form immediately after state update
    setTimeout(validateForm, 0);
  };

  // Add blur handler for additional validation
  const handleBlur = () => {
    validateForm();
  };

  const handleBooking = async () => {
    setLoading(true);

    try {
      // Check if bookings are available
      const roomRef = doc(db, "rooms", roomData.id);
      const roomDoc = await getDoc(roomRef);
      const currentRoomData = roomDoc.data();
      
      if (currentRoomData.currentBookings >= currentRoomData.maxBookings) {
        Swal.fire({
          icon: "error",
          title: "Room Unavailable",
          text: "Sorry, this room is fully booked.",
        });
        return;
      }

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

      await updateDoc(roomRef, {
        currentBookings: currentRoomData.currentBookings + 1,
        status: currentRoomData.currentBookings + 1 >= currentRoomData.maxBookings ? 
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
      throw error; // Rethrow to be caught by handlePaymentSuccess
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    setIsPaid(true);
    try {
      await handleBooking();
    } catch (error) {
      console.error('Error processing booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: 'There was an issue processing your booking. Please try again.',
      });
    }
  };

  if (!roomData) {
    return <div className="booking-error">No room data available.</div>;
  }

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const totalPrice = calculateNights() * roomData.price;

  // Add PayPal configuration options
  const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture"
  };

  return (
    <div className="booking-layout">
      <div className="booking-page">
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoArrowBack /> Back to Room Details
          </button>
        {/* Booking Summary On The Left Side */}
        <div className="booking-container">
          <div className="booking-grid">
            <div className="room-summary">
              <div className="room-image">
                <img src={imageUrl} alt={roomData.name} />
              </div>
              <div className="summary-content">
                <h2>Booking Summary</h2>
                <div className="summary-details">
                  <h3>{roomData.name}</h3>
                  <p className="room-type">{roomData.type} Room</p>
                  <div className="summary-item">
                    <span>Price per night</span>
                    <span>${roomData.price}</span>
                  </div>
                  <div className="summary-item">
                    <span>Number of nights</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Price</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="room-features">
                    <h4>Room Features</h4>
                    <ul>
                      {roomData.amenities?.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form In The Middle */}
            <div className="booking-form-container">
              <h2>Guest Information</h2>
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-with-icon">
                    <IoPersonCircle />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <IoHome />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <div className="input-with-icon">
                    <IoHome />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <div className="input-with-icon">
                    <IoCall />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your contact number"
                      required
                    />
                  </div>
                </div>

                <div className="dates-group">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <div className="input-with-icon">
                      <IoCalendar />
                      <input
                        type="date"
                        name="checkInDate"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Check-out Date</label>
                    <div className="input-with-icon">
                      <IoCalendar />
                      <input
                        type="date"
                        name="checkOutDate"
                        value={formData.checkOutDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or preferences?"
                    rows="4"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details On The Right Side */}
      <div className="payment-sidebar">
        <div className="payment-summary">
          <h3>Booking Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span>Room Rate</span>
              <span>${roomData.price} / night</span>
            </div>
            <div className="summary-item">
              <span>Number of Nights</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="summary-item total">
              <span>Total Amount</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          
          <div className="payment-section">
            <div className="paypal-button-container">
              {!isFormValid ? (
                <div className="form-warning">
                  Please fill in all required fields before proceeding with payment.
                </div>
              ) : (
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "pay"
                    }}
                    createOrder={(data, actions) => {
                      // Double-check validation before creating order
                      if (!validateForm()) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Form Incomplete',
                          text: 'Please fill in all required fields before proceeding with payment.',
                        });
                        return;
                      }
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            currency_code: "USD",
                            value: totalPrice.toString()
                          }
                        }]
                      });
                    }}
                    onApprove={handlePaymentSuccess}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;