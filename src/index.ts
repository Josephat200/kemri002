import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import respondentRoutes from './routes/respondents';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './config/logger';
import { verifySupabaseConnection } from './config/supabase';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    await verifySupabaseConnection();

    res.json({
      status: 'READY',
      persistence: 'supabase',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Readiness check failed: ${error}`);
    res.status(503).json({
      status: 'NOT_READY',
      persistence: 'supabase',
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use(`${API_PREFIX}/respondents`, respondentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API available at http://localhost:${PORT}${API_PREFIX}`);
});

export default app;
