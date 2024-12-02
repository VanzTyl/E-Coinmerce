import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register the necessary chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [coins, setCoins] = useState([]); // State to store coin data
  const [error, setError] = useState(null); // Error state for fetching issues
  const [chartData, setChartData] = useState({}); // State to store chart data

  // Fetch the latest coin prices every second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/coins/latest')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch coins');
          }
          return response.json();
        })
        .then(data => {
          // Log the fetched data for debugging
          console.log(data);
          setCoins(data); // Update state with the latest data

          // Prepare chart data
          const updatedChartData = {
            labels: data.map(coin => coin.coin_id), // Coin IDs as labels
            datasets: data.map(coin => ({
              label: coin.coin_id,
              data: [coin.value], // Latest value as the data point
              borderColor: 'rgb(75, 192, 192)', // Line color
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under the line
              fill: true,
              tension: 0.1,
            })),
          };

          setChartData(updatedChartData); // Update chart data
        })
        .catch(err => {
          console.error(err);
          setError(err.message);
        });
    }, 1000); // Refresh data every 1000ms (1 second)

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Latest Coin Prices</h1>
      {error && <p>Error: {error}</p>} {/* Display error if any */}

      {/* Display chart */}
      {coins.length > 0 ? (
        <div>
          {/* Render Line chart */}
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Coin Price Tracker',
                },
                tooltip: {
                  callbacks: {
                    label: function(tooltipItem) {
                      return `${tooltipItem.dataset.label}: ${tooltipItem.raw} USD`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Coins',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Price (USD)',
                  },
                  min: 0, // Set minimum value for the Y-axis
                }
              }
            }}
          />
        </div>
      ) : (
        <p>Loading coins...</p>
      )}
    </div>
  );
}

export default App;