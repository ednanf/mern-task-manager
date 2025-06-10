import { useState } from 'react';

import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from './Auth.module.css';

const Auth = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        'https://mern-task-manager-syry.onrender.com/api/v1/auth/register',
        form,
      );
      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          'Registration failed',
      );
    }
  };

  return (
    <div>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>Name:</label>
          <input
            id='name'
            type='text'
            name='name'
            required
            value={form.name}
            onChange={handleChange}
            autoComplete='name'
          />
        </div>
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
            autoComplete='new-password'
          />
        </div>
        <button type='submit'>Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <h4>Already have one?</h4>
      <Link to='login'>Login</Link>
      <Outlet />
    </div>
  );
};

export default Auth;
