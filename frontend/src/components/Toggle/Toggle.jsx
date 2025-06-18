import { FiSun, FiMoon } from 'react-icons/fi';
import styles from './Toggle.module.css';

const Toggle = ({ checked, onChange }) => {
  return (
    <label className={styles.label}>
      <div className={styles.toggle}>
        <input
          className={styles['toggle-state']}
          type='checkbox'
          name='theme-toggle'
          checked={checked}
          onChange={onChange}
        />
        <div className={styles.indicator}>
          <FiSun className={styles.sunIcon} />
          <FiMoon className={styles.moonIcon} />
        </div>
      </div>
    </label>
  );
};

export default Toggle;
