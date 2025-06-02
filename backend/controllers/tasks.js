const { StatusCodes } = require('http-status-codes');

const Task = require('../models/Task');
const { HttpError, customError } = require('../errors');

const getTasks = async (req, res) => {
  const tasks = await Task.find({});
  res.status(StatusCodes.OK).json({ status: 'success', data: tasks });
};

const postTask = async (req, res) => {
  // First we create a new property in the request, attributing the value of userId (which is the current logged in user)
  req.body.createdBy = req.user.userId;
  const contents = req.body;
  const task = await Task.create(contents);
  res.status(StatusCodes.CREATED).json({ status: 'success', data: task });
};

const getTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOne({ _id: id });

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${id} not found.`),
    );
  }
  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

const patchTask = async (req, res, next) => {
  const { id } = req.params;
  const contents = req.body;
  const task = await Task.findOneAndUpdate({ _id: id }, contents, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${id} not found.`),
    );
  }
  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id });

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${id} not found.`),
    );
  }

  res
    .status(StatusCodes.OK)
    .json({ status: 'success', data: { message: 'Task deleted.' } });
};

module.exports = {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
};
