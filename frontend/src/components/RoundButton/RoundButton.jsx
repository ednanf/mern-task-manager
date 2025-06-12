import styles from './RoundButton.module.css';

const Button = ({ type, onClick, children, ariaLabel, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={styles.roundButton}
      {...rest}
    >
      <span className={styles.i}>{children}</span>
    </button>
  );
};

export default Button;
