import React from 'react';
import { IoFilterSharp, IoClose } from 'react-icons/io5';
import './ClientStyles/Filters.css';

const Filters = ({ filters, setFilters, showFilters, setShowFilters }) => {
    const amenitiesOptions = [
        'Wi-Fi',
        'Air Conditioning',
        'Mini Bar',
        'Room Service',
        'Ocean View',
        'Balcony',
        'TV',
        'Kitchen',
        'Jacuzzi',
        'Pool Access'
    ];

    const roomTypes = [
        'Standard',
        'Deluxe',
        'Suite',
        'Executive',
        'Penthouse'
    ];

    const bedTypes = [
        'Single',
        'Double',
        'Queen',
        'King',
        'Twin'
    ];

    const viewTypes = [
        'Ocean',
        'City',
        'Garden',
        'Pool',
        'Mountain'
    ];

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: 'all',
            priceRange: { min: 0, max: 5000 },
            view: 'all',
            roomType: 'all',
            bedType: 'all',
            amenities: [],
            capacity: 'all'
        });
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value
        }));
    };

    return (
        <div className="filters-section">
            <div className="search-and-filters">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search rooms by name or type..."
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                    />
                </div>
                
                <div className="filters-header">
                    <button 
                        className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <IoFilterSharp /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    {showFilters && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <IoClose /> Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="filters-grid">
                    {/* Status Filter */}
                    <div className="filter-group">
                        <label>Availability</label>
                        <select 
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="booked">Fully Booked</option>
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="filter-group">
                        <label>Price Range (per night)</label>
                        <div className="price-range">
                            <input
                                type="number"
                                value={filters.priceRange.min}
                                onChange={(e) => handleFilterChange('priceRange', {
                                    ...filters.priceRange,
                                    min: parseInt(e.target.value)
                                })}
                                placeholder="Min"
                            />
                            <span>to</span>
                            <input
                                type="number"
                                value={filters.priceRange.max}
                                onChange={(e) => handleFilterChange('priceRange', {
                                    ...filters.priceRange,
                                    max: parseInt(e.target.value)
                                })}
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    {/* Room Type Filter */}
                    <div className="filter-group">
                        <label>Room Type</label>
                        <select
                            value={filters.roomType}
                            onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        >
                            <option value="all">All Types</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type.toLowerCase()}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* View Type Filter */}
                    <div className="filter-group">
                        <label>View</label>
                        <select
                            value={filters.view}
                            onChange={(e) => handleFilterChange('view', e.target.value)}
                        >
                            <option value="all">All Views</option>
                            {viewTypes.map(view => (
                                <option key={view} value={view.toLowerCase()}>
                                    {view}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bed Type Filter */}
                    <div className="filter-group">
                        <label>Bed Type</label>
                        <select
                            value={filters.bedType}
                            onChange={(e) => handleFilterChange('bedType', e.target.value)}
                        >
                            <option value="all">All Bed Types</option>
                            {bedTypes.map(type => (
                                <option key={type} value={type.toLowerCase()}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="filter-group amenities-group">
                        <label>Amenities</label>
                        <div className="amenities-grid">
                            {amenitiesOptions.map(amenity => (
                                <label key={amenity} className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                    />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters; 