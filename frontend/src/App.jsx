import { Link } from 'react-router-dom';

import Auth from './pages/Auth/Auth';

import styles from './App.module.css';
import './common.css';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <>
      <h1>MERN Task Manager</h1>
      <p>
        <Link to='auth'>Sign Up / Log In</Link>
      </p>
    </>
  );
}

export default App;
