const HttpError = require('./HttpError');

/**
 * Creates a new HttpError instance with the specified status code and message.
 *
 * @param {number} code - The HTTP status code for the error.
 * @param {string} message - The error message to be associated with the error.
 * @returns {HttpError} The created HttpError instance.
 */
const customError = (code, message) => {
  return new HttpError(code, message);
};

module.exports = customError;
