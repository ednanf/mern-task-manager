import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { authHeader } from '../../utils/authHeader';

import { FiEdit3, FiDelete, FiSave, FiTrash } from 'react-icons/fi';
import { TbArrowBack } from 'react-icons/tb';

import TaskButton from '../TaskButton/TaskButton';
import TaskCheckbox from '../TaskCheckbox/TaskCheckbox';
import TaskEditInput from '../TaskEditInput/TaskEditInput';
import TaskSpinner from '../TaskSpinner/TaskSpinner';

import styles from './Task.module.css';
import '../../common.css';

const Task = ({ _id, title, completed, onTaskChanged }) => {
  const [isCompleted, setIsCompleted] = useState(completed); // Initialize with the original completed state
  const [isEditing, setIsEditing] = useState(false); // Track if the task is being edited
  const [editTitle, setEditTitle] = useState(title); // Initialize with the original title
  const [isLoading, setIsLoading] = useState(false); // Track loading state for actions
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
        { headers: authHeader() },
      );
      toast.success('Task updated!');
    } catch (err) {
      setIsCompleted(!newCompleted); // revert if error
      const rawMessage =
        err.response?.data?.data?.message ||
        err.response?.data?.msg ||
        'Failed to update task.';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
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
        { headers: authHeader() },
      );
      setIsEditing(false);
      toast.success('Title updated!');
    } catch (err) {
      const rawMessage =
        err.response?.data?.data?.message ||
        err.response?.data?.msg ||
        'Failed to update title.';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
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
        {
          headers: authHeader(),
        },
      );
      toast.success('Task deleted!');
      if (onTaskChanged) onTaskChanged();
    } catch (err) {
      const rawMessage =
        err.response?.data?.data?.message ||
        err.response?.data?.msg ||
        'Failed to delete task.';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div
      className={`${styles.taskCard} ${isEditing ? `${styles.editing}` : ''}`}>
      <div className={styles.taskBody}>
        <div className={styles.taskContent}>
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
              <TaskEditInput
                id={`editTitle-${_id}`}
                value={editTitle}
                onChange={handleEditTitleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveClick();
                  }
                }}
              />
              {!isLoading && (
                <div className={styles.taskButtonsRight}>
                  <TaskButton
                    className=''
                    onClick={handleSaveClick}
                    disabled={isLoading}
                    ariaLabel='save'>
                    <FiSave size={22} />
                  </TaskButton>
                  <TaskButton
                    className=''
                    onClick={handleCancelClick}
                    disabled={isLoading}
                    ariaLabel='cancel'>
                    <TbArrowBack size={22} />
                  </TaskButton>
                </div>
              )}
            </>
          ) : (
            <>
              <p
                className={`${styles.taskTitle} ${
                  isCompleted ? styles.completed : ''
                }`}>
                {editTitle}
              </p>
              {!isLoading && (
                <div className={styles.taskButtonsRight}>
                  <TaskButton
                    className=''
                    onClick={handleEditClick}
                    disabled={isLoading}
                    ariaLabel='edit'>
                    <FiEdit3 size={22} />
                  </TaskButton>
                  <TaskButton
                    className=''
                    onClick={handleDeleteClick}
                    disabled={isLoading}
                    ariaLabel='delete'>
                    <FiTrash size={22} />
                  </TaskButton>
                </div>
              )}
            </>
          )}
        </div>
        {isLoading && <TaskSpinner />}
      </div>
    </div>
  );
};

export default Task;
