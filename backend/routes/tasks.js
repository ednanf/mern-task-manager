const express = require('express');

const {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
} = require('../controllers/tasks');

const router = express.Router();

// Routes
router.route('/').get(getTasks).post(postTask);
router.route('/:id').get(getTask).patch(patchTask).delete(deleteTask);

module.exports = router;
