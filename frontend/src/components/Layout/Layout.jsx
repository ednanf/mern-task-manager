import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import NavBar from '../NavBar/NavBar';
import Toggle from '../Toggle/Toggle';

import styles from './Layout.module.css';
import 'react-toastify/dist/ReactToastify.css';
import '../../toastify-neumorphism.css';

const Layout = () => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
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

  const handleToggle = (e) => {
    setDark(e.target.checked);
  };

  return (
    <>
      <NavBar />
      <div className={styles.toggleFloat}>
        <Toggle checked={dark} onChange={handleToggle} />
      </div>
      <ToastContainer
        autoClose={2000}
        position='top-right'
        theme={dark ? 'dark' : 'light'}
      />
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
