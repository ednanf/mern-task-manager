import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import styles from './NewTaskInput.module.css';

const NewTaskInput = ({ onTaskAdded }) => {
  const [newTask, setNewTask] = useState({ title: '', completed: false });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://mern-task-manager-syry.onrender.com/api/v1/tasks',
        newTask,
        { withCredentials: true },
      );
      setNewTask({ title: '', completed: false });
      if (onTaskAdded) onTaskAdded(); // Refresh the list
    } catch (err) {
      toast.error(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Task creation failed',
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          id='createTask'
          type='text'
          name='title'
          value={newTask.title}
          onChange={handleChange}
        />
        <button type='submit'>+</button>
      </form>
    </div>
  );
};

export default NewTaskInput;
