const Task = require('../models/Task');
const { HttpError, customError } = require('../errors');

const getTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ status: 'success', data: tasks });
};

const postTask = async (req, res) => {
  const contents = req.body;
  const task = await Task.create(contents);
  res.status(201).json({ status: 'success', data: task });
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ _id: id });
  res.status(200).json({ status: 'success', data: { task } });
};

const patchTask = async (req, res) => {
  const { id } = req.params;
  const contents = req.body;
  const patchedTask = await Task.findOneAndUpdate({ _id: id }, contents, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: 'success', data: { patchedTask } });
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id });
  console.log(task);
  if (!task) {
    return next(customError(404, 'Not found'));
  }
  res
    .status(200)
    .json({ status: 'success', data: { message: 'Task deleted.' } });
};

module.exports = {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
};
