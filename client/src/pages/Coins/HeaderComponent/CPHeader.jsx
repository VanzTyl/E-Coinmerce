/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import styles from './cpheader.module.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const CPHeader = ({ coinData, balance }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className={styles.header}>
            <div className={styles.logo}><h1 onClick={() => navigate('/main')}>E-Coinmerce</h1></div>
            <h2 className={styles.coinName}>{coinData?.coin_name} | {coinData?.coin_symbol}</h2>
            <div className={styles.buttons_container}>
                <button>Balance: ${balance.toFixed(2)}</button>
                <motion.button whileHover={{ scale: 0.9 }} onClick={handleLogout}>Log Out</motion.button>
            </div>
        </div>
    );
};

export default CPHeader;
