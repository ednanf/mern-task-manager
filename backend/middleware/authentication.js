const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { customError } = require('../errors');

/**
 * Middleware to authenticate requests using JWT tokens.
 *
 * Extracts the JWT token from the Authorization header, verifies it,
 * and attaches the user information to the request object.
 * If authentication fails, passes an unauthorized error to the next middleware.
 *
 * @async
 * @function auth
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 */
const auth = async (req, res, next) => {
  // Obtain Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(
      customError(
        StatusCodes.UNAUTHORIZED,
        'Authentication failed, please try again.',
      ),
    );
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  try {
    // Verify the token using the JWT secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = { userId: payload.userId, name: payload.name };
    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle invalid or expired token
    return next(
      customError(
        StatusCodes.UNAUTHORIZED,
        'Authentication failed, please try again.',
      ),
    );
  }
};

module.exports = auth;
