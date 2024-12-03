/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import styles from './cptransaction.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CPTransaction = ({ coinData, onPositionUpdate }) => {
    const [amount, setAmount] = useState('');
    const [positions, setPositions] = useState([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchUserPositions();
    }, []);

    const fetchUserPositions = async () => {
        try {
            const token = localStorage.getItem('token');
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenData.userId;

            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setBalance(data.data.user.account_balance);
                if (data.data.user.account_data?.[0]?.positions) {
                    setPositions(data.data.user.account_data[0].positions.filter(
                        pos => pos.coin_id === coinData.coin_symbol
                    ));
                }
            }
        } catch (error) {
            console.error('Error fetching positions:', error);
            toast.error('Failed to fetch positions');
        }
    };

    const handleOpenPosition = async () => {
        try {
            const token = localStorage.getItem('token');
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenData.userId;

            const currentPrice = coinData.prices[coinData.prices.length - 1].price;
            const totalCost = currentPrice * parseFloat(amount);

            if (totalCost > balance) {
                toast.error('Insufficient balance');
                return;
            }

            const response = await fetch(`http://localhost:3000/users/${userId}/positions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    coin_id: coinData.coin_symbol,
                    bought_price: currentPrice,
                    bought_amount: parseFloat(amount),
                    total_cost: totalCost
                })
            });

            const data = await response.json();
            if (data.success) {
                setAmount('');
                fetchUserPositions();
                onPositionUpdate();
                toast.success('Position opened successfully!');
            } else {
                toast.error(data.message || 'Failed to open position');
            }
        } catch (error) {
            console.error('Error opening position:', error);
            toast.error('Failed to open position');
        }
    };

    const handleClosePosition = async (positionId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No authentication token found');
                return;
            }

            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const userId = tokenData.userId;
            const currentPrice = coinData.prices[coinData.prices.length - 1].price;

            const response = await fetch(`http://localhost:3000/users/${userId}/positions/${positionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPrice: currentPrice
                })
            });

            const data = await response.json();
            if (data.success) {
                fetchUserPositions();
                onPositionUpdate();
                toast.success('Position closed successfully!');
            } else {
                toast.error(data.message || 'Failed to close position');
            }
        } catch (error) {
            console.error('Error closing position:', error);
            toast.error(error.message || 'Failed to close position');
        }
    };

    const calculateProfitLoss = (position) => {
        const currentPrice = coinData.prices[coinData.prices.length - 1].price;
        return ((currentPrice - position.bought_price) * position.bought_amount).toFixed(6);
    };

    return (
        <div className={styles.transaction}>
            <div className={styles.open_transaction}>
                <button 
                    className={styles.open_button}
                    onClick={handleOpenPosition}
                    disabled={!amount || isNaN(amount)}
                >
                    Open
                </button>
                <input 
                    type="number" 
                    className={styles.amount_input}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                />
            </div>
            <div className={styles.position_listing}>
                <div className={styles.position_tab_header}>Current Positions</div>
                <div className={styles.position_tab_container}>
                    {positions.map((position) => (
                        <div key={position.position_id} className={styles.position_tab}>
                            <p>{parseFloat(position.bought_amount).toFixed(0)}</p>
                            <p>${parseFloat(position.bought_price).toFixed(6)}</p>
                            <p>${parseFloat(coinData.prices[coinData.prices.length - 1].price).toFixed(6)}</p>
                            <p>${calculateProfitLoss(position)}</p>
                            <button onClick={() => handleClosePosition(position.position_id)}>
                                Close Position
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CPTransaction;
