import { useEffect, useState } from 'react';
import axios from 'axios';

import NewTaskInput from './components/NewTaskInput/NewTaskInput';

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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>MERN Task Manager</h1>
      <NewTaskInput onTaskAdded={fetchTasks} />
      <ul>
        {tasks.length === 0 && <li>No tasks found.</li>}
        {tasks.map((task) => (
          <li key={task._id || task.id}>{task.title || task.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
