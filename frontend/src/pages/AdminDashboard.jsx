import React, { useState } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { Shield, Building2, Users, DollarSign, Check, ShieldAlert, Zap } from 'lucide-react';
import '../styles/dashboards.css';

export default function AdminDashboard({ venues, setVenues, bookings, showToast }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState('venues');

  const handleApproveVenue = (venueId) => {
    setVenues(prev => prev.map(v => v.id === venueId ? { ...v, status: 'approved' } : v));
    showToast('Venue listing verified and published', 'success');
  };

  const handleSuspendVenue = (venueId) => {
    setVenues(prev => prev.map(v => v.id === venueId ? { ...v, status: 'suspended' } : v));
    showToast('Venue listing suspended', 'info');
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User ${u.name} set to ${nextStatus}`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const platformRevenue = Math.round(
    bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) * 0.15
  );

  return (
    <div className="dashboard-page container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-wrap">
          <h1>Platform Administration</h1>
          <p>System metrics, venue verification, and user management for Venue-Connect Zimbabwe</p>
        </div>

        <span className="badge badge-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Shield size={14} /> System Administrator
        </span>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Users />
          </div>
          <div className="metric-info">
            <span className="metric-label">Platform Users</span>
            <span className="metric-value">{users.length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
            <Building2 />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Listed Venues</span>
            <span className="metric-value">{venues.filter(v => v.status === 'approved').length}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.12)' }}>
            <DollarSign />
          </div>
          <div className="metric-info">
            <span className="metric-label">Platform Earnings (15%)</span>
            <span className="metric-value">US${platformRevenue}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'venues' ? 'active' : ''}`}
          onClick={() => setActiveTab('venues')}
        >
          Venue Verification ({venues.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* Tab 1: Venue Moderation Table */}
      {activeTab === 'venues' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Venue & City</th>
                <th>Category</th>
                <th>Daily Rate (US$)</th>
                <th>Power & Water</th>
                <th>Status</th>
                <th>Verification Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => {
                const hasPower = v.amenities.includes('Solar Power Backup') || v.amenities.includes('Generator Backup');
                return (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={v.images[0]}
                          alt={v.title}
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{v.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.suburb ? `${v.suburb}, ` : ''}{v.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gold">{v.category}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-gold)' }}>US${v.pricePerDay}/day</strong>
                    </td>
                    <td>
                      {hasPower ? (
                        <span className="badge badge-success"><Zap size={11} /> Power Verified</span>
                      ) : (
                        <span className="badge badge-warning">Grid Only</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        v.status === 'approved' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {v.status !== 'approved' ? (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#10b981' }}
                            onClick={() => handleApproveVenue(v.id)}
                          >
                            <Check size={14} /> Approve
                          </button>
                        ) : (
                          <button
                            className="btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                            onClick={() => handleSuspendVenue(v.id)}
                          >
                            <ShieldAlert size={14} /> Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: User Accounts Table */}
      {activeTab === 'users' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email & Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="table-user-cell">
                      <div className="user-avatar" style={{ background: 'var(--accent-gold)', color: '#090d16' }}>
                        {u.name.charAt(0)}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>
                    <div>{u.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-gold">{u.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => handleToggleUserStatus(u.id)}
                    >
                      {u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
