
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 
import Swal from 'sweetalert2';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    contactNumber: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [isPaid, setIsPaid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPaid) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Required',
        text: 'Please complete payment before submitting the booking.',
      });
      return;
    }

    try {
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
        roomId: room.id,
        roomName: room.name,
        ...formData,
        status: 'Pending Approval',
        paymentStatus: 'Paid',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      Swal.fire({
        icon: 'success',
        title: 'Booking Submitted',
        text: 'Your booking has been submitted successfully and is awaiting approval.',
      });

      navigate('/client-dashboard');
    } catch (err) {
      console.error('Error submitting booking:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem submitting your booking. Please try again.',
      });
    }
  };

  if (!room) {
    return <p>No room data available.</p>;
  }

  return (
    <div>
      <h3>Booking Form for {room.name}</h3>
      <p><strong>Description:</strong> {room.description}</p>
      <p><strong>Price:</strong> ${room.price}</p>
      <p><strong>Status:</strong> {room.isBooked ? 'Booked' : 'Available'}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Contact Number:
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Check-In Date:
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Check-Out Date:
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: room.price.toString(), 
                  },
                }],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              console.log('Transaction completed by ' + details.payer.name.given_name);
              setIsPaid(true);
              Swal.fire({
                icon: 'success',
                title: 'Payment Successful',
                text: 'Payment has been processed successfully.',
              });
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
        </div>
        <button type="submit" disabled={!isPaid}>
          Submit and Proceed
        </button>
      </form>
    </div>
  );
};

export default BookingForm;