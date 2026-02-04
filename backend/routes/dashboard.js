const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Event = require('../models/Event');

// Apply auth middleware to all routes
router.use(requireAuth);

// Get events for dashboard with filters
router.get('/events', async (req, res) => {
  try {
    const {
      city = 'Sydney',
      keyword,
      startDate,
      endDate,
      status,
      limit = 100,
      skip = 0
    } = req.query;

    const query = { city };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { venueName: { $regex: keyword, $options: 'i' } },
        { venueAddress: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('importedBy', 'name email');

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

// Get single event for preview
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('importedBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import event to platform
router.post('/events/:id/import', async (req, res) => {
  try {
    const { importNotes } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.status = 'imported';
    event.importedAt = new Date();
    event.importedBy = req.user._id;
    if (importNotes) {
      event.importNotes = importNotes;
    }

    await event.save();

    res.json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
