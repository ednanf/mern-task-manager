import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

import styles from './Task.module.css';

const Task = ({ _id, title, completed, onTaskChanged }) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = async (e) => {
    const newCompleted = e.target.checked;
    setIsCompleted(newCompleted);
    setIsLoading(true);
    try {
      await axios.patch(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { completed: newCompleted },
        { withCredentials: true },
      );
      toast.success('Task updated!');
    } catch (err) {
      setIsCompleted(!newCompleted); // revert if error
      toast.error('Failed to update task.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      await axios.patch(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { title: editTitle },
        { withCredentials: true },
      );
      setIsEditing(false);
      toast.success('Title updated!');
    } catch (err) {
      toast.error('Failed to update title.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://mern-task-manager-syry.onrender.com/api/v1/tasks/${_id}`,
        { withCredentials: true },
      );
      toast.success('Task deleted!');
      if (onTaskChanged) onTaskChanged();
    } catch (err) {
      toast.error('Failed to delete task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.taskBody}>
      <input
        type='checkbox'
        id={`completed-${_id}`}
        name='completed'
        checked={isCompleted}
        onChange={handleCheckboxChange}
        disabled={isLoading}
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
          <button onClick={handleSaveClick} disabled={isLoading}>
            Save
          </button>
          <button onClick={handleCancelClick} disabled={isLoading}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className={styles.taskTitle}>{editTitle}</p>
          <button onClick={handleEditClick} disabled={isLoading}>
            Edit
          </button>
        </>
      )}
      <button onClick={handleDeleteClick} disabled={isLoading}>
        Delete
      </button>
    </div>
  );
};

export default Task;
