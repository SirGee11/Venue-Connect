import React from 'react';
import { Building2, User, Shield, Briefcase, LogIn, LogOut } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({ currentUser, onLogout, currentPage, navigateTo }) {
  const getDashboardLabel = () => {
    if (!currentUser) return 'Dashboard';
    if (currentUser.role === 'owner') return 'Owner Portal';
    if (currentUser.role === 'admin') return 'Admin Portal';
    return 'My Bookings';
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    if (currentUser.role === 'owner') {
      navigateTo('owner-dashboard');
    } else if (currentUser.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('customer-dashboard');
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="navbar-brand">
          <div className="brand-icon" style={{ 
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
            background: '#090d16'
          }}>
            <img src="/infinity-logo.jpg" alt="VenueConnect Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span>Venue<span className="gold-text">Connect</span></span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
              Zimbabwe Event Marketplace
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav>
          <ul className="navbar-links">
            <li>
              <a
                href="#home"
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#venues"
                onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}
                className={`nav-link ${currentPage === 'venues' ? 'active' : ''}`}
              >
                Browse Venues
              </a>
            </li>
            {currentUser && (
              <li>
                <a
                  href="#dashboard"
                  onClick={handleDashboardClick}
                  className={`nav-link ${currentPage.includes('dashboard') ? 'active' : ''}`}
                >
                  {getDashboardLabel()}
                </a>
              </li>
            )}
          </ul>
        </nav>

        {/* User Account / Auth Actions */}
        <div className="navbar-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Authenticated Role Badge */}
              <div
                className="user-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: currentUser.role === 'admin'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : currentUser.role === 'owner'
                    ? 'rgba(59, 130, 246, 0.15)'
                    : 'rgba(245, 158, 11, 0.15)',
                  border: currentUser.role === 'admin'
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : currentUser.role === 'owner'
                    ? '1px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid rgba(245, 158, 11, 0.4)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: currentUser.role === 'admin'
                    ? '#ef4444'
                    : currentUser.role === 'owner'
                    ? '#60a5fa'
                    : 'var(--accent-gold)'
                }}
              >
                {currentUser.role === 'admin' && <Shield size={14} />}
                {currentUser.role === 'owner' && <Briefcase size={14} />}
                {currentUser.role === 'customer' && <User size={14} />}
                <span>{currentUser.name || currentUser.username || 'User'}</span>
                <span style={{ opacity: 0.7, textTransform: 'uppercase', fontSize: '0.68rem', marginLeft: '2px' }}>
                  ({currentUser.role})
                </span>
              </div>

              <button
                className="btn-secondary"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#f87171'
                }}
                onClick={onLogout}
                title="Log out of account"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => navigateTo('login')}
              >
                <LogIn size={15} style={{ marginRight: '4px' }} /> Login
              </button>

              <button
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => navigateTo('register')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
