/**
 * Express error handling middleware.
 *
 * Sends a JSON response with error details and appropriate HTTP status code.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    data: {
      code: err.status,
      message: err.message || 'Internal server error.',
    },
  });
};

module.exports = errorHandler;
