const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { customError } = require('../errors');
const { isTokenValid, extractUserInfo } = require('../utils/cookieCheck');

/**
 * Registers a new user, creates a JWT token, and sends a response with the user's name and token.
 *
 * @async
 * @function register
 * @param {import('express').Request} req - Express request object containing user registration data in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>} Sends a JSON response with the registered user's name and JWT token.
 */
const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    res
      .status(StatusCodes.CREATED)
      .cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ status: 'success', data: { user: user.name } });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message || 'Registration failed' });
  }
};

/**
 * Handles user login.
 *
 * Validates the provided email and password, checks user existence,
 * verifies password correctness, generates a JWT token, and responds
 * with user information and token on success.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object containing email and password in the body.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @throws {customError} If email or password is missing, or credentials are invalid.
 * @returns {Promise<void>} Responds with status 200 and a JSON object containing user name and JWT token on success.
 */
const login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Check if email or password is missing
  if ((!email, !password)) {
    throw customError(StatusCodes.BAD_REQUEST, 'Please, provide email and password');
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
  res
    .status(StatusCodes.OK)
    .cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ status: 'success', data: { user: user.name } });
};

/**
 * Checks if the user is authenticated based on the presence and validity of a token in cookies.
 *
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating authentication status and user info if authenticated.
 */
const check = async (req, res) => {
  const token = req.cookies.token;

  if (!token || !isTokenValid(token)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ loggedIn: false });
  }

  res.status(StatusCodes.OK).json({ loggedIn: true, user: extractUserInfo(token) });
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
