const routeNotFound = (req, res, next) => {
  const error = new Error('404 - Not found.');
  error.status = 404;
  next(error);
};

module.exports = routeNotFound;
