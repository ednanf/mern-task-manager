import { Outlet } from 'react-router-dom';

import Navbar from '../NavBar/Navbar';

import styles from './Layout.module.css';

const Layout = () => {
  return (
    <>
      <Navbar />
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
