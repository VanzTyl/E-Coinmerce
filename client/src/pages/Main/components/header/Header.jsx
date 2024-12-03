import styles from './header.module.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const [headerHeight, setHeaderHeight] = useState('10%');
    const [userName, setUserName] = useState('Guest');
    const navigate = useNavigate();
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
  
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                try {
                    // Decode token to get userId
                    const tokenData = JSON.parse(atob(token.split('.')[1]));
                    const userId = tokenData.userId; // Note: removed .data since your token structure is different
                    
                    // Fetch user details
                    const response = await fetch(`http://localhost:3000/users/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserName(data.data.user.username || 'Guest');
                    } else {
                        console.error('Failed to fetch user details');
                        setUserName('Guest');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                    setUserName('Guest');
                }
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
      
        const handleScroll = () => {
        // Check if the page has been scrolled
        const isScrolled = window.scrollY > 0;

        // Set the header height based on scroll position
        if (isScrolled) {
            setHeaderHeight('7.5%'); // Shrink the header when scrolled
        } else {
            setHeaderHeight('10%'); // Keep the initial height when at the top
        }
        };

        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when the component is unmounted
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

  return (
    <motion.div className={styles.header} initial={{ opacity: 0 }} animate={{ opacity: 1, height: headerHeight}} transition={{ opacity: { delay: .65 }, height: { delay: .01} }}>
      <motion.div className={styles.logo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ opacity: { delay: 1 } }}>
        <motion.svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 22 22" animate={{ y: [-1, 0.5, -1] }} initial={{ y: 0 }} transition={{ duration: 0.75, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}>
          <path fill="var(--primary)" d="M12 14h-2v-1H9v-1H8v-2h1V9h1V8h2v1h1v1h1v2h-1v1h-1Zm3 5H7v-1H6v-1H5v-1H4v-1H3V7h1V6h1V5h1V4h1V3h8v1h1v1h1v1h1v1h1v8h-1v1h-1v1h-1v1h-1Zm-3-7v-2h-2v2Zm2 5v-1h1v-1h1v-1h1V8h-1V7h-1V6h-1V5H8v1H7v1H6v1H5v6h1v1h1v1h1v1Z" />
        </motion.svg>
        <h1>E-Coinmerce</h1>
      </motion.div>
      <div className={styles.cta_box}>
      </div>
      <div className={styles.cta_box2}>
        <motion.div className={styles.login_button}>
          Welcome {userName}!
        </motion.div>
        <motion.div 
            className={styles.login_button} 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--primary)', color: 'var(--secondary)' }}
            onClick={handleLogout}
        >
          Sign Out
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
