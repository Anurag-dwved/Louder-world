import React from 'react';
import { format } from 'date-fns';
import './EventCard.css';

const EventCard = ({ event, onGetTickets }) => {
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'EEE, MMM d, yyyy');
    } catch {
      return 'Date TBA';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      new: 'status-new',
      updated: 'status-updated',
      inactive: 'status-inactive',
      imported: 'status-imported'
    };
    return statusClasses[status] || '';
  };

  return (
    <div className="event-card">
      {event.imageUrl && (
        <div className="event-image">
          <img src={event.imageUrl} alt={event.title} />
        </div>
      )}
      <div className="event-content">
        <div className="event-header">
          <h3 className="event-title">{event.title}</h3>
          {event.status && (
            <span className={`status-badge ${getStatusBadge(event.status)}`}>
              {event.status}
            </span>
          )}
        </div>
        
        <div className="event-details">
          <div className="event-detail-item">
            <span className="detail-icon">📅</span>
            <span>{formatDate(event.date)} {event.time && `• ${event.time}`}</span>
          </div>
          
          {event.venueName && (
            <div className="event-detail-item">
              <span className="detail-icon">📍</span>
              <span>{event.venueName}</span>
            </div>
          )}
          
          {event.venueAddress && (
            <div className="event-detail-item">
              <span className="detail-icon">🏢</span>
              <span className="venue-address">{event.venueAddress}</span>
            </div>
          )}
          
          {event.description && (
            <p className="event-description">
              {event.description.length > 150
                ? `${event.description.substring(0, 150)}...`
                : event.description}
            </p>
          )}
          
          {event.sourceWebsite && (
            <div className="event-source">
              Source: <span>{event.sourceWebsite}</span>
            </div>
          )}
        </div>
        
        <button
          className="btn-get-tickets"
          onClick={() => onGetTickets(event)}
        >
          GET TICKETS
        </button>
      </div>
    </div>
  );
};

export default EventCard;
