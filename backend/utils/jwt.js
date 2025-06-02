const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_LIFETIME });
};

module.exports = createToken;
