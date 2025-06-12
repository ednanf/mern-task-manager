import styles from './TaskCheckbox.module.css';

const TaskCheckbox = ({ id, name, checked, onChange, disabled }) => {
  return (
    <label className={styles.container}>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkBox}
      />
      <div className={styles.checkmark}></div>
    </label>
  );
};

export default TaskCheckbox;
