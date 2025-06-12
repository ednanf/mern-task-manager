import styles from './TaskButton.module.css';

// TODO: style button

const TaskButton = ({
  type,
  disabled,
  onClick,
  ariaLabel,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={styles.roundButton}
      {...rest}
    >
      <span className={styles.i}>{children}</span>
    </button>
  );
};

export default TaskButton;
