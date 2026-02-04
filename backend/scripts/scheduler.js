const cron = require('node-cron');
const { runScraper } = require('./scraper');

// Run scraper every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled scraper...');
  runScraper();
});

// Also run on startup
console.log('Scheduler started. Scraper will run every 6 hours.');
runScraper();

// Keep the process running
process.on('SIGINT', () => {
  console.log('Scheduler stopped');
  process.exit(0);
});
