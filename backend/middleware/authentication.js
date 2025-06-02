const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const customError = require('../errors');

const auth = async (req, res, next) => {
  // Obtain Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new customError(
      StatusCodes.UNAUTHORIZED,
      'Authentication failed, please try again.',
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
    throw new customError(
      StatusCodes.UNAUTHORIZED,
      'Authentication failed, please try again.',
    );
  }
};

module.exports = auth;
