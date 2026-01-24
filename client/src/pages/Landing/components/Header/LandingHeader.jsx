import styles from './landingheader.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingHeader = () => {

  const navigate = useNavigate();

  return (
    <div className={styles.header}>

      <div className={styles.logo}>
        <motion.svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 22 22" animate={{ y: [-1, 0.5, -1] }} initial={{ y: 0 }} transition={{ duration: 0.75, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}>
          <path fill="var(--primary)" d="M12 14h-2v-1H9v-1H8v-2h1V9h1V8h2v1h1v1h1v2h-1v1h-1Zm3 5H7v-1H6v-1H5v-1H4v-1H3V7h1V6h1V5h1V4h1V3h8v1h1v1h1v1h1v1h1v8h-1v1h-1v1h-1v1h-1Zm-3-7v-2h-2v2Zm2 5v-1h1v-1h1v-1h1V8h-1V7h-1V6h-1V5H8v1H7v1H6v1H5v6h1v1h1v1h1v1Z" />
        </motion.svg>
        <h1>E-Coinmerce</h1>
      </div>

      <div className={styles.box}>
      </div>

      <div className={styles.box}>
        <motion.button onClick={() => navigate('/login')} whileHover={{ scale: 1.1, backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}>Login</motion.button>
        <motion.button onClick={() => navigate('/register')} whileHover={{ scale: 1.1, backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}>Sign Up</motion.button>
      </div>
      
    </div>
  )
}

export default LandingHeader