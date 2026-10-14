import React from 'react';
import { Filter, RotateCcw, MapPin, Zap } from 'lucide-react';
import { ZIMBABWE_CITIES, CATEGORIES, AMENITIES_LIST, getCitiesList } from '../data/mockData';

export default function FilterPanel({ filters, setFilters, resetFilters, venues = [] }) {
  const cities = getCitiesList(venues);

  const handleCityToggle = (city) => {
    setFilters(prev => ({
      ...prev,
      city: prev.city?.toLowerCase() === city.toLowerCase() ? '' : city
    }));
  };

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === catId ? '' : catId
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">
          <Filter size={18} color="var(--accent-gold)" /> Filter Venues
        </h3>
        <button className="reset-filter-btn" onClick={resetFilters} style={{ color: 'var(--accent-gold)' }}>
          <RotateCcw size={13} style={{ marginRight: '4px' }} /> Reset
        </button>
      </div>

      {/* Zimbabwean City Filter */}
      <div className="filter-group">
        <label className="filter-group-label">Zimbabwean City</label>
        <div style={{ marginBottom: '0.6rem' }}>
          <input
            type="text"
            list="filter-cities-list"
            placeholder="Type any city (e.g. Bulawayo, Harare...)"
            value={filters.city || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <datalist id="filter-cities-list">
            {cities.map(city => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto' }}>
          {cities.slice(0, 10).map(city => {
            const isSelected = filters.city?.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                className={`badge ${isSelected ? 'badge-gold' : 'badge-blue'}`}
                style={{ cursor: 'pointer', border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)' }}
                onClick={() => handleCityToggle(city)}
              >
                <MapPin size={12} /> {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-group-label">Venue Category</label>
        <div className="checkbox-list">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.category === cat.id}
                onChange={() => handleCategoryChange(cat.id)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* US$ Price Range */}
      <div className="filter-group">
        <label className="filter-group-label">Max Price / Day (US${filters.maxPrice})</label>
        <div className="range-slider-wrap">
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={filters.maxPrice || 1000}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="range-slider"
          />
          <div className="range-values">
            <span>US$100</span>
            <span>US$1,000+</span>
          </div>
        </div>
      </div>

      {/* Min Capacity */}
      <div className="filter-group">
        <label className="filter-group-label">Min Capacity ({filters.minCapacity || 0} guests)</label>
        <div className="range-slider-wrap">
          <input
            type="range"
            min="0"
            max="600"
            step="50"
            value={filters.minCapacity || 0}
            onChange={(e) => setFilters({ ...filters, minCapacity: Number(e.target.value) })}
            className="range-slider"
          />
          <div className="range-values">
            <span>0</span>
            <span>600+</span>
          </div>
        </div>
      </div>

      {/* Essential Zimbabwean Facilities */}
      <div className="filter-group">
        <label className="filter-group-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Zap size={14} color="var(--accent-gold)" /> Essential Facilities
        </label>
        <div className="checkbox-list" style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {AMENITIES_LIST.map(amenity => (
            <label key={amenity} className="checkbox-item">
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span style={{ fontWeight: (amenity.includes('Solar') || amenity.includes('Generator') || amenity.includes('Borehole')) ? '600' : '400', color: (amenity.includes('Solar') || amenity.includes('Generator') || amenity.includes('Borehole')) ? '#fcd34d' : 'var(--text-secondary)' }}>
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
