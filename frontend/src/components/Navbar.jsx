import React from 'react';
import { Building2, User, Shield, Briefcase, LogIn } from 'lucide-react';
import '../styles/navbar.css';

export default function Navbar({ currentRole, setRole, currentPage, navigateTo }) {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="navbar-brand">
          <div className="brand-icon" style={{ background: 'var(--accent-gold-gradient)', color: '#090d16' }}>
            <Building2 size={22} />
          </div>
          <div>
            <span>Venue<span className="gold-text">Connect</span></span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
              Zimbabwe Market
            </span>
          </div>
        </a>

        {/* Links */}
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
            <li>
              <a
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentRole === 'customer') navigateTo('customer-dashboard');
                  else if (currentRole === 'owner') navigateTo('owner-dashboard');
                  else navigateTo('admin-dashboard');
                }}
                className={`nav-link ${currentPage.includes('dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </a>
            </li>
          </ul>
        </nav>

        {/* Role Switcher & Auth */}
        <div className="navbar-actions">
          {/* Quick Role Switcher for University Demonstration */}
          <div className="role-switcher" title="Switch User Role Demonstration">
            <button
              className={`role-btn ${currentRole === 'customer' ? 'active' : ''}`}
              style={{ background: currentRole === 'customer' ? 'var(--accent-gold)' : '', color: currentRole === 'customer' ? '#090d16' : '' }}
              onClick={() => {
                setRole('customer');
                if (currentPage.includes('dashboard')) navigateTo('customer-dashboard');
              }}
            >
              <User size={13} style={{ marginRight: '3px' }} /> Customer
            </button>
            <button
              className={`role-btn ${currentRole === 'owner' ? 'active' : ''}`}
              style={{ background: currentRole === 'owner' ? 'var(--accent-blue)' : '', color: currentRole === 'owner' ? '#fff' : '' }}
              onClick={() => {
                setRole('owner');
                if (currentPage.includes('dashboard')) navigateTo('owner-dashboard');
              }}
            >
              <Briefcase size={13} style={{ marginRight: '3px' }} /> Owner
            </button>
            <button
              className={`role-btn ${currentRole === 'admin' ? 'active' : ''}`}
              style={{ background: currentRole === 'admin' ? '#ef4444' : '', color: currentRole === 'admin' ? '#fff' : '' }}
              onClick={() => {
                setRole('admin');
                if (currentPage.includes('dashboard')) navigateTo('admin-dashboard');
              }}
            >
              <Shield size={13} style={{ marginRight: '3px' }} /> Admin
            </button>
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => navigateTo('login')}
          >
            <LogIn size={15} /> Login
          </button>

          <button
            className="btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => navigateTo('register')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
