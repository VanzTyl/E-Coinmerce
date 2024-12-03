import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import CPHeader from './HeaderComponent/CPHeader';
import CPTransaction from './TransactionComponent/CPTransaction';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    annotationPlugin
);

const CoinPage = () => {
    const { coinSymbol } = useParams();
    const [coinData, setCoinData] = useState();
    const [error, setError] = useState(null);
    const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
    const [balance, setBalance] = useState(0);

    // Add function to refresh balance
    const refreshBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

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
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Initial balance fetch
    useEffect(() => {
        refreshBalance();
    }, []);

    // First load - get historical data
    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/coins/latest/${coinSymbol}`);
                setCoinData(response.data);
                setIsInitialDataLoaded(true);
            } catch (error) {
                console.error('Error fetching historical data:', error);
                setError(error.response?.data?.message || 'Failed to fetch historical data');
            }
        };

        fetchHistoricalData();
    }, [coinSymbol]);

    // After initial load - update with new prices
    useEffect(() => {
        if (!isInitialDataLoaded) return;

        let isMounted = true;
        
        const fetchLatestPrice = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/coins/latest/${coinSymbol}?limit=1`);
                if (isMounted && response.data.prices.length > 0) {
                    const latestPrice = response.data.prices[response.data.prices.length - 1];
                    
                    setCoinData(prevData => {
                        if (!prevData) return response.data;
                        
                        // Add new price only if it's different from the last one
                        const lastPrice = prevData.prices[prevData.prices.length - 1];
                        if (lastPrice.createdAt !== latestPrice.createdAt) {
                            return {
                                ...prevData,
                                prices: [...prevData.prices, latestPrice]
                            };
                        }
                        return prevData;
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching latest price:', error);
                    setError(error.response?.data?.message || 'Failed to fetch latest price');
                }
            }
        };

        const interval = setInterval(fetchLatestPrice, 500);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [coinSymbol, isInitialDataLoaded]);

    const currentPrice = coinData?.prices[coinData.prices.length - 1]?.price;

    const chartData = {
        labels: coinData?.prices.map((_, index) => index + 1) || [],
        datasets: [
            {
                label: `${coinSymbol} Price`,
                data: coinData?.prices.map(price => price.price) || [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointRadius: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${coinSymbol} Price History`,
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: currentPrice,
                        yMax: currentPrice,
                        borderColor: 'lightgreen',
                        borderWidth: 2,
                        label: {
                            content: `Current Price: $${currentPrice}`,
                            enabled: true,
                            position: 'end'
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                display: true,
                title: {
                    display: true,
                    text: 'Data Points'
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 15,
                },
            },
            y: {
                beginAtZero: false,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 8,
                },
            },
        },
        animation: false
    };

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!coinData) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <CPHeader coinData={coinData} balance={balance} />
            <div style={{ width: '80%', margin: '0 auto', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Line data={chartData} options={chartOptions} />
            </div>
            <CPTransaction 
                coinData={coinData} 
                onPositionUpdate={refreshBalance} 
            />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default CoinPage;
