const bcrypt = require('bcryptjs');

/**
 * Compares a plain text password with a hashed password.
 *
 * @async
 * @param {string} candidate - The plain text password to compare.
 * @param {string} hashed - The hashed password to compare against.
 * @returns {Promise<boolean>} Resolves to true if the passwords match, otherwise false.
 */
const comparePasswords = async (candidate, hashed) => {
  return bcrypt.compare(candidate, hashed);
};

module.exports = comparePasswords;
