const BASE_API_URL =
  import.meta.env.VITE_ENV === 'DEV'
    ? 'http://localhost:8000/api/v1'
    : 'https://mern-task-manager-syry.onrender.com/api/v1';

export default BASE_API_URL;
