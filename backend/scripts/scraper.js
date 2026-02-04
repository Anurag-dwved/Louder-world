const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for scraping');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Scrape Eventbrite Sydney events
const scrapeEventbrite = async () => {
  try {
    console.log('Scraping Eventbrite...');
    // Eventbrite API or scraping logic
    // For demo purposes, we'll use a mock approach
    // In production, you'd use Eventbrite API or scrape their website
    
    const now = new Date();
    const events = [
      {
        title: 'Sydney Music Festival 2024',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        time: '6:00 PM',
        venueName: 'Sydney Opera House',
        venueAddress: 'Bennelong Point, Sydney NSW 2000',
        city: 'Sydney',
        description: 'A spectacular music festival featuring top artists from around the world. Join us for an unforgettable evening of live performances.',
        summary: 'Music festival at Sydney Opera House',
        category: ['Music', 'Festival'],
        sourceWebsite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-music-festival-2024',
        imageUrl: 'https://via.placeholder.com/400x300?text=Music+Festival'
      },
      {
        title: 'Sydney Food & Wine Expo',
        date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        time: '11:00 AM',
        venueName: 'Royal Hall of Industries',
        venueAddress: '1 Driver Ave, Moore Park NSW 2021',
        city: 'Sydney',
        description: 'Discover the finest food and wine from local producers and international vendors. Tastings, cooking demonstrations, and more.',
        summary: 'Food and wine expo',
        category: ['Food & Drink', 'Expo'],
        sourceWebsite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/sydney-food-wine-expo',
        imageUrl: 'https://via.placeholder.com/400x300?text=Food+Wine+Expo'
      },
      {
        title: 'Tech Innovation Summit Sydney',
        date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        time: '9:00 AM',
        venueName: 'International Convention Centre',
        venueAddress: '14 Darling Dr, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Join industry leaders and innovators for a day of talks, workshops, and networking in the tech space.',
        summary: 'Technology conference',
        category: ['Technology', 'Conference'],
        sourceWebsite: 'Eventbrite',
        originalUrl: 'https://www.eventbrite.com.au/e/tech-innovation-summit-sydney',
        imageUrl: 'https://via.placeholder.com/400x300?text=Tech+Summit'
      }
    ];

    for (const eventData of events) {
      await processEvent(eventData, 'Eventbrite');
    }
  } catch (error) {
    console.error('Error scraping Eventbrite:', error);
  }
};

// Scrape Facebook Events Sydney
const scrapeFacebookEvents = async () => {
  try {
    console.log('Scraping Facebook Events...');
    // Facebook Events scraping logic
    // Note: Facebook has strict scraping policies, use their API if possible
    
    const now = new Date();
    const events = [
      {
        title: 'Sydney Food & Wine Festival',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        time: '12:00 PM',
        venueName: 'Hyde Park',
        venueAddress: 'Hyde Park, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Join us for a day of food, wine, and entertainment in the heart of Sydney. Featuring local vendors, live music, and family activities.',
        summary: 'Food and wine festival',
        category: ['Food & Drink', 'Festival'],
        sourceWebsite: 'Facebook Events',
        originalUrl: 'https://www.facebook.com/events/sydney-food-wine-festival',
        imageUrl: 'https://via.placeholder.com/400x300?text=Food+Wine+Festival'
      },
      {
        title: 'Yoga in the Park - Sydney',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        time: '7:00 AM',
        venueName: 'Centennial Park',
        venueAddress: '1 Grand Drive, Centennial Park NSW 2021',
        city: 'Sydney',
        description: 'Start your weekend with a free yoga session in the beautiful Centennial Park. All levels welcome.',
        summary: 'Outdoor yoga session',
        category: ['Health & Wellness', 'Yoga'],
        sourceWebsite: 'Facebook Events',
        originalUrl: 'https://www.facebook.com/events/yoga-centennial-park',
        imageUrl: 'https://via.placeholder.com/400x300?text=Yoga+Park'
      }
    ];

    for (const eventData of events) {
      await processEvent(eventData, 'Facebook Events');
    }
  } catch (error) {
    console.error('Error scraping Facebook Events:', error);
  }
};

// Scrape Eventfinda Sydney
const scrapeEventfinda = async () => {
  try {
    console.log('Scraping Eventfinda...');
    const url = 'https://www.eventfinda.com.au/whatson/sydney';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // Parse Eventfinda HTML structure
    $('.event-item').each((i, elem) => {
      try {
        const title = $(elem).find('.event-title').text().trim();
        const dateStr = $(elem).find('.event-date').text().trim();
        const venue = $(elem).find('.event-venue').text().trim();
        const link = $(elem).find('a').attr('href');
        const image = $(elem).find('img').attr('src');
        const description = $(elem).find('.event-description').text().trim();

        if (title && dateStr) {
          events.push({
            title,
            date: parseDate(dateStr),
            time: extractTime(dateStr),
            venueName: venue,
            city: 'Sydney',
            description,
            summary: description.substring(0, 200),
            sourceWebsite: 'Eventfinda',
            originalUrl: link ? `https://www.eventfinda.com.au${link}` : '',
            imageUrl: image || 'https://via.placeholder.com/400x300?text=Event'
          });
        }
      } catch (err) {
        console.error('Error parsing event item:', err);
      }
    });

    for (const eventData of events) {
      await processEvent(eventData, 'Eventfinda');
    }
  } catch (error) {
    console.error('Error scraping Eventfinda:', error);
    // Fallback to mock data if scraping fails
    const now = new Date();
    const mockEvents = [
      {
        title: 'Sydney Comedy Night',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        time: '8:00 PM',
        venueName: 'Comedy Store Sydney',
        venueAddress: '123 Entertainment Quarter, Sydney NSW 2000',
        city: 'Sydney',
        description: 'An evening of laughter with top comedians from Australia and around the world. Stand-up comedy at its finest.',
        summary: 'Comedy show',
        category: ['Comedy', 'Entertainment'],
        sourceWebsite: 'Eventfinda',
        originalUrl: 'https://www.eventfinda.com.au/event/sydney-comedy-night',
        imageUrl: 'https://via.placeholder.com/400x300?text=Comedy+Night'
      },
      {
        title: 'Sydney Art Gallery Opening',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        time: '6:00 PM',
        venueName: 'Art Gallery of NSW',
        venueAddress: 'Art Gallery Rd, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Opening night of the new contemporary art exhibition featuring works from emerging Australian artists.',
        summary: 'Art gallery opening',
        category: ['Arts', 'Exhibition'],
        sourceWebsite: 'Eventfinda',
        originalUrl: 'https://www.eventfinda.com.au/event/art-gallery-opening',
        imageUrl: 'https://via.placeholder.com/400x300?text=Art+Gallery'
      },
      {
        title: 'Sydney Marathon 2024',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        time: '6:00 AM',
        venueName: 'Sydney Harbour Bridge',
        venueAddress: 'Sydney Harbour Bridge, Sydney NSW 2000',
        city: 'Sydney',
        description: 'Join thousands of runners for the annual Sydney Marathon. Full marathon, half marathon, and 10K options available.',
        summary: 'Marathon race',
        category: ['Sports', 'Running'],
        sourceWebsite: 'Eventfinda',
        originalUrl: 'https://www.eventfinda.com.au/event/sydney-marathon-2024',
        imageUrl: 'https://via.placeholder.com/400x300?text=Marathon'
      }
    ];

    for (const eventData of mockEvents) {
      await processEvent(eventData, 'Eventfinda');
    }
  }
};

// Process and save/update event
const processEvent = async (eventData, source) => {
  try {
    const existingEvent = await Event.findOne({ originalUrl: eventData.originalUrl });

    if (existingEvent) {
      // Check if event details have changed
      const hasChanged = 
        existingEvent.title !== eventData.title ||
        existingEvent.date.getTime() !== eventData.date.getTime() ||
        existingEvent.venueName !== eventData.venueName ||
        existingEvent.description !== eventData.description;

      if (hasChanged && existingEvent.status !== 'imported') {
        existingEvent.title = eventData.title;
        existingEvent.date = eventData.date;
        existingEvent.time = eventData.time;
        existingEvent.venueName = eventData.venueName;
        existingEvent.venueAddress = eventData.venueAddress;
        existingEvent.description = eventData.description;
        existingEvent.summary = eventData.summary;
        existingEvent.category = eventData.category || [];
        existingEvent.imageUrl = eventData.imageUrl;
        existingEvent.status = 'updated';
        existingEvent.lastScrapedAt = new Date();
        await existingEvent.save();
        console.log(`Updated event: ${eventData.title}`);
      } else {
        existingEvent.lastScrapedAt = new Date();
        await existingEvent.save();
      }
    } else {
      // New event
      const newEvent = new Event({
        ...eventData,
        status: 'new',
        lastScrapedAt: new Date()
      });
      await newEvent.save();
      console.log(`Added new event: ${eventData.title}`);
    }
  } catch (error) {
    console.error(`Error processing event ${eventData.title}:`, error);
  }
};

// Mark inactive events
const markInactiveEvents = async () => {
  try {
    console.log('Marking inactive events...');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + 7); // Events older than 7 days past

    // Mark past events as inactive
    const result = await Event.updateMany(
      {
        date: { $lt: new Date() },
        status: { $ne: 'imported' },
        isActive: true
      },
      {
        $set: {
          status: 'inactive',
          isActive: false
        }
      }
    );

    console.log(`Marked ${result.modifiedCount} events as inactive`);

    // Mark events not scraped in last 30 days as potentially inactive
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleResult = await Event.updateMany(
      {
        lastScrapedAt: { $lt: thirtyDaysAgo },
        status: { $nin: ['imported', 'inactive'] },
        isActive: true
      },
      {
        $set: {
          status: 'inactive',
          isActive: false
        }
      }
    );

    console.log(`Marked ${staleResult.modifiedCount} stale events as inactive`);
  } catch (error) {
    console.error('Error marking inactive events:', error);
  }
};

// Helper functions
const parseDate = (dateStr) => {
  // Simple date parser - in production, use a proper date parsing library
  const now = new Date();
  const daysToAdd = Math.floor(Math.random() * 30) + 1; // Random date within next 30 days
  return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
};

const extractTime = (dateStr) => {
  const timeMatch = dateStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3]}`;
  }
  return 'TBA';
};

// Main scraping function
const runScraper = async () => {
  await connectDB();
  
  console.log('Starting event scraping...');
  
  await scrapeEventbrite();
  await scrapeFacebookEvents();
  await scrapeEventfinda();
  await markInactiveEvents();
  
  console.log('Scraping completed!');
  await mongoose.connection.close();
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  runScraper();
}

module.exports = { runScraper };
