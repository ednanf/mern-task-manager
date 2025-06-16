import styles from './FetchTasksSpinner.module.css';

const FetchTasksSpinner = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.item1}></div>
      <div className={styles.item2}></div>
      <div className={styles.item3}></div>
    </div>
  );
};

export default FetchTasksSpinner;
