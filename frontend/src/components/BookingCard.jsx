import React, { useState } from 'react';
import { Calendar, Clock, Users, ShieldCheck, Zap } from 'lucide-react';
import { EVENT_TYPES } from '../data/mockData';
import '../styles/booking.css';

export default function BookingCard({ venue, onInitiateBooking }) {
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [guestCount, setGuestCount] = useState(150);
  const [eventType, setEventType] = useState('Weddings');

  const basePrice = venue.pricePerDay;
  const serviceFee = Math.round(basePrice * 0.1);
  const grandTotal = basePrice + serviceFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    onInitiateBooking({
      venue,
      eventDate,
      startTime,
      endTime,
      guestCount,
      eventType,
      grandTotal
    });
  };

  return (
    <aside className="booking-card">
      <div className="booking-price-header">
        <div>
          <span className="booking-price-amount" style={{ color: 'var(--accent-gold)' }}>
            US${venue.pricePerDay}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / day</span>
        </div>
        <span className="badge badge-gold">
          <Zap size={12} /> Instant Book
        </span>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        {/* Event Type */}
        <div className="booking-field">
          <label>Event Type</label>
          <select
            className="booking-input"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {EVENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="booking-field">
          <label>Event Date</label>
          <input
            type="date"
            className="booking-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>

        {/* Time Slots */}
        <div className="time-slot-grid">
          <div className="booking-field">
            <label>Start Time</label>
            <select
              className="booking-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              <option value="08:00">08:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
            </select>
          </div>
          <div className="booking-field">
            <label>End Time</label>
            <select
              className="booking-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              <option value="16:00">04:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="20:00">08:00 PM</option>
              <option value="22:00">10:00 PM</option>
              <option value="23:30">11:30 PM</option>
            </select>
          </div>
        </div>

        {/* Guest Count */}
        <div className="booking-field">
          <label>Estimated Guests (Max {venue.capacity})</label>
          <input
            type="number"
            className="booking-input"
            min="1"
            max={venue.capacity}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            required
          />
        </div>

        {/* Cost breakdown in US$ */}
        <div className="cost-summary">
          <div className="cost-row">
            <span>Daily Rate</span>
            <span>US${basePrice}</span>
          </div>
          <div className="cost-row">
            <span>Service & Maintenance Fee</span>
            <span>US${serviceFee}</span>
          </div>
          <div className="cost-row total">
            <span>Total Estimated</span>
            <span style={{ color: 'var(--accent-gold)' }}>US${grandTotal}</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
          Reserve Venue
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="#10b981" /> No charge until owner confirms
        </p>
      </form>
    </aside>
  );
}
