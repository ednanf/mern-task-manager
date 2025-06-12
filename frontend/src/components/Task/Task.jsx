import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

import TaskButton from '../TaskButton/TaskButton';
import TaskCheckbox from '../TaskCheckbox/TaskCheckbox';
import TaskSpinner from '../TaskSpinner/TaskSpinner';

import styles from './Task.module.css';
import '../../common.css';

const Task = ({ _id, title, completed, onTaskChanged }) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // 'save', 'delete', etc.

  const handleCheckboxChange = async (e) => {
    const newCompleted = e.target.checked;
    setIsCompleted(newCompleted);
    setLoadingAction('checkbox');
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
      setLoadingAction(null);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleSaveClick = async () => {
    setLoadingAction('save');
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
      setLoadingAction(null);
    }
  };

  const handleCancelClick = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    setLoadingAction('delete');
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
      setLoadingAction(null);
    }
  };

  // TODO: convert colors into variables in index.css

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskBody}>
        <TaskCheckbox
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
            <TaskButton
              className=''
              onClick={handleSaveClick}
              disabled={isLoading}
            >
              Save
            </TaskButton>
            <TaskButton
              className=''
              onClick={handleCancelClick}
              disabled={isLoading}
            >
              Cancel
            </TaskButton>
          </>
        ) : (
          <>
            <p className={styles.taskTitle}>{editTitle}</p>
            <TaskButton
              className=''
              onClick={handleEditClick}
              disabled={isLoading}
            >
              Edit
            </TaskButton>
          </>
        )}
        <TaskButton
          className=''
          onClick={handleDeleteClick}
          disabled={isLoading}
        >
          Delete
        </TaskButton>
        {isLoading && <TaskSpinner />}
      </div>
    </div>
  );
};

export default Task;
