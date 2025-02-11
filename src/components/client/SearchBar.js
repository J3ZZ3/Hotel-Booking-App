import React from 'react';
import './ClientStyles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                value={value || ''}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar; 