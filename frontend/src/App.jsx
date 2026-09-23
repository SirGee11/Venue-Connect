import React, { useState } from 'react';
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

import './styles/global.css';

export default function App() {
  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [userFavorites, setUserFavorites] = useState(['v1', 'v3']);
  const [currentRole, setRole] = useState('customer');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVenueId, setSelectedVenueId] = useState('v1');

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

  const navigateTo = (page) => {
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
    setActiveBookingModal(details);
  };

  const handleConfirmBooking = (confirmedData) => {
    const newBooking = {
      id: `b${Date.now()}`,
      venueId: confirmedData.venue.id,
      venueTitle: confirmedData.venue.title,
      venueImage: confirmedData.venue.images[0],
      location: confirmedData.venue.location,
      customerId: 'u1',
      customerName: confirmedData.customerName,
      customerEmail: confirmedData.customerEmail,
      eventDate: confirmedData.eventDate,
      startTime: confirmedData.startTime,
      endTime: confirmedData.endTime,
      guestCount: confirmedData.guestCount,
      eventType: confirmedData.eventType,
      totalPrice: confirmedData.grandTotal,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingModal(null);
    showToast('Booking request submitted! View details in your customer portal.', 'success');
    navigateTo('customer-dashboard');
  };

  return (
    <div className="app-root">
      {/* Top Header Navigation */}
      <Navbar
        currentRole={currentRole}
        setRole={setRole}
        currentPage={currentPage}
        navigateTo={navigateTo}
        userFavorites={userFavorites}
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
            showToast={showToast}
          />
        )}

        {currentPage === 'register' && (
          <Register
            navigateTo={navigateTo}
            setRole={setRole}
            showToast={showToast}
          />
        )}

        {currentPage === 'customer-dashboard' && (
          <CustomerDashboard
            bookings={bookings}
            setBookings={setBookings}
            venues={venues}
            userFavorites={userFavorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectVenue={handleSelectVenue}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        )}

        {currentPage === 'owner-dashboard' && (
          <OwnerDashboard
            venues={venues}
            setVenues={setVenues}
            bookings={bookings}
            setBookings={setBookings}
            showToast={showToast}
          />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboard
            venues={venues}
            setVenues={setVenues}
            bookings={bookings}
            showToast={showToast}
          />
        )}
      </main>

      {/* Booking Confirmation Modal */}
      {activeBookingModal && (
        <BookingModal
          bookingDetails={activeBookingModal}
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
