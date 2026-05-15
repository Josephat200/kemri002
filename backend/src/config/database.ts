import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Support either individual DB env vars or a single DATABASE_URL
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = parseInt(process.env.DB_PORT || '3306');
let dbUser = process.env.DB_USER || 'root';
let dbPassword = process.env.DB_PASSWORD || 'password';
let dbName = process.env.DB_NAME || 'kemri_rh_survey';

if (process.env.DATABASE_URL) {
  try {
    const u = new URL(process.env.DATABASE_URL);
    if (u.protocol.startsWith('mysql')) {
      dbHost = u.hostname;
      dbPort = parseInt(u.port || '3306');
      dbUser = decodeURIComponent(u.username || dbUser);
      dbPassword = decodeURIComponent(u.password || dbPassword);
      dbName = u.pathname ? u.pathname.replace(/^\//, '') : dbName;
    }
  } catch (err) {
    // If parsing fails, fall back to individual env vars
  }
}

const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
