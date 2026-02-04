const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events with filters
router.get('/', async (req, res) => {
  try {
    const {
      city = 'Sydney',
      keyword,
      startDate,
      endDate,
      status,
      limit = 50,
      skip = 0
    } = req.query;

    const query = {
      city,
      isActive: true,
      date: { $gte: new Date() } // Only future events
    };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { venueName: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (startDate) {
      query.date.$gte = new Date(startDate);
    }

    if (endDate) {
      query.date = { ...query.date, $lte: new Date(endDate) };
    }

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit ticket request
router.post('/ticket-request', async (req, res) => {
  try {
    const { eventId, email, consent } = req.body;

    if (!eventId || !email || consent === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.ticketRequests.push({
      email,
      consent
    });

    await event.save();

    // Redirect to original event URL
    res.json({
      success: true,
      redirectUrl: event.originalUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
