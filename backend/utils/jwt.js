const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for the given payload.
 *
 * @param {Object} payload - The data to encode in the JWT.
 * @returns {string} The signed JWT as a string.
 */
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = createToken;
