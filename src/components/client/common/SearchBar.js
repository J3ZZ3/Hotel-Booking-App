import React, { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import '../ClientStyles/SearchBar.css';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';

const SearchBar = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, 'rooms');
        const roomsQuery = query(roomsCollection);
        const querySnapshot = await getDocs(roomsQuery);
        const roomsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRooms(roomsData);
        onSearchResults(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [onSearchResults]);

  useEffect(() => {
    const filterRooms = () => {
      if (!searchTerm.trim()) {
        onSearchResults(rooms);
        return;
      }

      const searchTermLower = searchTerm.toLowerCase();
      const filtered = rooms.filter(room => {
        return (
          room.name?.toLowerCase().includes(searchTermLower) ||
          room.type?.toLowerCase().includes(searchTermLower) ||
          room.description?.toLowerCase().includes(searchTermLower) ||
          room.price?.toString().includes(searchTermLower) ||
          room.bedType?.toLowerCase().includes(searchTermLower) ||
          room.view?.toLowerCase().includes(searchTermLower)
        );
      });

      onSearchResults(filtered);
    };

    const timeoutId = setTimeout(filterRooms, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, rooms, onSearchResults]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search rooms by name, type, price..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar; 