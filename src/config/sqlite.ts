import sqlite3 from 'sqlite3';
import path from 'path';
import logger from './logger';

// Use in-memory database for development, or file-based for persistence
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'kemri_survey.db');

let db: sqlite3.Database;

export const initializeDatabase = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        logger.error(`Database connection error: ${err.message}`);
        reject(err);
      } else {
        logger.info(`SQLite Database connected at ${DB_PATH}`);
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            logger.error(`Failed to enable foreign keys: ${err.message}`);
          }
        });
        resolve(db);
      }
    });
  });
};

export const getDatabase = (): sqlite3.Database => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};

export const runQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const getQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Removed default export of db to fix TypeScript error
