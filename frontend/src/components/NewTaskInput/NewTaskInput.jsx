import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import { authHeader } from '../../utils/authHeader.js';

import Button from '../RoundButton/RoundButton';
import { FiPlus } from 'react-icons/fi';

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
        {
          headers: authHeader(),
        },
      );
      setNewTask({ title: '', completed: false });
      if (onTaskAdded) onTaskAdded(); // Refresh the list
    } catch (err) {
      const rawMessage =
        err.response?.data?.data?.message ||
        err.response?.data?.msg ||
        'Task creation failed';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
    }
  };

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
          <Button type='submit' ariaLabel='add text'>
            <FiPlus />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskInput;
