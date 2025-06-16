import { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('https://mern-task-manager-syry.onrender.com/api/v1/auth/check', {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.loggedIn);
    } catch (error) {
      setIsLoggedIn(false);
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handler = () => checkLoginStatus();
    window.addEventListener('authChanged', handler);
    return () => window.removeEventListener('authChanged', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('https://mern-task-manager-syry.onrender.com/api/v1/auth/logout', {
        withCredentials: true,
      });
      window.dispatchEvent(new Event('authChanged'));
      // window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <Link to='/'>Home</Link>
      {!isLoggedIn && <Link to='/auth'>Sign Up / Login</Link>}
      {isLoggedIn && (
        <a href='#' onClick={handleLogout}>
          Logout
        </a>
      )}
    </nav>
  );
};

export default Navbar;
