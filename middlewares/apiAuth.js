import logger from '../utils/logger.js';

/**
 * API Key authentication middleware
 * Validates the x-api-key header against the configured API key
 */
const apiAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    logger.warn('API request missing x-api-key header', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Missing x-api-key header'
    });
  }

  const expectedApiKey = process.env.API_KEY;
  
  if (!expectedApiKey) {
    logger.error('API_KEY environment variable not configured');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'API authentication not properly configured'
    });
  }

  if (apiKey !== expectedApiKey) {
    logger.warn('Invalid API key provided', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      providedKey: apiKey.substring(0, 8) + '...'
    });
    
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid API key'
    });
  }

  logger.debug('API key validation successful', {
    ip: req.ip,
    path: req.path
  });

  next();
};

export default apiAuth; 