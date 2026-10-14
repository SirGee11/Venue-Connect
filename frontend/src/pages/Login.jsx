import React, { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, Sparkles, User, Briefcase, Shield } from 'lucide-react';
import { api } from '../services/api';
import '../styles/auth.css';

export default function Login({ navigateTo, setRole, setCurrentUser, showToast }) {
  const [email, setEmail] = useState('tendai@connect.co.zw');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);

  const fillDemoAccount = (role) => {
    setSelectedRole(role);
    if (role === 'customer') {
      setEmail('tendai@connect.co.zw');
      setPassword('password123');
    } else if (role === 'owner') {
      setEmail('farai@venueowner.co.zw');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@venueconnect.co.zw');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      const activeUser = res.user;
      const activeRole = activeUser?.role || selectedRole;

      if (setCurrentUser) setCurrentUser(activeUser);
      if (setRole) setRole(activeRole);

      showToast(`Welcome back, ${activeUser?.name || activeUser?.username || 'User'}! Logged in as ${activeRole.toUpperCase()}`, 'success');

      if (activeRole === 'owner') navigateTo('owner-dashboard', activeUser);
      else if (activeRole === 'admin') navigateTo('admin-dashboard', activeUser);
      else navigateTo('customer-dashboard', activeUser);
    } catch (err) {
      console.error('Login failed:', err);
      showToast(err.message || 'Login failed. Check your email and password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Member Login</h2>
          <p>Access your venue bookings and Zimbabwean venue management portal</p>
        </div>

        {/* Quick Role Fill Helper */}
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>

          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            <button
              type="button"
              className={`badge ${selectedRole === 'customer' ? 'badge-gold' : 'badge-blue'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.2rem', justifyContent: 'center' }}
              onClick={() => fillDemoAccount('customer')}
            >
              <User size={12} /> Customer
            </button>
            <button
              type="button"
              className={`badge ${selectedRole === 'owner' ? 'badge-gold' : 'badge-blue'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.2rem', justifyContent: 'center' }}
              onClick={() => fillDemoAccount('owner')}
            >
              <Briefcase size={12} /> Owner
            </button>
            <button
              type="button"
              className={`badge ${selectedRole === 'admin' ? 'badge-gold' : 'badge-blue'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.2rem', justifyContent: 'center' }}
              onClick={() => fillDemoAccount('admin')}
            >
              <Shield size={12} /> Admin
            </button>
          </div>
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

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className="spin" /> : <LogIn size={18} />} Sign In as {selectedRole.toUpperCase()}
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
