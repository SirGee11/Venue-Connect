import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import '../styles/auth.css';

export default function Login({ navigateTo, setRole, showToast }) {
  const [email, setEmail] = useState('tendai.moyo@connect.co.zw');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(selectedRole);
    showToast(`Welcome back! Logged in as ${selectedRole.toUpperCase()}`, 'success');

    if (selectedRole === 'customer') navigateTo('customer-dashboard');
    else if (selectedRole === 'owner') navigateTo('owner-dashboard');
    else navigateTo('admin-dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Member Login</h2>
          <p>Access your venue bookings and Zimbabwean venue management portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="role-tab-selector">
          <button
            type="button"
            className={`role-tab ${selectedRole === 'customer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === 'owner' ? 'active' : ''}`}
            onClick={() => setSelectedRole('owner')}
          >
            Venue Owner
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            Admin
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={18} />
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="#register" onClick={(e) => { e.preventDefault(); navigateTo('register'); }}>
            Create an Account
          </a>
        </div>
      </div>
    </div>
  );
}
