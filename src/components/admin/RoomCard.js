import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import EditRoom from "./EditRoom";
import "./AdminStyles/RoomCard.css";

const RoomCard = ({ room }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteDoc(doc(db, "rooms", room.id));
        alert("Room deleted successfully.");
      } catch (error) {
        console.error("Error deleting room: ", error);
      }
    }
  };

  return (
    <div className="room-card">
      {isEditing ? (
        <EditRoom room={room} setIsEditing={setIsEditing} />
      ) : (
        <>
          <h3>{room.name}</h3>
          {room.imageUrl && <img src={room.imageUrl} alt={room.name} width={300} />}
          <p>{room.description}</p>
          <p>Room Type: {room.roomType}</p>
          <p>Amenities: {room.amenities}</p>
          <p>Price: ${room.price}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDeleteRoom}>Delete</button>
        </>
      )}
    </div>
  );
};

export default RoomCard;
