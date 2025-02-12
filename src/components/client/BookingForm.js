import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { IoCalendar, IoPersonCircle, IoHome, IoCall, IoArrowBack, IoPeople, IoBed, IoExpand, IoEye } from 'react-icons/io5';
import Swal from 'sweetalert2';
import './ClientStyles/BookingForm.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FormInput = ({ icon: Icon, ...props }) => (
  <div className="input-with-icon">
    <Icon />
    <input {...props} />
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="summary-item">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const RoomInfo = ({ icon: Icon, label, value }) => value && (
  <div className="info-item">
    <Icon className="info-icon" />
    <span>{label}: {value}</span>
  </div>
);

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room: roomData } = location.state || {};
  const [formData, setFormData] = useState({
    fullName: '', email: '', address: '', contactNumber: '',
    checkInDate: '', checkOutDate: '', specialRequests: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [paypalError, setPaypalError] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!roomData?.id) return;
      try {
        const querySnapshot = await getDocs(query(
          collection(db, "bookings"),
          where("roomId", "==", roomData.id),
          where("status", "in", ["Pending Approval", "Approved"])
        ));
        setCurrentBookings(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [roomData?.id]);

  const validateDates = (checkIn, checkOut, showAlert = true) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if ((checkInDate < today || checkOutDate <= checkInDate) && showAlert) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: checkInDate < today ? 'Check-in date cannot be in the past' : 'Check-out date must be after check-in date'
      });
      return false;
    }

    const hasOverlap = currentBookings.some(booking => 
      checkInDate <= new Date(booking.checkOutDate) && 
      new Date(booking.checkInDate) <= checkOutDate
    );

    if (hasOverlap && showAlert) {
      Swal.fire({
        icon: 'error',
        title: 'Date Unavailable',
        text: 'Selected dates overlap with an existing booking'
      });
    }

    return !hasOverlap;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name.includes('Date')) {
      const checkInDate = name === 'checkInDate' ? value : formData.checkInDate;
      const checkOutDate = name === 'checkOutDate' ? value : formData.checkOutDate;
      if (checkInDate && checkOutDate) {
        validateDates(checkInDate, checkOutDate, name === 'checkOutDate');
      }
    }
    setTimeout(() => validateForm(false), 0);
  };

  const validateForm = (showAlert = false) => {
    const isValid = Object.values(formData).every(val => val.trim() !== '') &&
      validateDates(formData.checkInDate, formData.checkOutDate, showAlert);
    setIsFormValid(isValid);
    return isValid;
  };

  const generateReceipt = (bookingData, paymentData) => {
    const doc = new jsPDF();
    
    // Add hotel logo (if you have one)
    // doc.addImage(hotelLogo, 'PNG', 10, 10, 50, 20);
    
    // Set colors
    const primaryColor = [139, 0, 0];  // Dark red
    const secondaryColor = [60, 60, 60];  // Dark grey
    const lightGrey = [128, 128, 128];  // Light grey

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 220, 40, 'F');
    
    // Hotel name
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('DOMICILE HOTELS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('LUXURY STAYS', 105, 30, { align: 'center' });

    // Receipt title
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(18);
    doc.text('PAYMENT RECEIPT', 105, 55, { align: 'center' });

    // Booking reference and date
    doc.setFontSize(10);
    doc.setTextColor(...lightGrey);
    doc.text(`Receipt No: ${bookingData.id}`, 15, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 195, 65, { align: 'right' });

    // Divider
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 70, 195, 70);

    // Guest Information
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Guest Information', 15, 85);

    const guestInfo = [
      ['Guest Name:', bookingData.fullName],
      ['Email:', bookingData.email],
      ['Contact:', bookingData.contactNumber],
      ['Address:', bookingData.address]
    ];

    doc.autoTable({
      startY: 90,
      head: [],
      body: guestInfo,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Booking Details
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Booking Details', 15, doc.autoTable.previous.finalY + 15);

    const bookingDetails = [
      ['Room Type:', bookingData.roomName],
      ['Check-in:', new Date(bookingData.checkInDate).toLocaleDateString()],
      ['Check-out:', new Date(bookingData.checkOutDate).toLocaleDateString()],
      ['Number of Nights:', calculateNights()],
      ['Room Capacity:', `${bookingData.capacity} Persons`],
      ['Bed Type:', bookingData.bedType],
      ['View:', bookingData.view]
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [],
      body: bookingDetails,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Payment Details
    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Payment Details', 15, doc.autoTable.previous.finalY + 15);

    const paymentDetails = [
      ['Payment ID:', paymentData.id],
      ['Payment Status:', 'Paid'],
      ['Room Rate per Night:', `$${roomData.price}`],
      ['Total Amount Paid:', `$${bookingData.totalAmount}`]
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [],
      body: paymentDetails,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 100 }
      },
      margin: { left: 15 }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    
    // Divider line
    doc.setDrawColor(...lightGrey);
    doc.setLineWidth(0.2);
    doc.line(15, pageHeight - 30, 195, pageHeight - 30);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(...lightGrey);
    doc.text('Thank you for choosing Domicile Hotels', 105, pageHeight - 25, { align: 'center' });
    doc.text('123 Luxury Avenue, Pretoria, South Africa', 105, pageHeight - 20, { align: 'center' });
    doc.text('Tel: +27 12 345 6789 | Email: info@domicilehotels.com', 105, pageHeight - 15, { align: 'center' });

    // QR Code (optional)
    // doc.addImage(qrCode, 'PNG', 170, pageHeight - 40, 25, 25);

    // Save the PDF
    const fileName = `DomicileHotels_Receipt_${bookingData.id}.pdf`;
    doc.save(fileName);
  };

  const handlePaymentSuccess = async (data, actions) => {
    try {
      if (!validateForm(true)) return;

      // First capture the payment
      const captureResult = await actions.order.capture();
      
      if (captureResult.status !== 'COMPLETED') {
        throw new Error('Payment was not completed successfully');
      }

      const user = getAuth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the booking document with safe access to roomImage
      const bookingData = {
        userId: user.uid,
        roomId: roomData.id,
        roomName: roomData.name || 'Room',
        roomImage: roomData.images?.[0] || '', // Safe access with fallback
        capacity: roomData.capacity || 2,
        bedType: roomData.bedType || 'Standard',
        view: roomData.view || 'Standard',
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        specialRequests: formData.specialRequests,
        totalAmount: calculateNights() * roomData.price,
        status: 'Pending Approval',
        paymentStatus: 'Paid',
        paymentId: captureResult.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
      
      // Generate and download receipt
      generateReceipt({ ...bookingData, id: bookingRef.id }, captureResult);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your payment receipt has been downloaded.',
        confirmButtonText: 'View Booking',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/booking-detail/${bookingRef.id}`);
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'There was an error processing your payment. Please try again.',
      });
    }
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    return Math.ceil(Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24));
  };

  if (!roomData) return <div className="booking-error">No room data available.</div>;

  const totalPrice = calculateNights() * (roomData?.price || 0);

  // Update the PayPal buttons configuration
  const paypalButtonConfig = {
    style: { 
      layout: "vertical",
      color: "gold",
      shape: "rect",
      label: "pay"
    },
    createOrder: (data, actions) => {
      if (!validateForm(true)) {
        return Promise.reject(new Error('Please fill all required fields'));
      }
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: totalPrice.toString()
          },
          description: `Booking for ${roomData.name}`
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
      });
    },
    onApprove: handlePaymentSuccess,
    onError: (err) => {
      console.error('PayPal Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'There was an issue processing your payment. Please try again.',
        confirmButtonText: 'OK'
      });
    },
    onCancel: () => {
      Swal.fire({
        icon: 'info',
        title: 'Payment Cancelled',
        text: 'You have cancelled the payment process.',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="booking-layout">
      <div className="booking-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back to Room Details
        </button>
        
        <div className="booking-container">
          <div className="booking-grid">
            <div className="room-summary">
              <img src={roomData.imageUrl} alt={roomData.name} className="room-image" />
              <div className="summary-content">
                <h2>Booking Summary</h2>
                <h3>{roomData.name}</h3>
                <p className="room-type">{roomData.type} Room</p>
                <SummaryItem label="Price per night" value={`$${roomData.price}`} />
                <SummaryItem label="Number of nights" value={calculateNights()} />
                <SummaryItem label="Total Price" value={`$${totalPrice}`} />

                <div className="room-additional-info">
                  <h4>Room Details</h4>
                  <div className="info-grid">
                    <RoomInfo icon={IoPeople} label="Capacity" value={`${roomData.capacity} persons`} />
                    <RoomInfo icon={IoBed} label="Bed" value={roomData.bedType} />
                    <RoomInfo icon={IoEye} label="View" value={roomData.view} />
                    <RoomInfo icon={IoHome} label="Floor"  value={roomData.floor} />
                  </div>

                  {roomData.policies && (
                    <div className="room-policies">
                      <h4>Room Policies</h4>
                      <ul>
                        {roomData.policies.map((policy, index) => (
                          <li key={index}>{policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="booking-form-container">
              <h2>Guest Information</h2>
              <form>
                <div className="form-group">
                  <label>Full Name</label>
                  <FormInput icon={IoPersonCircle} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <FormInput icon={IoHome} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <FormInput icon={IoHome} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" required />
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <FormInput icon={IoCall} type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Enter your contact number" required />
                </div>

                <div className="dates-group">
                  <div className="form-group">
                    <label>Check-in Date</label>
                    <FormInput icon={IoCalendar} type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                  </div>

                  <div className="form-group">
                    <label>Check-out Date</label>
                    <FormInput icon={IoCalendar} type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} min={formData.checkInDate || new Date().toISOString().split('T')[0]} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requests</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Any special requests or preferences?" rows="4" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-sidebar">
        <div className="payment-summary">
          <h3>Booking Summary</h3>
          <SummaryItem label="Room Rate" value={`$${roomData.price} / night`} />
          <SummaryItem label="Number of Nights" value={calculateNights()} />
          <SummaryItem label="Total Amount" value={`$${totalPrice}`} />
          
          <div className="payment-section">
            <div className="paypal-button-container">
              {!isFormValid ? (
                <div className="form-warning">Please fill in all required fields to proceed with payment.</div>
              ) : (
                <PayPalScriptProvider 
                  options={{
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    currency: "USD",
                    intent: "capture",
                    "disable-funding": "credit,card"
                  }}
                >
                  <PayPalButtons {...paypalButtonConfig} />
                </PayPalScriptProvider>
              )}
            </div>
            
            {currentBookings.length > 0 && (
              <div className="current-bookings-section">
                <h3>Current Bookings for this Room:</h3>
                <div className="bookings-list">
                  {currentBookings.map(booking => (
                    <div key={booking.id} className="booking-date-item">
                      <IoCalendar className="calendar-icon" />
                      <span>
                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                      </span>
                      <span className="booking-status">{booking.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paypalError && (
              <div className="paypal-error-notice">
                <p>Having trouble with PayPal? Try:</p>
                <ul>
                  <li>Temporarily disabling your ad blocker</li>
                  <li>Using a different browser</li>
                  <li>Checking your internet connection</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;