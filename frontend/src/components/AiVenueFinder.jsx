import React, { useState } from 'react';
import { Sparkles, MapPin, Users, DollarSign, Tag, Zap, Check, ArrowRight, Bot } from 'lucide-react';
import { ZIMBABWE_CITIES, EVENT_TYPES, AMENITIES_LIST } from '../data/mockData';
import VenueCard from './VenueCard';

export default function AiVenueFinder({ venues, onSelectVenue, userFavorites, onToggleFavorite }) {
  const [location, setLocation] = useState('Bulawayo');
  const [eventType, setEventType] = useState('Weddings');
  const [guestCount, setGuestCount] = useState(200);
  const [maxBudget, setMaxBudget] = useState(500);
  const [selectedFacilities, setSelectedFacilities] = useState([
    'Solar Power Backup',
    'Ample Parking',
    'Borehole Water Supply'
  ]);

  const [aiMatchResult, setAiMatchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const keyFacilitiesList = [
    'Solar Power Backup',
    'Generator Backup',
    'Borehole Water Supply',
    'Ample Parking',
    'Professional Catering',
    'High-Speed Wi-Fi',
    'HD Projector & Screen',
    'Air Conditioning'
  ];

  const handleFacilityToggle = (fac) => {
    setSelectedFacilities(prev =>
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  const handleRunAiRecommendation = (e) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      // AI Scoring Algorithm
      let bestMatch = null;
      let highestScore = -1;
      let bestRationale = '';

      venues.forEach(v => {
        let score = 0;
        let reasons = [];

        // 1. Location match
        if (v.location.toLowerCase() === location.toLowerCase()) {
          score += 50;
          reasons.push(`located in ${v.location}`);
        }

        // 2. Capacity fit
        if (v.capacity >= guestCount) {
          score += 30;
          reasons.push(`accommodates up to ${v.capacity} guests`);
        } else {
          score -= 20;
        }

        // 3. Budget fit
        if (v.pricePerDay <= maxBudget) {
          score += 25;
          reasons.push(`fits within your US$${maxBudget} budget at US$${v.pricePerDay}/day`);
        } else {
          score -= 15;
        }

        // 4. Facilities match
        const matchedFacs = selectedFacilities.filter(f => v.amenities.includes(f));
        if (matchedFacs.length > 0) {
          score += matchedFacs.length * 15;
          reasons.push(`provides ${matchedFacs.join(', ')}`);
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = v;
          bestRationale = `We recommend ${v.title} because it is ${reasons.join(', ')}.`;
        }
      });

      setAiMatchResult({
        venue: bestMatch || venues[0],
        matchPercentage: Math.min(99, Math.max(75, Math.round((highestScore / 130) * 100))),
        rationale: bestRationale || `We recommend ${bestMatch ? bestMatch.title : venues[0].title} as your top event match.`
      });
      setIsSearching(false);
    }, 400);
  };

  return (
    <div style={{
      background: 'rgba(24, 34, 54, 0.9)',
      border: '1px solid var(--border-gold)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      boxShadow: 'var(--shadow-lg), var(--shadow-gold-glow)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--accent-gold-gradient)', color: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>AI Smart Venue Assistant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Intelligent recommendation engine for events in Zimbabwe</p>
          </div>
        </div>

        <span className="badge badge-gold" style={{ padding: '0.4rem 0.9rem' }}>
          <Sparkles size={13} /> Powered by Natural AI Scoring
        </span>
      </div>

      {/* Input Criteria Form */}
      <form onSubmit={handleRunAiRecommendation} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Location */}
        <div className="search-field">
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Location (City)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <MapPin size={16} color="var(--accent-gold)" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
            >
              {ZIMBABWE_CITIES.map(city => (
                <option key={city} value={city} style={{ background: 'var(--bg-secondary)' }}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Type */}
        <div className="search-field">
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Event Type</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Tag size={16} color="var(--accent-gold)" />
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
            >
              {EVENT_TYPES.map(type => (
                <option key={type} value={type} style={{ background: 'var(--bg-secondary)' }}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Count */}
        <div className="search-field">
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Guests ({guestCount})</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Users size={16} color="var(--accent-gold)" />
            <input
              type="number"
              min="10"
              max="600"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
            />
          </div>
        </div>

        {/* Max Budget (US$) */}
        <div className="search-field">
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Max Budget (US${maxBudget})</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <DollarSign size={16} color="var(--accent-gold)" />
            <input
              type="number"
              min="100"
              max="1000"
              step="50"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
            />
          </div>
        </div>
      </form>

      {/* Infrastructure Facilities Filter Pills */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
          Select Required Infrastructure & Facilities:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {keyFacilitiesList.map(fac => {
            const isSelected = selectedFacilities.includes(fac);
            return (
              <button
                key={fac}
                type="button"
                className={`badge ${isSelected ? 'badge-gold' : 'badge-blue'}`}
                style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
                onClick={() => handleFacilityToggle(fac)}
              >
                {isSelected && <Check size={12} />} {fac}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="btn-primary"
        style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
        onClick={handleRunAiRecommendation}
        disabled={isSearching}
      >
        <Sparkles size={18} /> {isSearching ? 'Calculating AI Recommendation...' : 'Generate AI Recommendation Match'}
      </button>

      {/* AI Recommendation Result Card Output */}
      {aiMatchResult && (
        <div style={{
          marginTop: '2rem',
          background: 'var(--bg-secondary)',
          border: '2px solid var(--accent-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          animation: 'modalPop 0.3s ease-out'
        }}>
          {/* Top Match Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
              <Bot size={14} /> AI Recommendation Match: {aiMatchResult.matchPercentage}% Confidence
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Tailored for {eventType} in {location}
            </span>
          </div>

          {/* Rationale Explanation Callout */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#fcd34d',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            <strong style={{ display: 'block', color: 'var(--accent-gold)', marginBottom: '0.25rem' }}>
              🤖 Natural AI Recommendation Rationale:
            </strong>
            "{aiMatchResult.rationale}"
          </div>

          {/* Result Venue Card */}
          <VenueCard
            venue={aiMatchResult.venue}
            onSelectVenue={onSelectVenue}
            isFavorite={userFavorites.includes(aiMatchResult.venue.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      )}
    </div>
  );
}
