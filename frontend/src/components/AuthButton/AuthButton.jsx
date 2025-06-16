import styles from './AuthButton.module.css';

const AuthButton = ({ children }) => {
  return (
    <button type='submit' className={styles.authButton}>
      {children}
    </button>
  );
};

export default AuthButton;
