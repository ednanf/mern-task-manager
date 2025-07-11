import { useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import AuthInput from '../../components/AuthInput/AuthInput';
import AuthButton from '../../components/AuthButton/AuthButton';

import styles from './Auth.module.css';

const Auth = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://mern-task-manager-syry.onrender.com/api/v1/auth/register',
        form,
      );
      // Save the token locally
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Registration successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const rawMessage =
        err.response?.data?.msg ||
        err.response?.data?.data?.message ||
        'Registration failed';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.authBody}>
      <div className={styles.authWrapper}>
        <h2 className={styles.authHeader}>Create an account</h2>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div style={{ width: '100%' }}>
            <AuthInput
              id='name'
              type='text'
              name='name'
              required
              value={form.name}
              onChange={handleChange}
              autoComplete='name'
            />
          </div>
          <div style={{ width: '100%' }}>
            <AuthInput
              id='email'
              type='email'
              name='email'
              required
              value={form.email}
              onChange={handleChange}
              autoComplete='email'
            />
          </div>
          <div style={{ width: '100%' }}>
            <AuthInput
              id='password'
              type='password'
              name='password'
              required
              value={form.password}
              onChange={handleChange}
              autoComplete='new-password'
            />
          </div>
          <AuthButton>Register</AuthButton>
        </form>
        <div className={styles.authFooter}>
          <h4>Already have an account?</h4>
          <Link to='login' className={styles.authLink}>
            Login
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
