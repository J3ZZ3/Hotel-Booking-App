import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";
import "./AdminStyles/EditRoom.css";

const EditRoom = ({ room, setIsEditing }) => {
  const [name, setName] = useState(room.name);
  const [description, setDescription] = useState(room.description);
  const [amenities, setAmenities] = useState(room.amenities);
  const [price, setPrice] = useState(room.price);
  const [roomType, setRoomType] = useState(room.roomType);
  const [image, setImage] = useState(null);

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = room.imageUrl;

      if (image) {
        const imageRef = ref(storage, `rooms/${room.id}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        name,
        description,
        amenities,
        price,
        roomType,
        imageUrl,
      });

      setIsEditing(false);
      alert("Room updated successfully.");
    } catch (error) {
      console.error("Error updating room: ", error);
      alert("Error updating room.");
    }
  };

  return (
    <div className="edit-room-overlay">
      <div className="edit-room-container">
        <h2 className="edit-room-header">Edit Room</h2>
        <form onSubmit={handleUpdateRoom} className="edit-room-form">
          <input
            type="text"
            placeholder="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="edit-room-input"
          />
          <textarea
            placeholder="Room Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-room-textarea"
          />
          <textarea
            placeholder="Room Amenities"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="edit-room-textarea"
          />
          <input
            type="number"
            placeholder="Room Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="edit-room-input"
          />
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="edit-room-select"
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="King">King</option>
            <option value="Suite">Suite</option>
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="edit-room-file-input"
          />
          <div className="edit-room-button-container">
            <button type="submit" className="edit-room-update-button">
              Update Room
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="edit-room-cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
