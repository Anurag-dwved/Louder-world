import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './HomePage.css';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/events', {
        params: {
          city: 'Sydney',
          limit: 50
        }
      });
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetTickets = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <h1>Louder World</h1>
          <p className="subtitle">Discover Events in Sydney, Australia</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search events by name, venue, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading">Loading events...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchEvents} className="btn btn-primary" style={{ marginTop: '10px' }}>
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>No events found. Try adjusting your search or check back later.</p>
              {events.length === 0 && (
                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                  Tip: Run the scraper to populate events: <code>npm run scrape</code>
                </p>
              )}
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onGetTickets={handleGetTickets}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && selectedEvent && (
        <TicketModal
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;
