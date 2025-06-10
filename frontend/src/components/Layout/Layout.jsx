import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../NavBar/Navbar';

import styles from './Layout.module.css';

const Layout = () => {
  return (
    <>
      <Navbar />
      <ToastContainer position='top-center' autoClose={2000} />
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
