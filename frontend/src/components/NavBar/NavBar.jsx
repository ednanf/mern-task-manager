import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from './NavBar.module.css';

const Navbar = () => {
  const handleLogout = async () => {
    try {
      await axios.get('https://mern-task-manager-syry.onrender.com/api/v1/auth/logout', {
        withCredentials: true,
      });
      window.location.href = '/';
    } catch (error) {
      // handle error if needed
    }
  };

  return (
    <nav className={styles.nav}>
      <Link to='/'>Home</Link>
      <Link to='/auth'>Sign Up / Login</Link>
      <a href='#' onClick={handleLogout}>
        Logout
      </a>
    </nav>
  );
};

export default Navbar;
