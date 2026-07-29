// Root entry point for cPanel / Phusion Passenger / hosting environments
process.chdir(__dirname);
try { require('dotenv').config(); } catch (e) {}

process.on('uncaughtException', (err) => {
  console.error('[Passenger Error] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Passenger Error] Unhandled Rejection:', reason);
});

require('./dist/server.cjs');

