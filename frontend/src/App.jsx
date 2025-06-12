import { useEffect, useState } from 'react';
import axios from 'axios';

import NewTaskInput from './components/NewTaskInput/NewTaskInput';
import Task from './components/Task/Task';

import styles from './App.module.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://mern-task-manager-syry.onrender.com/api/v1/tasks',
        { withCredentials: true },
      );
      setTasks(res.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // FIXME: "Loading tasks..." is not centered, add class maybe?
  //TODO: Add spinner in center above "loading tasks"

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.appBody}>
      <h1>MERN Task Manager</h1>
      <div className=''>
        <NewTaskInput onTaskAdded={fetchTasks} />
        <div className={styles.taskListWrapper}>
          {tasks.length === 0 && <li>Your task list is empty.</li>}
          {tasks.map((task) => (
            <Task
              title={task.title}
              _id={task._id}
              completed={task.completed}
              onTaskChanged={fetchTasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
