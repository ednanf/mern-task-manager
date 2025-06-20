import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

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
      await axios.post('https://mern-task-manager-syry.onrender.com/api/v1/tasks', newTask, {
        withCredentials: true,
      });
      setNewTask({ title: '', completed: false });
      if (onTaskAdded) onTaskAdded(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.data?.message || 'Task creation failed';
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
