import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendar, IoChevronForward, IoHome } from 'react-icons/io5';
import '../ClientStyles/BookingCard.css';

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="booking-card" onClick={() => navigate(`/booking-detail/${booking.id}`)}>
      <div className="booking-card-image">
        {!imageError ? (
          <img 
            src={booking.roomImage} 
            alt={booking.roomName}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <IoHome />
          </div>
        )}
      </div>
      <div className="booking-card-content">
        <h3>{booking.roomName}</h3>
        <div className="booking-dates">
          <IoCalendar />
          <span>
            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
          </span>
        </div>
        <div className="booking-status-badge" data-status={booking.status.toLowerCase()}>
          {booking.status}
        </div>
      </div>
      <IoChevronForward className="view-details-icon" />
    </div>
  );
};

export default BookingCard; 