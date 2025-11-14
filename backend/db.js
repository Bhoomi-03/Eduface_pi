const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  // Use 127.0.0.1 by default to avoid IPv6 ::1 connection issues on some systems
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'eduface_user',
  password: process.env.DB_PASS || 'eduface_pass_2025',
  database: process.env.DB_NAME || 'eduface',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
