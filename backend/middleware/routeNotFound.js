// This is needed because Express does not treat "no route matched" as an error!
const HttpError = require('../errors/HttpError');

const routeNotFound = (req, res, next) => {
  const error = new HttpError(404, 'Route not found');
  next(error);
};

module.exports = routeNotFound;
