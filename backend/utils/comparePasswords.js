const bcrypt = require('bcryptjs');

const comparePasswords = async (candidate, hashed) => {
  return bcrypt.compare(candidate, hashed);
};

module.exports = comparePasswords;
