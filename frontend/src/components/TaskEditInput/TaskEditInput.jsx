import styles from './TaskEditInput.module.css';

const TaskEditInput = ({ id, value, onChange, onKeyDown }) => {
  return (
    <input
      type='text'
      name='editTitle'
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={styles.input}
    />
  );
};

export default TaskEditInput;
