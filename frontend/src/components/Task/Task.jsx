import axios from 'axios';
import { useState } from 'react';

import styles from './Task.module.css';

const Task = ({ _id, title, completed }) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCheckboxChange = async (e) => {
    const newCompleted = e.target.checked;
    setIsCompleted(newCompleted);
    try {
      await axios.patch(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { completed: newCompleted },
        { withCredentials: true },
      );
    } catch (err) {
      setIsCompleted(!newCompleted); // revert if error
      // Optionally show an error toast here
    }
  };

  return (
    <div className={styles.taskBody}>
      <input
        type='checkbox'
        checked={isCompleted}
        onChange={handleCheckboxChange}
      />
      <p className={styles.taskTitle}>{title}</p>
      <div>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default Task;
