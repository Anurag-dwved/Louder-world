const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: String,
  venueName: String,
  venueAddress: String,
  city: {
    type: String,
    default: 'Sydney',
    index: true
  },
  description: String,
  summary: String,
  category: [String],
  tags: [String],
  imageUrl: String,
  posterUrl: String,
  sourceWebsite: {
    type: String,
    required: true,
    index: true
  },
  originalUrl: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  lastScrapedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'updated', 'inactive', 'imported'],
    default: 'new',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  importedAt: Date,
  importedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  importNotes: String,
  ticketRequests: [{
    email: String,
    consent: Boolean,
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
eventSchema.index({ city: 1, isActive: 1, date: 1 });
eventSchema.index({ status: 1, city: 1 });
eventSchema.index({ lastScrapedAt: 1 });

module.exports = mongoose.model('Event', eventSchema);
