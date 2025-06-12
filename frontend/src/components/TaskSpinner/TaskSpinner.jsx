import styles from './TaskSpinner.module.css';

const TaskSpinner = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.d1} />
      <div className={styles.d2} />
    </div>
  );
};

export default TaskSpinner;
