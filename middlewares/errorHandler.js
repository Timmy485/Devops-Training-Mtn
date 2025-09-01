import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Catches all errors and provides consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error('Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Determine appropriate status code
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflict';
  }

  // Build error response
  const errorResponse = {
    error: true,
    message: message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add error details in development
  if (isDevelopment) {
    errorResponse.details = {
      message: err.message,
      stack: err.stack,
      name: err.name
    };
  }

  // Add validation errors if present
  if (err.details && Array.isArray(err.details)) {
    errorResponse.validationErrors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

export default errorHandler; 