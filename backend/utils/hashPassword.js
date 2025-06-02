const bcrypt = require('bcryptjs');

/**
 * Hashes a plain text password using bcrypt with a salt.
 *
 * @async
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = hashPassword;
