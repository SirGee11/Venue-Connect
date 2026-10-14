import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import Toast from './components/Toast';

import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

import { INITIAL_VENUES, INITIAL_BOOKINGS } from './data/mockData';
import { api } from './services/api';

import './styles/global.css';

export default function App() {
  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [userFavorites, setUserFavorites] = useState(['v1', 'v3']);
  const [currentRole, setRole] = useState('customer');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVenueId, setSelectedVenueId] = useState('v1');
  const [currentUser, setCurrentUser] = useState(null);

  // Search parameters state across home and venues page
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    category: ''
  });

  // Modal & Toast states
  const [activeBookingModal, setActiveBookingModal] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  };

  // Synchronize with DRF Backend on mount and auth state change
  const fetchBackendData = async () => {
    try {
      const [venuesData, bookingsData] = await Promise.all([
        api.venues.getAll(),
        api.bookings.getAll()
      ]);
      if (Array.isArray(venuesData) && venuesData.length > 0) {
        setVenues(venuesData);
        if (!selectedVenueId || selectedVenueId === 'v1') {
          setSelectedVenueId(venuesData[0].id);
        }
      }
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
      }
    } catch (err) {
      console.warn('Backend currently using fallback state:', err);
    }
  };

  useEffect(() => {
    fetchBackendData();

    // Check logged in user
    const savedUser = api.auth.getCurrentUser();
    if (savedUser) {
      // Confirm the saved token is still valid; request() clears it on 401
      api.auth.getMe()
        .then(() => {
          setCurrentUser(savedUser);
          if (savedUser.role) setRole(savedUser.role);
        })
        .catch(() => {
          setCurrentUser(null);
        });
    }
  }, []);

  // When currentUser changes (e.g. login/logout), refresh user-scoped bookings
  useEffect(() => {
    if (currentUser) {
      fetchBackendData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setRole('customer');
    setCurrentPage('home');
    setBookings([]);
    showToast('You have been logged out.', 'info');
  };

  const navigateTo = (page, userOverride) => {
    // Login/Register pass the new user directly, because React state
    // (currentUser) has not updated yet at that moment.
    const user = userOverride ?? currentUser;

    // Role-based Access Control Gates
    if (page === 'customer-dashboard') {
      if (!user) {
        showToast('Please sign in to access your customer bookings', 'info');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (page === 'owner-dashboard') {
      if (!user) {
        showToast('Please sign in with a Venue Owner account to access the Owner Portal', 'error');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'owner' && user.role !== 'admin') {
        showToast('Access Denied: Only registered Venue Owners can access the Owner Portal', 'error');
        setCurrentPage('customer-dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (page === 'admin-dashboard') {
      if (!user) {
        showToast('Administrator login required', 'error');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (user.role !== 'admin') {
        showToast('Access Denied: Administrator privileges required', 'error');
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVenue = (venueId) => {
    setSelectedVenueId(venueId);
    navigateTo('venue-details');
  };

  const handleToggleFavorite = (venueId) => {
    setUserFavorites(prev => {
      const exists = prev.includes(venueId);
      const updated = exists ? prev.filter(id => id !== venueId) : [...prev, venueId];
      showToast(exists ? 'Removed from favorites' : 'Added to favorites', 'success');
      return updated;
    });
  };

  const handleInitiateBooking = (details) => {
    if (!currentUser) {
      showToast('Please sign in to make a booking', 'info');
      navigateTo('login');
      return;
    }
    setActiveBookingModal(details);
  };

  const handleConfirmBooking = async (confirmedData) => {
    try {
      const payload = {
        venueId: confirmedData.venue.id,
        customerName: confirmedData.customerName,
        customerEmail: confirmedData.customerEmail,
        customerPhone: confirmedData.customerPhone,
        eventDate: confirmedData.eventDate,
        startTime: confirmedData.startTime,
        endTime: confirmedData.endTime,
        guestCount: confirmedData.guestCount,
        eventType: confirmedData.eventType,
        grandTotal: confirmedData.grandTotal,
        specialRequests: confirmedData.specialRequests,
        customerId: currentUser ? currentUser.id : undefined,
        venueOwnerId: confirmedData.venue.ownerId || (confirmedData.venue.owner ? `u${confirmedData.venue.owner}` : undefined),
        venueOwnerEmail: confirmedData.venue.ownerEmail
      };

      const backendBooking = await api.bookings.create(payload);
      setBookings(prev => [backendBooking, ...prev]);
      setActiveBookingModal(null);
      showToast('Booking request submitted!', 'success');
      navigateTo('customer-dashboard');
    } catch (err) {
      console.error('Failed to create booking:', err);
      showToast(err.message || 'Booking failed. Please try again.', 'error');
    }
  };

  return (
    <div className="app-root">
      {/* Top Header Navigation */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage={currentPage}
        navigateTo={navigateTo}
      />

      {/* Main Dynamic View */}
      <main className="main-content">
        {currentPage === 'home' && (
          <Home
            venues={venues}
            onSelectVenue={handleSelectVenue}
            navigateTo={navigateTo}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearchSubmit={() => navigateTo('venues')}
            userFavorites={userFavorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'venues' && (
          <Venues
            venues={venues}
            onSelectVenue={handleSelectVenue}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            userFavorites={userFavorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'venue-details' && (
          <VenueDetails
            venueId={selectedVenueId}
            venues={venues}
            onSelectVenue={handleSelectVenue}
            onInitiateBooking={handleInitiateBooking}
            isFavorite={userFavorites.includes(selectedVenueId)}
            onToggleFavorite={handleToggleFavorite}
            userFavorites={userFavorites}
          />
        )}

        {currentPage === 'login' && (
          <Login
            navigateTo={navigateTo}
            setRole={setRole}
            setCurrentUser={setCurrentUser}
            showToast={showToast}
          />
        )}

        {currentPage === 'register' && (
          <Register
            navigateTo={navigateTo}
            setRole={setRole}
            setCurrentUser={setCurrentUser}
            showToast={showToast}
          />
        )}

        {currentPage === 'customer-dashboard' && (
          currentUser ? (
            <CustomerDashboard
              bookings={bookings}
              setBookings={setBookings}
              venues={venues}
              userFavorites={userFavorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectVenue={handleSelectVenue}
              navigateTo={navigateTo}
              showToast={showToast}
              currentUser={currentUser}
            />
          ) : (
            <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
              <div style={{ maxWidth: '480px', margin: '0 auto', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Account Login Required</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Please sign in to view your Zimbabwean venue reservations and customer bookings.
                </p>
                <button className="btn-primary" onClick={() => navigateTo('login')}>
                  Sign In to Account
                </button>
              </div>
            </div>
          )
        )}

        {currentPage === 'owner-dashboard' && (
          currentUser && (currentUser.role === 'owner' || currentUser.role === 'admin') ? (
            <OwnerDashboard
              venues={venues}
              setVenues={setVenues}
              bookings={bookings}
              setBookings={setBookings}
              showToast={showToast}
              currentUser={currentUser}
            />
          ) : (
            <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
              <div style={{ maxWidth: '520px', margin: '0 auto', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Venue Owner Access Restricted</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Only registered Venue Owners have authorization to list venues and manage reservations.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={() => navigateTo('login')}>
                    Sign In as Owner
                  </button>
                  <button className="btn-secondary" onClick={() => navigateTo('home')}>
                    Return Home
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {currentPage === 'admin-dashboard' && (
          currentUser && currentUser.role === 'admin' ? (
            <AdminDashboard
              venues={venues}
              setVenues={setVenues}
              bookings={bookings}
              showToast={showToast}
              currentUser={currentUser}
            />
          ) : (
            <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
              <div style={{ maxWidth: '520px', margin: '0 auto', background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Administrator Portal Restricted</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Administrator credentials are required to view the system administration console.
                </p>
                <button className="btn-primary" onClick={() => navigateTo('login')}>
                  Sign In as Admin
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Booking Confirmation Modal */}
      {activeBookingModal && (
        <BookingModal
          bookingDetails={activeBookingModal}
          currentUser={currentUser}
          onClose={() => setActiveBookingModal(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Global Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Footer */}
      <Footer navigateTo={navigateTo} />
    </div>
  );
}
