import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Users, DollarSign, Phone, Mail } from 'lucide-react';

export default function BookingModal({ bookingDetails, onClose, onConfirmBooking }) {
  const [contactName, setContactName] = useState('Tendai Moyo');
  const [contactEmail, setContactEmail] = useState('tendai.moyo@connect.co.zw');
  const [contactPhone, setContactPhone] = useState('+263 77 123 4567');
  const [specialRequests, setSpecialRequests] = useState('');

  if (!bookingDetails) return null;

  const { venue, eventDate, startTime, endTime, guestCount, eventType, grandTotal } = bookingDetails;

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirmBooking({
      ...bookingDetails,
      customerName: contactName,
      customerEmail: contactEmail,
      customerPhone: contactPhone,
      specialRequests
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Confirm Venue Reservation</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Summary Box */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>{venue.title}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><Calendar size={13} inline /> <strong>Date:</strong> {eventDate}</div>
              <div><Clock size={13} inline /> <strong>Time:</strong> {startTime} - {endTime}</div>
              <div><Users size={13} inline /> <strong>Guests:</strong> {guestCount}</div>
              <div><DollarSign size={13} inline /> <strong>Total:</strong> US${grandTotal}</div>
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              className="booking-input"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                className="booking-input"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Zimbabwe Phone (+263)</label>
              <input
                type="text"
                className="booking-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Special Notes or Infrastructure Requirements (Optional)</label>
            <textarea
              className="booking-input"
              rows={3}
              placeholder="e.g. Generator backup required during evening reception, early catering access..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              <CheckCircle2 size={16} /> Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
