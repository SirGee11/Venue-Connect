import React, { useState } from 'react';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import '../styles/auth.css';

export default function Register({ navigateTo, setRole, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+263 77 123 4567');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(selectedRole);
    showToast(`Account created successfully! Logged in as ${selectedRole.toUpperCase()}`, 'success');

    if (selectedRole === 'customer') navigateTo('customer-dashboard');
    else if (selectedRole === 'owner') navigateTo('owner-dashboard');
    else navigateTo('admin-dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join Venue-Connect to book or list event spaces across Zimbabwe</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="role-tab-selector">
          <button
            type="button"
            className={`role-tab ${selectedRole === 'customer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            I want to Book Venues
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === 'owner' ? 'active' : ''}`}
            onClick={() => setSelectedRole('owner')}
          >
            I am a Venue Owner
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-icon-wrap">
              <User size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tendai Moyo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="name@connect.co.zw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Zimbabwe Phone (+263)</label>
            <div className="input-icon-wrap">
              <Phone size={18} />
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            <UserPlus size={18} /> Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); navigateTo('login'); }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
