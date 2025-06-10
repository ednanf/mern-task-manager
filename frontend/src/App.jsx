import styles from './App.module.css'

function App() {
  return (
  <div className={styles.appContainer}>
    <div className={styles.backgroundLayer} />
    <div className={styles.foregroundLayer}></div>
  </div>
  )
}

export default App
