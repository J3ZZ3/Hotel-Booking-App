import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import Swal from 'sweetalert2';
import './AdminStyles/RoomDetail.css';

const RoomDetail = ({ room, onClose }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-room/${room.id}`);
  };

  const handleDelete = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#666',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'custom-popup'
        }
      });

      if (result.isConfirmed) {
        // Delete the room
        await deleteDoc(doc(db, 'rooms', room.id));
        
        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          text: 'The room has been deleted.',
          icon: 'success',
          confirmButtonColor: '#c0392b',
          customClass: {
            popup: 'custom-popup'
          }
        });
        
        // Close the detail view and refresh the page
        onClose();
        window.location.reload();
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the room.',
        icon: 'error',
        confirmButtonColor: '#c0392b',
        customClass: {
          popup: 'custom-popup'
        }
      });
      console.error("Error deleting room: ", error);
    }
  };

  // Convert amenities to array if it's not already
  const amenitiesList = Array.isArray(room.amenities) ? room.amenities : [];

  return (
    <div className="room-detail-overlay" onClick={onClose}>
      <div className="room-detail-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="room-detail-image-container">
          <img src={room.imageUrl} alt={room.name} className="room-detail-image" />
        </div>

        <div className="room-detail-info">
          <h2>{room.name}</h2>
          
          <div className="detail-section">
            <h3>Room Details</h3>
            <p><strong>Type:</strong> {room.type || 'N/A'}</p>
            <p><strong>Price:</strong> ${room.price || 'N/A'} per night</p>
            <p><strong>Capacity:</strong> {room.capacity || 'N/A'} persons</p>
            <p><strong>Status:</strong> <span className={`status ${(room.status || '').toLowerCase()}`}>{room.status || 'N/A'}</span></p>
          </div>

          <div className="detail-section">
            <h3>Amenities</h3>
            <div className="amenities-list">
              {amenitiesList.length > 0 ? (
                amenitiesList.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))
              ) : (
                <span className="amenity-tag">No amenities listed</span>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <p>{room.description || 'No description available'}</p>
          </div>

          <div className="room-detail-actions">
            <button className="delete-button" onClick={handleDelete}>
              Delete Room
            </button>
            <button className="edit-button" onClick={handleEdit}>
              Edit Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail; 