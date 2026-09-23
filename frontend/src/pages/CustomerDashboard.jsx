import React, { useState } from 'react';
import VenueCard from '../components/VenueCard';
import { Calendar, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import '../styles/dashboards.css';

export default function CustomerDashboard({ bookings, setBookings, venues, userFavorites, onToggleFavorite, onSelectVenue, navigateTo, showToast }) {
  const [activeTab, setActiveTab] = useState('bookings');

  const customerBookings = bookings;

  const handleCancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    showToast('Reservation cancelled successfully', 'info');
  };

  const favoriteVenues = venues.filter(v => userFavorites.includes(v.id));

  return (
    <div className="dashboard-page container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-wrap">
          <h1>Customer Portal</h1>
          <p>Manage your Zimbabwean event venue reservations and saved favorites</p>
        </div>

        <button className="btn-primary" onClick={() => navigateTo('venues')}>
          Browse Venues <ArrowRight size={16} />
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Calendar />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Reservations</span>
            <span className="metric-value">{customerBookings.length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
            <CheckCircle />
          </div>
          <div className="metric-info">
            <span className="metric-label">Confirmed Reservations</span>
            <span className="metric-value">{customerBookings.filter(b => b.status === 'Confirmed').length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <Heart />
          </div>
          <div className="metric-info">
            <span className="metric-label">Saved Favorites</span>
            <span className="metric-value">{favoriteVenues.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Reservations ({customerBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Saved Favorites ({favoriteVenues.length})
        </button>
      </div>

      {/* Tab 1: Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Venue Name & Location</th>
                <th>Event Date & Time</th>
                <th>Event & Guests</th>
                <th>Total Price (US$)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customerBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={b.venueImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80'}
                        alt={b.venueTitle}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{b.venueTitle}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.location}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{b.eventDate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.startTime} - {b.endTime}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{b.eventType || 'Event'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.guestCount} guests</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-gold)', fontSize: '1rem' }}>US${b.totalPrice}</strong>
                  </td>
                  <td>
                    <span className={`badge ${
                      b.status === 'Confirmed' ? 'badge-success' :
                      b.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => onSelectVenue(b.venueId)}
                      >
                        View Details
                      </button>
                      {b.status !== 'Cancelled' && (
                        <button
                          className="btn-outline"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                          onClick={() => handleCancelBooking(b.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Favorites Grid */}
      {activeTab === 'favorites' && (
        favoriteVenues.length > 0 ? (
          <div className="venues-grid">
            {favoriteVenues.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onSelectVenue={onSelectVenue}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={48} className="empty-state-icon" style={{ color: 'var(--accent-gold)' }} />
            <h3>No Saved Favorites</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Save wedding gardens, conference halls, and lodges to your favorites list while exploring.
            </p>
            <button className="btn-primary" onClick={() => navigateTo('venues')}>
              Browse Venues
            </button>
          </div>
        )
      )}
    </div>
  );
}
