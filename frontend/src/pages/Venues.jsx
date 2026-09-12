import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import VenueCard from '../components/VenueCard';
import AiVenueFinder from '../components/AiVenueFinder';
import { SlidersHorizontal, SearchX, X, Bot, Grid } from 'lucide-react';
import '../styles/venues.css';

export default function Venues({ venues, onSelectVenue, searchParams, setSearchParams, userFavorites, onToggleFavorite }) {
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'ai-assistant'

  const [filters, setFilters] = useState({
    city: searchParams.location || '',
    category: searchParams.category || '',
    maxPrice: 1000,
    minCapacity: 0,
    amenities: []
  });

  const [sortBy, setSortBy] = useState('recommended');

  const resetFilters = () => {
    setFilters({
      city: '',
      category: '',
      maxPrice: 1000,
      minCapacity: 0,
      amenities: []
    });
    setSearchParams({ keyword: '', location: '', category: '', eventType: '' });
  };

  // Filter & Sort Logic
  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      // Keyword or Suburb search
      if (searchParams.keyword) {
        const kw = searchParams.keyword.toLowerCase();
        const matchTitle = venue.title.toLowerCase().includes(kw);
        const matchDesc = venue.description.toLowerCase().includes(kw);
        const matchSuburb = venue.suburb ? venue.suburb.toLowerCase().includes(kw) : false;
        if (!matchTitle && !matchDesc && !matchSuburb) return false;
      }

      // Location / City filter
      const targetCity = filters.city || searchParams.location;
      if (targetCity) {
        const cityLower = targetCity.toLowerCase();
        const venueLocLower = venue.location.toLowerCase();
        if (!venueLocLower.includes(cityLower)) return false;
      }

      // Category filter
      const targetCategory = filters.category || searchParams.category;
      if (targetCategory && venue.category !== targetCategory) {
        return false;
      }

      // Max Price per day
      if (venue.pricePerDay > filters.maxPrice) {
        return false;
      }

      // Min Capacity
      if (venue.capacity < filters.minCapacity) {
        return false;
      }

      // Amenities / Facilities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(a => venue.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      return 0;
    });
  }, [venues, searchParams, filters, sortBy]);

  return (
    <div className="venues-page container">
      {/* Top Header & Search Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <SearchBar
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearchSubmit={() => {}}
        />
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          className={`tab-btn ${viewMode === 'catalog' ? 'active' : ''}`}
          onClick={() => setViewMode('catalog')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Grid size={16} /> Venue Catalog Grid ({filteredVenues.length})
        </button>

        <button
          className={`tab-btn ${viewMode === 'ai-assistant' ? 'active' : ''}`}
          onClick={() => setViewMode('ai-assistant')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: viewMode === 'ai-assistant' ? 'var(--accent-gold)' : '' }}
        >
          <Bot size={16} color="var(--accent-gold)" /> AI Intelligent Venue Assistant
        </button>
      </div>

      {/* View Mode 1: Interactive AI Smart Finder */}
      {viewMode === 'ai-assistant' ? (
        <AiVenueFinder
          venues={venues}
          onSelectVenue={onSelectVenue}
          userFavorites={userFavorites}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        /* View Mode 2: Standard Search & Filter Catalog */
        <div className="venues-layout">
          {/* Filter Panel Sidebar */}
          <FilterPanel
            filters={{ ...filters, city: filters.city || searchParams.location, category: filters.category || searchParams.category }}
            setFilters={setFilters}
            resetFilters={resetFilters}
          />

          {/* Listings Content */}
          <main>
            {/* Toolbar */}
            <div className="venues-toolbar">
              <div className="results-count">
                Found <strong>{filteredVenues.length}</strong> available venues in Zimbabwe
              </div>

              <div className="sort-selector">
                <label htmlFor="sort-select">Sort By:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price (US$): Low to High</option>
                  <option value="price-desc">Price (US$): High to Low</option>
                  <option value="capacity">Highest Capacity</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {(searchParams.keyword || searchParams.location || filters.city || filters.category || searchParams.category || filters.maxPrice < 1000 || filters.minCapacity > 0 || (filters.amenities && filters.amenities.length > 0)) && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Filters:</span>
                {searchParams.keyword && (
                  <span className="badge badge-gold">
                    Keyword: "{searchParams.keyword}"
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchParams({ ...searchParams, keyword: '' })} />
                  </span>
                )}
                {(filters.city || searchParams.location) && (
                  <span className="badge badge-gold">
                    City: {filters.city || searchParams.location}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setFilters({ ...filters, city: '' }); setSearchParams({ ...searchParams, location: '' }); }} />
                  </span>
                )}
                {(filters.category || searchParams.category) && (
                  <span className="badge badge-blue">
                    Category: {filters.category || searchParams.category}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setFilters({ ...filters, category: '' }); setSearchParams({ ...searchParams, category: '' }); }} />
                  </span>
                )}
                {filters.maxPrice < 1000 && (
                  <span className="badge badge-gold">
                    Max US${filters.maxPrice}/day
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilters({ ...filters, maxPrice: 1000 })} />
                  </span>
                )}
              </div>
            )}

            {/* Venues Grid or Empty State */}
            {filteredVenues.length > 0 ? (
              <div className="venues-grid">
                {filteredVenues.map(venue => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onSelectVenue={onSelectVenue}
                    isFavorite={userFavorites.includes(venue.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <SearchX size={48} className="empty-state-icon" style={{ color: 'var(--accent-gold)' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Zimbabwean Venues Found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Try clearing your location filter or using our AI Smart Assistant.
                </p>
                <button className="btn-primary" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
