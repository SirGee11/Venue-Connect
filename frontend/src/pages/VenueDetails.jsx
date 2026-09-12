import React, { useState } from 'react';
import RatingStars from '../components/RatingStars';
import BookingCard from '../components/BookingCard';
import VenueCard from '../components/VenueCard';
import { getRecommendedVenues } from '../data/mockData';
import { MapPin, Users, Heart, Check, ShieldAlert, Sparkles, Map, ArrowLeft, Zap, Droplet } from 'lucide-react';
import '../styles/venue-details.css';

export default function VenueDetails({ venueId, venues, onSelectVenue, onInitiateBooking, isFavorite, onToggleFavorite, userFavorites }) {
  const venue = venues.find(v => v.id === venueId) || venues[0];
  const [selectedImage, setSelectedImage] = useState(venue.images[0]);

  // Recommended venues logic with natural rationale explanation
  const recommended = getRecommendedVenues(venue.id, venues, 3);

  return (
    <div className="venue-details-page container">
      {/* Back Button */}
      <button
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        onClick={() => window.history.back()}
      >
        <ArrowLeft size={15} /> Back to Search Results
      </button>

      {/* Details Header */}
      <header className="details-header">
        <div className="details-title-row">
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              {venue.category}
            </span>
            <h1 className="details-title">{venue.title}</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className={`btn-secondary ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(venue.id)}
            >
              <Heart size={18} fill={isFavorite ? '#f59e0b' : 'none'} color={isFavorite ? '#f59e0b' : 'currentColor'} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="details-meta">
          <div className="meta-item">
            <RatingStars rating={venue.rating} count={venue.reviewCount} />
          </div>
          <div className="meta-item">
            <MapPin size={16} color="var(--accent-gold)" />
            {venue.address}
          </div>
          <div className="meta-item">
            <Users size={16} color="var(--text-muted)" />
            Capacity: Up to {venue.capacity} guests
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="gallery-grid">
        <img src={selectedImage} alt={venue.title} className="gallery-main-img" />
        <div className="gallery-thumbs">
          {venue.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${venue.title} photo ${idx + 1}`}
              className="gallery-thumb-img"
              onClick={() => setSelectedImage(img)}
              style={{
                border: selectedImage === img ? '2px solid var(--accent-gold)' : 'none',
                opacity: selectedImage === img ? 1 : 0.7
              }}
            />
          ))}
        </div>
      </div>

      {/* Content & Sticky Booking Grid */}
      <div className="details-content-grid">
        {/* Main Details */}
        <main>
          {/* About Section */}
          <section className="details-section">
            <h3>About This Venue</h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
              "{venue.tagline}"
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.975rem' }}>
              {venue.description}
            </p>
          </section>

          {/* Amenities & Essential Infrastructure Section */}
          <section className="details-section">
            <h3>Included Amenities & Power / Water Infrastructure</h3>
            <div className="amenities-grid">
              {venue.amenities.map(amenity => {
                const isPower = amenity.includes('Solar') || amenity.includes('Generator');
                const isWater = amenity.includes('Borehole');
                return (
                  <div
                    key={amenity}
                    className="amenity-chip"
                    style={{
                      border: isPower ? '1px solid var(--border-gold)' : isWater ? '1px solid var(--border-blue)' : '1px solid var(--border-color)',
                      background: isPower ? 'rgba(245, 158, 11, 0.08)' : isWater ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-secondary)'
                    }}
                  >
                    {isPower ? <Zap size={16} color="var(--accent-gold)" /> : isWater ? <Droplet size={16} color="var(--accent-blue)" /> : <Check size={16} color="#10b981" />}
                    <span style={{ fontWeight: (isPower || isWater) ? '600' : '400', color: isPower ? '#fcd34d' : isWater ? '#93c5fd' : 'var(--text-primary)' }}>
                      {amenity}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Rules Section */}
          <section className="details-section">
            <h3>Venue Rules & Guidelines</h3>
            <ul className="rules-list">
              {venue.rules.map((rule, idx) => (
                <li key={idx}>
                  <ShieldAlert size={16} color="#f59e0b" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Location Map Mockup */}
          <section className="details-section">
            <h3>Location & City Context</h3>
            <div className="simulated-map">
              <Map size={36} color="var(--accent-gold)" />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{venue.address}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Located in {venue.suburb ? `${venue.suburb}, ` : ''}{venue.location}, Zimbabwe</span>
            </div>
          </section>

          {/* Customer Reviews Section */}
          <section className="details-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ border: 'none', padding: 0, margin: 0 }}>Verified Customer Reviews ({venue.reviewCount})</h3>
              <RatingStars rating={venue.rating} showCount={false} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>Farai & Chipo (Wedding Organizers)</strong>
                  <RatingStars rating={5} showCount={false} />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  "The solar backup power kicked in seamlessly during our wedding reception in {venue.location}. Exceptional service and clean facilities!"
                </p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong style={{ fontSize: '0.9rem' }}>Tinashe M. (Corporate Conference Convener)</strong>
                  <RatingStars rating={5} showCount={false} />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  "Hosted our regional workshop here. Borehole water supply and ample parking were greatly appreciated by our 150 delegates."
                </p>
              </div>
            </div>
          </section>

          {/* AI Recommendation Engine with Natural Rationale */}
          <section className="recommended-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-gold)" />
              <h2 style={{ fontSize: '1.5rem' }}>AI Recommended Venues in Zimbabwe</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Intelligent location, capacity, and budget matching for organizers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recommended.map(rec => (
                <div key={rec.id} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  {/* Rationale Explanation Callout */}
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#fcd34d' }}>
                    <Sparkles size={15} color="var(--accent-gold)" />
                    <span>{rec.naturalExplanation}</span>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <VenueCard
                      venue={rec}
                      onSelectVenue={onSelectVenue}
                      isFavorite={userFavorites.includes(rec.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar Sticky Booking Widget */}
        <aside>
          <BookingCard
            venue={venue}
            onInitiateBooking={onInitiateBooking}
          />
        </aside>
      </div>
    </div>
  );
}
