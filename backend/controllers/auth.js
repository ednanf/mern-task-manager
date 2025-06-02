const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ status: 'success', data: { user: user.name, token } });
};

const login = (req, res) => {
  res.send('login route');
};

module.exports = { register, login };
