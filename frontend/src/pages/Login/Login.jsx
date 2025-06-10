import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Login.module.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://mern-task-manager-syry.onrender.com/api/v1/auth/login',
        form,
      );
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.msg || err.response?.data?.error || 'Login failed',
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            id='email'
            type='email'
            name='email'
            required
            value={form.email}
            onChange={handleChange}
            autoComplete='email'
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            id='password'
            type='password'
            name='password'
            required
            value={form.password}
            onChange={handleChange}
            autoComplete='current-password'
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      <h4>Don't have an account?</h4>
      <Link to='/auth'>Register</Link>
    </div>
  );
};

export default Login;
