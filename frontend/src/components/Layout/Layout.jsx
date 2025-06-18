import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from '../NavBar/NavBar';
import Toggle from '../Toggle/Toggle';

import styles from './Layout.module.css';

const Layout = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Handler for the custom toggle
  const handleToggle = (e) => {
    setDark(e.target.checked);
  };

  return (
    <>
      <NavBar />
      <div className={styles.toggleFloat}>
        <Toggle checked={dark} onChange={handleToggle} />
      </div>
      <ToastContainer position='top-right' autoClose={2000} />
      <div className={styles.appContainer}>
        <div className={styles.backgroundLayer} />
        <div className={styles.foregroundLayer}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
