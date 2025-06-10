const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
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
  // Read the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    return next(
      customError(
        StatusCodes.UNAUTHORIZED,
        'Authentication failed, please try again.',
      ),
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return next(
      customError(
        StatusCodes.UNAUTHORIZED,
        'Authentication failed, please try again.',
      ),
    );
  }
};

module.exports = auth;
