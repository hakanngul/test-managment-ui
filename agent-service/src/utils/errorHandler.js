/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Create a 400 Bad Request error
 */
const badRequest = (message) => {
  return new ApiError(400, message);
};

/**
 * Create a 401 Unauthorized error
 */
const unauthorized = (message = 'Unauthorized') => {
  return new ApiError(401, message);
};

/**
 * Create a 403 Forbidden error
 */
const forbidden = (message = 'Forbidden') => {
  return new ApiError(403, message);
};

/**
 * Create a 404 Not Found error
 */
const notFound = (message = 'Resource not found') => {
  return new ApiError(404, message);
};

/**
 * Create a 500 Internal Server Error
 */
const internal = (message = 'Internal server error', isOperational = true) => {
  return new ApiError(500, message, isOperational);
};

module.exports = {
  ApiError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internal
};
