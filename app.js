// Root entry point for cPanel / Phusion Passenger / hosting environments
process.chdir(__dirname);
try { require('dotenv').config(); } catch (e) {}
require('./dist/server.cjs');
