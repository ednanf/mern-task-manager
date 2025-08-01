const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Task title is required.'],
      maxLength: [25, 'Task title must contain a maximum of 25 characters.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Provide an user.'],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Task', TaskSchema);
