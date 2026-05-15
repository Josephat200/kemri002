import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import respondentRoutes from './routes/respondents';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './config/logger';
import pool from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const frontendPath = path.resolve(process.cwd(), '..', 'frontend');
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve the production frontend from the repository frontend directory
app.use(express.static(frontendPath, {
  extensions: ['html'],
  maxAge: 0,
}));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'READY',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Readiness check failed: ${error}`);
    res.status(503).json({
      status: 'NOT_READY',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// API Routes
app.use(`${API_PREFIX}/respondents`, respondentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}${API_PREFIX}`);
});

export default app;
