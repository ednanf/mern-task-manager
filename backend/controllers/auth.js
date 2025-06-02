const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { customError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ status: 'success', data: { user: user.name, token } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    throw new customError(
      StatusCodes.BAD_REQUEST,
      'Please, provide email and password',
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new customError(StatusCodes.BAD_REQUEST, 'Invalid credentials.');
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new customError(StatusCodes.BAD_REQUEST, 'Invalid credentials.');
  }

  const token = await user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ status: 'success', data: { user: user.name, token } });
};

module.exports = { register, login };
