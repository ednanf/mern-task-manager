import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          'https://mern-task-manager-syry.onrender.com/api/v1/tasks',
          { withCredentials: true },
        );
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>MERN Task Manager</h1>
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
