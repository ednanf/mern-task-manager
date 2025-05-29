const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    data: {
      code: err.status,
      message: err.message || 'Internal server error.',
    },
  });
};

module.exports = errorHandler;
