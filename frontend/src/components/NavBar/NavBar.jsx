import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <Link to='/'>Home</Link>
      <Link to='/auth'>Sign Up / Login</Link>
    </nav>
  );
};

export default Navbar;
