const jwt = require('jsonwebtoken');

// Helper to validate JWT token
const isTokenValid = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};

// Helper to extract user info from JWT token
const extractUserInfo = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload; // You can customize this to return only specific fields
  } catch (err) {
    return null;
  }
};

module.exports = { isTokenValid, extractUserInfo };
