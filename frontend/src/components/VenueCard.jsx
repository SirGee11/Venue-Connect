import React from 'react';
import { MapPin, Users, Heart, ArrowRight, Zap } from 'lucide-react';
import RatingStars from './RatingStars';
import '../styles/venue-card.css';

export default function VenueCard({ venue, onSelectVenue, isFavorite, onToggleFavorite }) {
  const hasPowerBackup = venue.amenities.includes('Solar Power Backup') || venue.amenities.includes('Generator Backup');

  return (
    <article className="venue-card">
      <div className="venue-card-image-wrap">
        <img
          src={venue.images[0]}
          alt={venue.title}
          className="venue-card-image"
          loading="lazy"
        />
        <span className="badge venue-badge-category" style={{ background: 'rgba(9, 13, 22, 0.85)', color: '#fcd34d', borderColor: 'var(--border-gold)' }}>
          {venue.category}
        </span>

        {hasPowerBackup && (
          <span className="badge badge-gold" style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', fontSize: '0.75rem' }}>
            <Zap size={11} /> Power Backup
          </span>
        )}

        <button
          className={`venue-fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(venue.id);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={isFavorite ? '#f59e0b' : 'none'} color={isFavorite ? '#f59e0b' : '#ffffff'} />
        </button>
      </div>

      <div className="venue-card-body">
        <div className="venue-card-header">
          <h3 className="venue-card-title">{venue.title}</h3>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <RatingStars rating={venue.rating} count={venue.reviewCount} />
        </div>

        <p className="venue-card-location">
          <MapPin size={14} color="var(--accent-gold)" />
          {venue.suburb ? `${venue.suburb}, ${venue.location}` : venue.location}
        </p>

        <div className="venue-card-features">
          <div className="feature-item">
            <Users size={14} color="var(--text-muted)" />
            <span>Up to {venue.capacity} guests</span>
          </div>
        </div>

        <div className="venue-card-footer">
          <div className="venue-price">
            <span className="price-amount" style={{ color: 'var(--accent-gold)' }}>
              US${venue.pricePerDay}
            </span>
            <span className="price-unit">per day</span>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => onSelectVenue(venue.id)}
          >
            Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
