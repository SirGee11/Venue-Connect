import React from 'react';
import { Search, MapPin, Calendar, DollarSign, Tag } from 'lucide-react';
import { ZIMBABWE_CITIES, EVENT_TYPES } from '../data/mockData';

export default function SearchBar({ searchParams, setSearchParams, onSearchSubmit }) {
  return (
    <form
      className="search-bar-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSearchSubmit();
      }}
    >
      <div className="search-bar-grid">
        {/* City / Location Selection */}
        <div className="search-field">
          <label>City / Location (Zimbabwe)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--accent-gold)" />
            <select
              value={searchParams.location || ''}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            >
              <option value="">All Locations in Zimbabwe</option>
              {ZIMBABWE_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Type */}
        <div className="search-field">
          <label>Event Type</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={16} color="var(--accent-gold)" />
            <select
              value={searchParams.eventType || ''}
              onChange={(e) => setSearchParams({ ...searchParams, eventType: e.target.value })}
            >
              <option value="">All Event Types</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Venue Title / Suburb Search */}
        <div className="search-field">
          <label>Venue Name or Suburb</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="e.g. Hillside, Borrowdale, Gardens..."
              value={searchParams.keyword || ''}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary" style={{ padding: '0.9rem 1.75rem' }}>
          <Search size={18} /> Search Venues
        </button>
      </div>
    </form>
  );
}
