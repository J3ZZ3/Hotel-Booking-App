import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import EditRoom from "./EditRoom";
import Swal from "sweetalert2";
import "./AdminStyles/RoomCard.css";

const RoomCard = ({ room }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteDoc(doc(db, "rooms", room.id));
        alert("Room deleted successfully.");
        Swal.fire({
          icon: "success",
          title: "Room Deleted",
          text: "Room deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting room: ", error);
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: "Failed to delete room. Please try again.",
        });
      }
    }
  };

  return (
    <div className="room-card">
      <h3 className="room-title">{room.name}</h3>
      {room.imageUrl && <img src={room.imageUrl} alt={room.name} className="room-image" />}
      <p className="room-description">{room.description}</p>
      <p className="room-amenities">Amenities: {room.amenities}</p>
      <p className="room-price">Price: ${room.price}</p>
      <p className="room-status">Status: {room.isBooked ? "Booked" : "Available"}</p>
      {!room.isBooked && (
        <button className="book-button">Book Now</button>
      )}
      {room.isBooked && <p className="booked-message">This room is currently booked.</p>}
      {isEditing ? (
        <EditRoom room={room} setIsEditing={setIsEditing} />
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDeleteRoom}>Delete</button>
        </>
      )}
    </div>
  );
};

export default RoomCard;
