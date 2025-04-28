const logger = require('../utils/logger');
const { ApiError } = require('../utils/errorHandler');

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log error
  if (error.statusCode === 500) {
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${error.statusCode}, Message:: ${error.message}`);
    logger.error(error.stack);
  } else {
    logger.warn(`[${req.method}] ${req.path} >> StatusCode:: ${error.statusCode}, Message:: ${error.message}`);
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFound };
