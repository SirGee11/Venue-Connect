import React from 'react';
import { Search, MapPin, Tag } from 'lucide-react';
import { ZIMBABWE_CITIES, EVENT_TYPES, getCitiesList } from '../data/mockData';

export default function SearchBar({ searchParams, setSearchParams, onSearchSubmit, venues = [] }) {
  const cities = getCitiesList(venues);

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
            <input
              type="text"
              list="search-cities-list"
              placeholder="All Cities or type city..."
              value={searchParams.location || ''}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            />
            <datalist id="search-cities-list">
              {cities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
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
