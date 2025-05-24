const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    // An empty find({}) fetches everything
    const tasks = await Task.find({});
    // Since "tasks" is an array, .length can be used
    if (tasks.length < 1) {
      return res.status(404).json({
        success: false,
        data: {
          message: 'No tasks found',
        },
      });
    }
    res.status(200).json({
      success: true,
      data: {
        message: 'GET tasks',
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        message: error.message,
      },
    });
  }
};

const postTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        message: 'POST task',
        newTask,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        message: error.message,
      },
    });
  }
};

const getTask = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'GET task',
      id: req.params.id,
    },
  });
};

const patchTask = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'PATCH task',
      contents: req.body,
    },
  });
};

const deleteTask = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'DELETE task',
      id: req.params.id,
    },
  });
};

module.exports = { getTasks, postTask, getTask, patchTask, deleteTask };
