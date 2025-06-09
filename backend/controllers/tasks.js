const { StatusCodes } = require('http-status-codes');

const Task = require('../models/Task');
const { HttpError, customError } = require('../errors');

/**
 * Retrieves all tasks created by the authenticated user, sorted by creation date.
 *
 * @async
 * @function getTasks
 * @param {Object} req - Express request object, containing the authenticated user's information.
 * @param {Object} req.user - The authenticated user object.
 * @param {string} req.user.userId - The ID of the authenticated user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the user's tasks and a success status.
 */
const getTasks = async (req, res) => {
  // Use the userId property found in the request to filter relevant items
  const tasks = await Task.find({ createdBy: req.user.userId }).sort(
    'createdAt',
  );

  res.status(StatusCodes.OK).json({ status: 'success', data: tasks });
};

/**
 * Creates a new task associated with the currently authenticated user.
 *
 * @async
 * @function postTask
 * @param {import('express').Request} req - Express request object, expects `req.user.userId` and task data in `req.body`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the created task and status code 201.
 */
const postTask = async (req, res) => {
  // First we create a new property in the request, attributing the value of userId (which is the current logged in user)
  req.body.createdBy = req.user.userId;

  // Grab contents from request's body
  const contents = req.body;

  // Create new task with contents
  const task = await Task.create(contents);

  res.status(StatusCodes.CREATED).json({ status: 'success', data: task });
};

/**
 * Retrieves a single task belonging to the authenticated user by its ID.
 *
 * @async
 * @function getTask
 * @param {import('express').Request} req - Express request object, with authenticated user's ID attached to `req.user.userId` and task ID in `req.params.id`.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with the task data if found, otherwise passes a not found error to the next middleware.
 */
const getTask = async (req, res, next) => {
  // Grab the user id from the request (the userId was attached to it in the auth middleware)
  const userId = req.user.userId;

  // Grab the id from params
  const taskId = req.params.id;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${taskId} not found.`),
    );
  }

  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

/**
 * Updates a task belonging to the authenticated user.
 *
 * @async
 * @function patchTask
 * @param {import('express').Request} req - Express request object, with user info and task update data.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 *
 * @throws {Error} If the task is not found or update fails.
 */
const patchTask = async (req, res, next) => {
  // Grab the user id from the request (the userId was attached to it in the auth middleware)
  const userId = req.user.userId;

  // Grab the id from params
  const taskId = req.params.id;

  // Grab contents from body
  const contents = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    contents,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${taskId} not found.`),
    );
  }

  res.status(StatusCodes.OK).json({ status: 'success', data: { task } });
};

/**
 * Deletes a task belonging to the authenticated user.
 *
 * @async
 * @function deleteTask
 * @param {import('express').Request} req - Express request object, expects `user.userId` and `params.id`.
 * @param {import('express').Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a JSON response on success or passes an error to next middleware.
 */
const deleteTask = async (req, res, next) => {
  // Grab the user id from the request (the userId was attached to it in the auth middleware)
  const userId = req.user.userId;

  // Grab the id from params
  const taskId = req.params.id;

  const task = await Task.findOneAndDelete({ _id: taskId, createdBy: userId });

  if (!task) {
    return next(
      customError(StatusCodes.NOT_FOUND, `Task with id ${taskId} not found.`),
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
