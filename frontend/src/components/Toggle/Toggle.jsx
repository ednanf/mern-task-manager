import styles from './Toggle.module.css';

const Toggle = () => {
  return (
    <>
      <label class='label'>
        <div class='toggle'>
          <input class='toggle-state' type='checkbox' name='check' value='check'></input>
          <div class='indicator'></div>
        </div>
      </label>
    </>
  );
};

export default Toggle;
