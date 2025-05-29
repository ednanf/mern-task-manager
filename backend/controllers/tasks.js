const getTasks = (req, res) => {
  res.status(200).send('getTasks');
};

const postTask = (req, res) => {
  res.status(201).send('postTask');
};

const getTask = (req, res) => {
  res.status(200).send(`getTask ${req.params.id}`);
};

const patchTask = (req, res) => {
  res.status(200).send(`patchTask ${req.params.id}`);
};

const deleteTask = (req, res) => {
  res.status(200).send(`deleteTask ${req.params.id}`);
};

module.exports = {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
};
