import React from 'react';
import './ClientStyles/Filters.css';

const Filters = ({ filters, setFilters }) => {
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handlePriceChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value
            }
        }));
    };

    return (
        <div className="filters-row">
            <div className="filter-dropdowns">
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                >
                    <option value="all">Status</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                </select>

                <select
                    value={filters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                    className="filter-select"
                >
                    <option value="all">Room Type</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                </select>

                <select
                    value={filters.view}
                    onChange={(e) => handleFilterChange('view', e.target.value)}
                    className="filter-select"
                >
                    <option value="all">View</option>
                    <option value="ocean">Ocean View</option>
                    <option value="city">City View</option>
                    <option value="garden">Garden View</option>
                </select>

                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min $"
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max $"
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Filters; 