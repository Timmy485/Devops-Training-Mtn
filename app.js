import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';

// Import routes
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check endpoint and all sub-routes mounted via centralized router
app.use('/', routes);

// Static file serving for downloads
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// API routes are mounted inside the centralized router (see routes/index.js)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'DevSecOps Training Project',
    version: '1.0.0',
    description: 'Training project with health monitoring and MoMo payment services',
    endpoints: {
      health: '/health',
      momo: '/api/momo',
      downloads: '/downloads'
    },
    features: {
      health: 'Health monitoring and system status checks',
      momo: 'Mobile money payment services and transactions',
      downloads: 'File download capabilities'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`DevSecOps Training Project started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info('Health monitoring available at /health');
  logger.info('MoMo services available at /api/momo');
  logger.info('Downloads available at /downloads');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 