import React from 'react';
import SearchBar from '../components/SearchBar';
import VenueCard from '../components/VenueCard';
import AiVenueFinder from '../components/AiVenueFinder';
import { CATEGORIES, ZIMBABWE_CITIES } from '../data/mockData';
import { ShieldCheck, CalendarCheck, Sparkles, Award, ArrowRight, Heart, Zap, MapPin, Building2, Utensils, Presentation, Users, Sun, Bot } from 'lucide-react';

export default function Home({ venues, onSelectVenue, navigateTo, searchParams, setSearchParams, onSearchSubmit, userFavorites, onToggleFavorite }) {
  const featuredVenues = venues.filter(v => v.featured || v.rating >= 4.85).slice(0, 6);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Heart': return <Heart size={24} color="#f59e0b" />;
      case 'Presentation': return <Presentation size={24} color="#3b82f6" />;
      case 'Sun': return <Sun size={24} color="#10b981" />;
      case 'Building2': return <Building2 size={24} color="#a855f7" />;
      case 'Users': return <Users size={24} color="#ec4899" />;
      case 'Utensils': return <Utensils size={24} color="#f97316" />;
      default: return <Sparkles size={24} color="#f59e0b" />;
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #090d16 75%)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
              <Sparkles size={14} /> Designed for the Zimbabwean Market
            </span>
            <h1 style={{ fontSize: '3.25rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
              Find the Perfect Venue for Your Next <span className="gold-text">Event in Zimbabwe</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Discover and reserve top wedding gardens, conference centres, church halls, and lodges with solar backup power and verified US$ pricing across Zimbabwe.
            </p>

            {/* Quick City Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.5rem' }}>Popular Cities:</span>
              {ZIMBABWE_CITIES.map(city => (
                <button
                  key={city}
                  className="badge badge-blue"
                  style={{ cursor: 'pointer', padding: '0.35rem 0.85rem' }}
                  onClick={() => {
                    setSearchParams({ ...searchParams, location: city });
                    navigateTo('venues');
                  }}
                >
                  <MapPin size={12} /> {city}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <SearchBar
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearchSubmit={() => {
                onSearchSubmit();
                navigateTo('venues');
              }}
            />
          </div>
        </div>
      </section>

      {/* Interactive AI Smart Finder Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              <Bot size={13} /> AI Intelligence Matcher
            </span>
            <h2>AI Event Venue Finder</h2>
            <p>Enter your location, event type, guest count, and facilities to generate an AI recommendation with natural rationale</p>
          </div>

          <AiVenueFinder
            venues={venues}
            onSelectVenue={onSelectVenue}
            userFavorites={userFavorites}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Explore Venue Categories</h2>
            <p>From romantic garden receptions in Bulawayo to high-tech conference auditoriums in Harare</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem'
          }}>
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                onClick={() => {
                  setSearchParams({ ...searchParams, category: cat.id });
                  navigateTo('venues');
                }}
                className="glass-card"
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  border: '1px solid var(--border-color)'
                }}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                <Award size={13} /> Featured Venues
              </span>
              <h2 style={{ fontSize: '2.25rem' }}>Top Event Venues in Zimbabwe</h2>
            </div>
            <button
              className="btn-outline"
              onClick={() => navigateTo('venues')}
            >
              Browse All {venues.length} Venues <ArrowRight size={16} />
            </button>
          </div>

          <div className="venues-grid">
            {featuredVenues.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onSelectVenue={onSelectVenue}
                isFavorite={userFavorites.includes(venue.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Venue-Connect Zimbabwe */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Built for Zimbabwean Organizers</h2>
            <p>Providing essential infrastructure verification and transparent local pricing</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Solar & Generator Verified</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Filter venues featuring heavy-duty solar backup and generators to ensure uninterrupted power for your event.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Borehole Water & Facilities</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Know in advance if a venue provides dedicated borehole water supply, ample parking, and full kitchen access.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <CalendarCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transparent US$ Rates</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Clear daily and hourly US$ pricing with no hidden charges, helping you plan weddings, conferences, or church functions easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Banner */}
      <section style={{ padding: '4rem 0', background: 'radial-gradient(circle, #1e1b4b 0%, #090d16 90%)' }}>
        <div className="container">
          <div style={{
            background: 'rgba(24, 34, 54, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>For Zimbabwean Venue Owners</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Do You Own an Event Space in Zimbabwe?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                List your space on Venue-Connect to reach thousands of event planners, brides, corporate organizers, and community hosts across Bulawayo, Harare, Gweru, and Mutare.
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
              onClick={() => navigateTo('register')}
            >
              List Your Venue Today <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
