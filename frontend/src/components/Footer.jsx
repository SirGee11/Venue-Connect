import React from 'react';
import { Building2, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';
import '../styles/footer.css';

export default function Footer({ navigateTo }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="brand-icon" style={{ background: 'var(--accent-gold-gradient)', color: '#090d16' }}>
                <Building2 size={22} />
              </div>
              <span>Venue<span className="gold-text">Connect</span></span>
            </div>
            <p className="footer-desc">
              Zimbabwe's trusted venue booking platform connecting event organizers, couples, and businesses with ideal spaces across Bulawayo, Harare, Gweru, Mutare, and Victoria Falls.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Browse All Venues</a></li>
              <li><a href="#login" onClick={(e) => { e.preventDefault(); navigateTo('login'); }}>Member Login</a></li>
              <li><a href="#register" onClick={(e) => { e.preventDefault(); navigateTo('register'); }}>List Your Venue</a></li>
            </ul>
          </div>

          {/* Popular Zimbabwean Cities */}
          <div className="footer-col">
            <h4>Popular Locations</h4>
            <ul className="footer-links">
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Venues in Harare</a></li>
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Venues in Bulawayo</a></li>
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Venues in Gweru</a></li>
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Venues in Mutare</a></li>
              <li><a href="#venues" onClick={(e) => { e.preventDefault(); navigateTo('venues'); }}>Venues in Victoria Falls</a></li>
            </ul>
          </div>

          {/* Local Contact Info */}
          <div className="footer-col">
            <h4>Contact Details</h4>
            <ul className="footer-links">
              <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--accent-gold)" /> Harare & Bulawayo, Zimbabwe
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Phone size={16} color="var(--accent-gold)" /> {CONTACT_INFO.phone1}
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Mail size={16} color="var(--accent-gold)" /> {CONTACT_INFO.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Venue-Connect Zimbabwe. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Tailored for the Zimbabwean Event Industry <Heart size={14} color="#f59e0b" fill="#f59e0b" />
          </p>
        </div>
      </div>
    </footer>
  );
}
