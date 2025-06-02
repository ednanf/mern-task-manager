const register = (req, res) => {
  res.send('register route');
};

const login = (req, res) => {
  res.send('login route');
};

module.exports = { register, login };
