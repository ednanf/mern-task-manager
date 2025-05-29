// This is needed because Express does not treat "no route matched" as an error!
const { HttpError } = require('../errors');

/**
 * Middleware to handle requests to undefined routes.
 * Creates a 404 HttpError and passes it to the next middleware.
 *
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
const routeNotFound = (req, res, next) => {
  const error = new HttpError(404, 'Route not found');
  next(error);
};

module.exports = routeNotFound;
