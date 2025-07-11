import { useEffect, useState } from 'react';
import axios from 'axios';

import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Task from './components/Task/Task';
import NewTaskInput from './components/NewTaskInput/NewTaskInput';
import FetchTasksSpinner from './components/FetchTasksSpinner/FetchTasksSpinner';

import { authHeader } from './utils/authHeader.js';

import styles from './App.module.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://mern-task-manager-syry.onrender.com/api/v1/tasks',
        { headers: authHeader() },
      );
      setTasks(res.data.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(
        'https://mern-task-manager-syry.onrender.com/api/v1/auth/check',
        { headers: authHeader() },
      );
      setIsLoggedIn(response.data.loggedIn);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchTasks().catch((err) => {
      console.error('Unexpected error in fetchTasks:', err);
    });
    checkLoginStatus();
    const handleAuthChanged = () => {
      setTasks([]);
      checkLoginStatus();
    };
    window.addEventListener('authChanged', handleAuthChanged);
    return () => window.removeEventListener('authChanged', handleAuthChanged);
  }, []);

  if (!isLoggedIn) return <LandingPage />;
  if (loading) {
    return (
      <div className={styles.spinnerWrapper}>
        <FetchTasksSpinner />
      </div>
    );
  }
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.appBody}>
      <div className={styles.fixedHeader}>
        <h1>MERN Task Manager</h1>
        {isLoggedIn && <NewTaskInput onTaskAdded={fetchTasks} />}
      </div>
      <div className={styles.scrollableTaskList}>
        {tasks.length === 0 && (
          <div className={styles.emptyMessage}>
            <p>Your task list is empty.</p>
          </div>
        )}
        {tasks.map((task) => (
          <Task
            key={task._id}
            title={task.title}
            _id={task._id}
            completed={task.completed}
            onTaskChanged={fetchTasks}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
