// Initialize scraper with sample data
// Run this once to populate the database with initial events
const { runScraper } = require('./scraper');

console.log('Initializing scraper with sample events...');
runScraper();
