import React, { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import './ClientStyles/SearchBar.css';

const SearchBar = ({ rooms, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filterRooms = () => {
      if (!searchTerm.trim()) {
        onSearchResults(rooms); // Show all rooms when search is empty
        return;
      }

      const searchTermLower = searchTerm.toLowerCase();
      const filtered = rooms.filter(room => {
        return (
          room.name.toLowerCase().includes(searchTermLower) ||
          room.type.toLowerCase().includes(searchTermLower) ||
          room.description.toLowerCase().includes(searchTermLower) ||
          room.price.toString().includes(searchTermLower) ||
          (room.bedType && room.bedType.toLowerCase().includes(searchTermLower)) ||
          (room.view && room.view.toLowerCase().includes(searchTermLower))
        );
      });

      onSearchResults(filtered);
    };

    const timeoutId = setTimeout(filterRooms, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, rooms, onSearchResults]);

  return (
    <div className="search-bar">
      <IoSearch className="search-icon" />
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