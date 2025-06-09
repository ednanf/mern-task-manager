const express = require('express');
const { xss } = require('express-xss-sanitizer');

const {
  getTasks,
  postTask,
  getTask,
  patchTask,
  deleteTask,
} = require('../controllers/tasks');

const router = express.Router();

// Routes
router.route('/').get(xss(), getTasks).post(xss(), postTask);
router
  .route('/:id')
  .get(xss(), getTask)
  .patch(xss(), patchTask)
  .delete(xss(), deleteTask);

module.exports = router;
