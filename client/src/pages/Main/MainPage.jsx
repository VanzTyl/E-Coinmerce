import { useState, useEffect } from 'react'
import styles from './mainpage.module.css'
import Header from './components/header/Header'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('http://localhost:3000/coins/minimal');
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    // Initial fetch
    fetchCoins();

    // Set up interval for repeated fetches
    const intervalId = setInterval(fetchCoins, 1000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.main_page}>
      <Header />
      <div className={styles.coins_container}>
        {coins.map((coin) => (
          <motion.div 
            key={coin._id} 
            className={styles.coinCard} 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}
            onClick={() => navigate(`/${coin.coin_symbol}`)}
            style={{ cursor: 'pointer' }}
          >
            <p>{coin.coin_name} | {coin.coin_symbol}</p>
            <p>${coin.latest_price ? coin.latest_price.toFixed(6) : 'N/A'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MainPage
