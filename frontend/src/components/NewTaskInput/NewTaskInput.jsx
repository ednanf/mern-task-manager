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

  /*
  TODO: Add an extra step to buttons
  1. Natural state - distance 15px and convex
  2. Hovering - distance 10px and convex
  3. Pressed - distance 5px and concave
*/

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <input
            id='createTask'
            type='text'
            name='title'
            value={newTask.title}
            onChange={handleChange}
            className={styles.inputField}
            placeholder='Add a new task...'
            autoComplete='off'
          />
          <button type='submit' className={styles.submitButton}>
            +
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskInput;
