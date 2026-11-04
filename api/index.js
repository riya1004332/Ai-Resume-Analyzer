const { createApp } = require('../server/dist/app');

// Instantiate Express app instance for Vercel Serverless Function
const app = createApp();

module.exports = app;
