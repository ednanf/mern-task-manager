import { useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import AuthInput from '../../components/AuthInput/AuthInput';
import AuthButton from '../../components/AuthButton/AuthButton';

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
      const response = await axios.post(
        'https://mern-task-manager-syry.onrender.com/api/v1/auth/login',
        form,
      );
      // Save token locally
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('authChanged'));
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      const rawMessage =
        err.response?.data?.msg ||
        err.response?.data?.data?.message ||
        'Login failed';
      // Extract only the core error message by taking the last part after the final colon
      const errorMessage = rawMessage.split(': ').pop() || rawMessage;
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.loginBody}>
      <div className={styles.loginWrapper}>
        <h2 className={styles.loginHeader}>Login</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
              autoComplete='current-password'
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}>
            <AuthButton>Login</AuthButton>
          </div>
        </form>
        <div className={styles.loginFooter}>
          <h4>Don't have an account?</h4>
          <Link to='/auth' className={styles.loginLink}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
