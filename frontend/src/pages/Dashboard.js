import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: 'Sydney',
    keyword: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, filters]);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/user');
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        city: filters.city,
        limit: 100
      };

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;

      const response = await axios.get('/api/dashboard/events', { params });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (eventId) => {
    try {
      const notes = prompt('Add import notes (optional):');
      await axios.post(`/api/dashboard/events/${eventId}/import`, {
        importNotes: notes || undefined
      });
      fetchEvents();
      if (selectedEvent && selectedEvent._id === eventId) {
        fetchEventDetails(eventId);
      }
    } catch (error) {
      alert('Error importing event: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axios.get(`/api/dashboard/events/${eventId}`);
      setSelectedEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'badge-new',
      updated: 'badge-updated',
      inactive: 'badge-inactive',
      imported: 'badge-imported'
    };
    return classes[status] || '';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="user-info">
              {user?.picture && (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              )}
              <span>{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container">
          <div className="filters-panel">
            <h2>Filters</h2>
            <div className="filters-grid">
              <div className="filter-group">
                <label>City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="input"
                >
                  <option value="Sydney">Sydney</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Keyword Search</label>
                <input
                  type="text"
                  placeholder="Search title, venue, description..."
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="input"
                />
              </div>

              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="input"
                />
              </div>

              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="input"
                />
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="new">New</option>
                  <option value="updated">Updated</option>
                  <option value="inactive">Inactive</option>
                  <option value="imported">Imported</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-main">
            <div className="events-table-container">
              <h2>Events ({events.length})</h2>
              {loading ? (
                <div className="loading">Loading events...</div>
              ) : (
                <div className="table-wrapper">
                  <table className="events-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr
                          key={event._id}
                          className={selectedEvent?._id === event._id ? 'selected' : ''}
                          onClick={() => fetchEventDetails(event._id)}
                        >
                          <td className="title-cell">{event.title}</td>
                          <td>{format(new Date(event.date), 'MMM d, yyyy')}</td>
                          <td>{event.venueName || 'N/A'}</td>
                          <td>{event.sourceWebsite}</td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                              {event.status}
                            </span>
                          </td>
                          <td>
                            {event.status !== 'imported' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImport(event._id);
                                }}
                                className="btn btn-success btn-sm"
                              >
                                Import
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedEvent && (
              <div className="event-preview">
                <button
                  className="preview-close"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>
                <h3>{selectedEvent.title}</h3>
                <div className="preview-content">
                  <div className="preview-section">
                    <strong>Date & Time:</strong>
                    <p>
                      {format(new Date(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                      {selectedEvent.time && ` at ${selectedEvent.time}`}
                    </p>
                  </div>

                  {selectedEvent.venueName && (
                    <div className="preview-section">
                      <strong>Venue:</strong>
                      <p>{selectedEvent.venueName}</p>
                      {selectedEvent.venueAddress && (
                        <p className="address">{selectedEvent.venueAddress}</p>
                      )}
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="preview-section">
                      <strong>Description:</strong>
                      <p>{selectedEvent.description}</p>
                    </div>
                  )}

                  <div className="preview-section">
                    <strong>Source:</strong>
                    <p>
                      <a href={selectedEvent.originalUrl} target="_blank" rel="noopener noreferrer">
                        {selectedEvent.sourceWebsite}
                      </a>
                    </p>
                  </div>

                  <div className="preview-section">
                    <strong>Status:</strong>
                    <p>
                      <span className={`status-badge ${getStatusBadgeClass(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </p>
                  </div>

                  {selectedEvent.importedAt && (
                    <div className="preview-section">
                      <strong>Imported:</strong>
                      <p>{format(new Date(selectedEvent.importedAt), 'MMM d, yyyy HH:mm')}</p>
                      {selectedEvent.importedBy && (
                        <p>By: {selectedEvent.importedBy.name || selectedEvent.importedBy.email}</p>
                      )}
                    </div>
                  )}

                  {selectedEvent.importNotes && (
                    <div className="preview-section">
                      <strong>Import Notes:</strong>
                      <p>{selectedEvent.importNotes}</p>
                    </div>
                  )}

                  {selectedEvent.status !== 'imported' && (
                    <div className="preview-actions">
                      <button
                        onClick={() => handleImport(selectedEvent._id)}
                        className="btn btn-success"
                      >
                        Import to Platform
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
