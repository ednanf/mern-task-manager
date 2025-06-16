import styles from './AuthInput.module.css';

const AuthInput = ({ id, type, name, value, onChange }) => {
  return (
    <div className={styles.authInput}>
      <label htmlFor={id}>{name}</label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.inputField}
        autoComplete={name === 'email' ? 'email' : name === 'password' ? 'new-password' : 'name'}
        required
      />
    </div>
  );
};

export default AuthInput;
