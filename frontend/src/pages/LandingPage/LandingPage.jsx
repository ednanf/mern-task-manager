import { Link } from 'react-router-dom';

import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to MERN Task Manager</h2>
      <p>
        <Link to='auth' className={styles.link}>
          Sign up
        </Link>{' '}
        or{' '}
        <Link to='auth/login' className={styles.link}>
          login
        </Link>{' '}
        to get started.
      </p>
      <p className={styles.footer}>
        Developed by Ednan - <a href='https://github.com/ednanf'>GitHub</a>
      </p>
    </div>
  );
};

export default LandingPage;
