const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'is required.'],
    trim: true,
    maxLength: [20, 'must have a maximum of 20 characters.'],
  },
  completed: {
    type: String,
    default: false,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
