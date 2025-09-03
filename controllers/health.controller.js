import logger from '../utils/logger.js';
import os from 'os';

/**
 * Get basic health status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHealth = async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    logger.debug('Health check requested', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get detailed health status with system information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDetailedHealth = async (req, res) => {
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
        },
        cpu: {
          cores: os.cpus().length,
          loadAverage: os.loadavg()
        },
        uptime: os.uptime()
      },
      process: {
        pid: process.pid,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    };

    logger.debug('Detailed health check requested', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed', { error: error.message });
    res.status(500).json({
      status: 'unhealthy',
      error: 'Detailed health check failed',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get readiness status for health probes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getReadiness = async (req, res) => {
  try {
    // Check if the application is ready to serve requests
    const isReady = true; // Add your readiness logic here
    
    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({
      status: 'not ready',
      error: 'Readiness check failed',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get liveness status for health probes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLiveness = async (req, res) => {
  try {
    // Check if the application is alive and responsive
    const isAlive = true; // Add your liveness logic here
    
    if (isAlive) {
      res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not alive',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Liveness check failed', { error: error.message });
    res.status(503).json({
      status: 'not alive',
      error: 'Liveness check failed',
      timestamp: new Date().toISOString()
    });
  }
};

export {
  getHealth,
  getDetailedHealth,
  getReadiness,
  getLiveness
}; 