const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { customError } = require('../errors');

auth = async (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If not, respond with an unauthorized error
    return next(customError(StatusCodes.UNAUTHORIZED, 'No token provided'));
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the JWT secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info from the payload to the request object
    req.user = { userId: payload.userId, name: payload.name };
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If verification fails, respond with an authentication error
    return next(customError(StatusCodes.UNAUTHORIZED, 'Authentication failed'));
  }
};

module.exports = auth;
