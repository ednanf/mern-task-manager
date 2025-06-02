const mongoose = require('mongoose');

/*
TODO: Add a createdBy property to assing the tasks to a specific user.
It should be something like this: 

createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
    required: [true, 'Provide an user.']
},

This way, the task will be tied to a specific user.
NOTE: 'User' should be replaced by whatever name the user model has.
*/

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Task title is required.'],
    maxLength: [20, 'Task title must contain a maximum of 20 characters.'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

module.exports = mongoose.model('Task', TaskSchema);
