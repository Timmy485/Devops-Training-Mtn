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

console.log('🚀 Initializing DevSecOps Training Project...');
logger.info('Initializing DevSecOps Training Project');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

console.log('🔒 Security middleware (Helmet) configured');
logger.info('Security middleware (Helmet) configured');

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

console.log('🌐 CORS configured for origin:', process.env.CORS_ORIGIN || 'http://localhost:3000');
logger.info(`CORS configured for origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('📝 Request parsing middleware configured (JSON/URL-encoded, 10MB limit)');
logger.info('Request parsing middleware configured (JSON/URL-encoded, 10MB limit)');

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

console.log('📊 Morgan logging middleware configured');
logger.info('Morgan logging middleware configured');

// Health check endpoint and all sub-routes mounted via centralized router
app.use('/', routes);

console.log('🛣️  Routes mounted via centralized router');
logger.info('Routes mounted via centralized router');

// Static file serving for downloads
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

console.log('📁 Static file serving configured for /downloads');
logger.info('Static file serving configured for /downloads');

// API routes are mounted inside the centralized router (see routes/index.js)

// Root endpoint
app.get('/', (req, res) => {
  console.log('📡 Root endpoint accessed');
  logger.info('Root endpoint accessed');
  
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
  console.log('❌ 404 - Endpoint not found:', req.originalUrl);
  logger.warn(`404 - Endpoint not found: ${req.originalUrl}`);
  
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

console.log('⚠️  Global error handler configured');
logger.info('Global error handler configured');

// Start server
app.listen(PORT, () => {
  console.log('🎉 DevSecOps Training Project started successfully!');
  console.log(`🌍 Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📊 Health monitoring available at /health');
  console.log('💰 MoMo services available at /api/momo');
  console.log('📁 Downloads available at /downloads');
  console.log('=====================================');
  
  logger.info(`DevSecOps Training Project started on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info('Health monitoring available at /health');
  logger.info('MoMo services available at /api/momo');
  logger.info('Downloads available at /downloads');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 