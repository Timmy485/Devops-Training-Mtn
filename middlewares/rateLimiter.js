import logger from '../utils/logger.js';

// In-memory store for rate limiting
const requestCounts = new Map();
const requestTimestamps = new Map();

/**
 * Rate limiting middleware
 * Limits API requests per IP address to prevent abuse
 */
const rateLimiter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const currentTime = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max requests per window
  
  // Clean up old entries
  if (requestTimestamps.has(clientIP)) {
    const timestamps = requestTimestamps.get(clientIP);
    const validTimestamps = timestamps.filter(timestamp => 
      currentTime - timestamp < windowMs
    );
    
    if (validTimestamps.length === 0) {
      requestCounts.delete(clientIP);
      requestTimestamps.delete(clientIP);
    } else {
      requestTimestamps.set(clientIP, validTimestamps);
      requestCounts.set(clientIP, validTimestamps.length);
    }
  }
  
  // Get current request count
  const currentCount = requestCounts.get(clientIP) || 0;
  
  // Check if limit exceeded
  if (currentCount >= maxRequests) {
    logger.warn('Rate limit exceeded', {
      clientIP,
      currentCount,
      maxRequests,
      windowMs,
      path: req.path,
      method: req.method
    });
    
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
  
  // Update request tracking
  if (!requestTimestamps.has(clientIP)) {
    requestTimestamps.set(clientIP, []);
  }
  
  const timestamps = requestTimestamps.get(clientIP);
  timestamps.push(currentTime);
  requestCounts.set(clientIP, timestamps.length);
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': maxRequests - timestamps.length,
    'X-RateLimit-Reset': new Date(currentTime + windowMs).toISOString()
  });
  
  next();
};

export default rateLimiter; 