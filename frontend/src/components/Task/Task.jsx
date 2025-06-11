import axios from 'axios';
import { useState } from 'react';

import styles from './Task.module.css';

const Task = ({ _id, title, completed, onTaskChanged }) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

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
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      await axios.patch(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { title: editTitle },
        { withCredentials: true },
      );
      setIsEditing(false);
    } catch (err) {}
  };

  const handleCancelClick = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { withCredentials: true },
      );
      if (onTaskChanged) onTaskChanged();
    } catch (err) {}
  };

  return (
    <div className={styles.taskBody}>
      <input
        type='checkbox'
        id={`completed-${_id}`}
        name='completed'
        checked={isCompleted}
        onChange={handleCheckboxChange}
      />
      {isEditing ? (
        <>
          <input
            type='text'
            name='editTitle'
            id={`editTitle-${_id}`}
            value={editTitle}
            onChange={handleEditTitleChange}
            className={styles.taskTitle}
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </>
      ) : (
        <>
          <p className={styles.taskTitle}>{editTitle}</p>
          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
};

export default Task;
