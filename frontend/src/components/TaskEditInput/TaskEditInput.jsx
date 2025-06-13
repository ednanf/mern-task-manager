import { useEffect, useState } from 'react';
import styles from './TaskEditInput.module.css';

const TaskEditInput = ({ id, value, onChange, onKeyDown }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger the animation after mount
    const timeout = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <input
      type='text'
      name='editTitle'
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`${styles.input} ${animate ? styles.editing : ''}`}
    />
  );
};

export default TaskEditInput;
