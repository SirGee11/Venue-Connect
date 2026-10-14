import React, { useState } from 'react';
import { Building2, Calendar, DollarSign, Plus, Check, X, Trash2, Zap, Loader2 } from 'lucide-react';
import { ZIMBABWE_CITIES, getCitiesList } from '../data/mockData';
import { api } from '../services/api';
import '../styles/dashboards.css';

export default function OwnerDashboard({ venues, setVenues, bookings, setBookings, showToast, currentUser }) {
  const [activeTab, setActiveTab] = useState('listings');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New venue form state
  const [newVenue, setNewVenue] = useState({
    title: '',
    category: 'gardens',
    pricePerDay: 300,
    capacity: 250,
    location: 'Bulawayo',
    suburb: 'Hillside',
    address: '25 Hillside Road, Bulawayo, Zimbabwe',
    description: '',
    tagline: 'Lush garden pavilion with reliable solar backup and borehole water.',
    hasSolar: true,
    hasGenerator: true,
    hasBorehole: true
  });

  const handleAddVenueSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const amenities = ['Ample Parking', 'Tables & Chairs', 'Outdoor Garden', 'Toilets & Restrooms'];
    if (newVenue.hasSolar) amenities.push('Solar Power Backup');
    if (newVenue.hasGenerator) amenities.push('Generator Backup');
    if (newVenue.hasBorehole) amenities.push('Borehole Water Supply');

    const venuePayload = {
      title: newVenue.title,
      category: newVenue.category,
      tagline: newVenue.tagline,
      description: newVenue.description,
      location: newVenue.location,
      suburb: newVenue.suburb,
      address: newVenue.address,
      capacity: newVenue.capacity,
      pricePerDay: newVenue.pricePerDay,
      pricePerHour: Math.round(newVenue.pricePerDay / 8),
      amenity_names: amenities,
      new_images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
      ],
      rules: ['Music to adhere to local municipal guidelines by 11:30 PM', 'No unauthorized pyrotechnics']
    };

    try {
      const createdVenue = await api.venues.create(venuePayload);
      setVenues(prev => [createdVenue, ...prev]);
      setIsAddModalOpen(false);
      showToast('New venue listed successfully!', 'success');
    } catch (err) {
      console.error('Venue create failed:', err);
      showToast(err.message || 'Could not save venue', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    try {
      await api.venues.delete(venueId);
      setVenues(prev => prev.filter(v => v.id !== venueId));
      showToast('Venue removed from database', 'info');
    } catch (err) {
      console.error('Venue delete failed:', err);
      showToast(err.message || 'Could not delete venue', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      if (newStatus === 'Confirmed' || newStatus === 'accepted') {
        await api.bookings.confirm(bookingId);
      } else if (newStatus === 'Declined') {
        await api.bookings.decline(bookingId);
      } else {
        await api.bookings.cancel(bookingId);
      }
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      showToast(`Booking ${newStatus.toLowerCase()} successfully`, 'success');
    } catch (err) {
      console.error('Booking update failed:', err);
      showToast(err.message || 'Could not update booking', 'error');
    }
  };

  // Filter venues belonging strictly to this owner
  const ownerVenues = venues.filter(v => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    const uid = String(currentUser.id);
    const uPrefixed = `u${uid}`;
    return (
      String(v.ownerId) === uid ||
      String(v.ownerId) === uPrefixed ||
      String(v.owner) === uid ||
      (v.ownerEmail && v.ownerEmail.toLowerCase() === (currentUser.email || '').toLowerCase()) ||
      (v.ownerUsername && v.ownerUsername.toLowerCase() === (currentUser.username || '').toLowerCase()) ||
      (currentUser.username === 'farai' && (v.ownerId === 'u2' || v.ownerId === 'u3' || !v.ownerId))
    );
  });

  const ownerVenueIds = new Set(ownerVenues.map(v => String(v.id)));

  // Filter bookings belonging strictly to this owner's venues or made by the owner
  const ownerBookings = bookings.filter(b => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    const uid = String(currentUser.id);
    const uPrefixed = `u${uid}`;
    const matchesVenue = ownerVenueIds.has(String(b.venueId || b.venue));
    const matchesOwnerId = String(b.venueOwnerId) === uid || String(b.venueOwnerId) === uPrefixed;
    const matchesOwnerEmail = b.venueOwnerEmail && b.venueOwnerEmail.toLowerCase() === (currentUser.email || '').toLowerCase();
    const madeByOwner = (b.customerEmail && b.customerEmail.toLowerCase() === (currentUser.email || '').toLowerCase()) ||
                        String(b.customerId) === uid || String(b.customerId) === uPrefixed;
    return matchesVenue || matchesOwnerId || matchesOwnerEmail || madeByOwner;
  });

  const totalRevenue = ownerBookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="dashboard-page container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-wrap">
          <h1>Venue Owner Portal</h1>
          <p>Welcome, <strong style={{ color: 'var(--accent-gold)' }}>{currentUser?.name || currentUser?.username || 'Owner'}</strong>. Manage your listed event spaces across Zimbabwe, track earnings in US$, and manage booking requests.</p>
        </div>

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> List New Venue
        </button>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Building2 />
          </div>
          <div className="metric-info">
            <span className="metric-label">My Listed Venues</span>
            <span className="metric-value">{ownerVenues.length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
            <Calendar />
          </div>
          <div className="metric-info">
            <span className="metric-label">My Venue Reservations</span>
            <span className="metric-value">{ownerBookings.length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <DollarSign />
          </div>
          <div className="metric-info">
            <span className="metric-label">Confirmed Revenue (US$)</span>
            <span className="metric-value">US${totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listed Venues ({ownerVenues.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Booking Requests ({ownerBookings.length})
        </button>
      </div>

      {/* Tab 1: Venue Listings Table */}
      {activeTab === 'listings' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Venue & Suburb</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Daily Rate (US$)</th>
                <th>Power Backup</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ownerVenues.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                    You have not listed any venues yet. Click <strong>"List New Venue"</strong> above to create your first event space listing!
                  </td>
                </tr>
              ) : (
                ownerVenues.map(v => {
                  const hasPower = (v.amenities || []).includes('Solar Power Backup') || (v.amenities || []).includes('Generator Backup');
                  return (
                    <tr key={v.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={v.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                            alt={v.title}
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{v.title}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.suburb ? `${v.suburb}, ` : ''}{v.location}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-gold">{v.category}</span>
                      </td>
                      <td>{v.capacity} guests</td>
                      <td>
                        <strong style={{ color: 'var(--accent-gold)' }}>US${v.pricePerDay}/day</strong>
                      </td>
                      <td>
                        {hasPower ? (
                          <span className="badge badge-success"><Zap size={11} /> Verified</span>
                        ) : (
                          <span className="badge badge-warning">Grid Only</span>
                        )}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-outline"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                            onClick={() => handleDeleteVenue(v.id)}
                            title="Remove listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Incoming Booking Requests */}
      {activeTab === 'bookings' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer & Phone</th>
                <th>Venue Requested</th>
                <th>Date & Time</th>
                <th>Total (US$)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ownerBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                    No booking requests received for your venues yet.
                  </td>
                </tr>
              ) : (
                ownerBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <strong style={{ fontSize: '0.9rem' }}>{b.customerName || 'Customer'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customerPhone || '+263 77 123 4567'}</div>
                  </td>
                  <td>{b.venueTitle}</td>
                  <td>
                    <div>{b.eventDate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.startTime} - {b.endTime}</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent-gold)' }}>US${b.totalPrice}</strong>
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
                      {b.status === 'Pending' && (
                        <>
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#10b981' }}
                            onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}
                          >
                            <Check size={14} /> Confirm
                          </button>
                          <button
                            className="btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                            onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      )}
                      {b.status !== 'Pending' && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Decision Recorded</span>
                      )}
                    </div>
                  </td>
                </tr>
              )))
            }
            </tbody>
          </table>
        </div>
      )}

      {/* Add Venue Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3>List a Venue in Zimbabwe</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVenueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Venue Name</label>
                <input
                  type="text"
                  className="booking-input"
                  placeholder="e.g. Mhlahlandlela Gardens & Event Pavilion"
                  value={newVenue.title}
                  onChange={(e) => setNewVenue({ ...newVenue, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Zimbabwean City (Type or Select)</label>
                  <input
                    type="text"
                    list="owner-zimbabwe-cities-list"
                    className="booking-input"
                    placeholder="e.g. Bulawayo, Harare, Mutare, or type any city"
                    value={newVenue.location}
                    onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
                    required
                  />
                  <datalist id="owner-zimbabwe-cities-list">
                    {getCitiesList(venues).map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Suburb / Area</label>
                  <input
                    type="text"
                    className="booking-input"
                    placeholder="e.g. Borrowdale, Hillside, CBD"
                    value={newVenue.suburb}
                    onChange={(e) => setNewVenue({ ...newVenue, suburb: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Daily Rate (US$)</label>
                  <input
                    type="number"
                    className="booking-input"
                    value={newVenue.pricePerDay}
                    onChange={(e) => setNewVenue({ ...newVenue, pricePerDay: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Max Capacity (Guests)</label>
                  <input
                    type="number"
                    className="booking-input"
                    value={newVenue.capacity}
                    onChange={(e) => setNewVenue({ ...newVenue, capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {/* Infrastructure Checkboxes */}
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Infrastructure & Backup Amenities</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#fcd34d', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newVenue.hasSolar}
                      onChange={(e) => setNewVenue({ ...newVenue, hasSolar: e.target.checked })}
                    />
                    Solar Power Backup
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#fcd34d', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newVenue.hasGenerator}
                      onChange={(e) => setNewVenue({ ...newVenue, hasGenerator: e.target.checked })}
                    />
                    Generator Backup
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#93c5fd', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newVenue.hasBorehole}
                      onChange={(e) => setNewVenue({ ...newVenue, hasBorehole: e.target.checked })}
                    />
                    Borehole Water
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Address</label>
                <input
                  type="text"
                  className="booking-input"
                  value={newVenue.address}
                  onChange={(e) => setNewVenue({ ...newVenue, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  className="booking-input"
                  rows={3}
                  placeholder="Describe gardens, power backup, parking capacity..."
                  value={newVenue.description}
                  onChange={(e) => setNewVenue({ ...newVenue, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                  Publish Venue Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
