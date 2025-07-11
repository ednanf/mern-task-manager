const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { customError } = require('../errors');
const { isTokenValid, extractUserInfo } = require('../utils/cookieCheck');

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({ token, user: user.name });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: error.message || 'Registration failed' });
  }
};

const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if email or password is missing
  if ((!email, !password)) {
    throw customError(
      StatusCodes.BAD_REQUEST,
      'Please, provide email and password',
    );
  }

  // Find the user by email in the database
  const user = await User.findOne({ email });

  // If user does not exist, throw an error
  if (!user) {
    throw customError(StatusCodes.BAD_REQUEST, 'Invalid credentials.');
  }

  // Compare the provided password with the stored hashed password
  const isPasswordCorrect = await user.comparePassword(password);

  // If password is incorrect, throw an error
  if (!isPasswordCorrect) {
    throw customError(StatusCodes.BAD_REQUEST, 'Invalid credentials.');
  }

  // Generate a JWT token for the authenticated user
  const token = await user.createJWT();

  // Send a success response with the user's name and JWT token
  res.status(StatusCodes.OK).json({ token, user: user.name });
};

const check = async (req, res) => {
  const token = req.cookies.token;

  if (!token || !isTokenValid(token)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ loggedIn: false });
  }

  res
    .status(StatusCodes.OK)
    .json({ loggedIn: true, user: extractUserInfo(token) });
};

/**
 * Logs out the user by clearing the authentication token cookie.
 *
 * @async
 * @function logout
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating success.
 */
const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = { register, login, check, logout };
