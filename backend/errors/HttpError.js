/**
 * Custom error class for HTTP errors.
 * Extends the built-in Error class to include an HTTP status code.
 *
 * @class
 * @extends Error
 * @param {number} status - The HTTP status code associated with the error.
 * @param {string} message - The error message.
 */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
