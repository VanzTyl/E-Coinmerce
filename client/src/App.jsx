import { useState, useEffect } from 'react';

function App() {
  const [coins, setCoins] = useState([]);  // State to store coin data
  const [error, setError] = useState(null);

  // Fetch the latest coin prices on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/coins/latest')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch coins');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);  // Log the fetched data to the console
        setCoins(data);  // Update state with the data
      })
      .catch(err => {
        console.error(err);  // Log any errors
        setError(err.message);
      });
  }, []);

  return (
    <div className="App">
      <h1>Latest Coin Prices</h1>
      {error && <p>Error: {error}</p>}  {/* Display error if any */}
      {coins.length > 0 ? (
        <ul>
          {coins.map(coin => (
            <li key={coin.coin_id}>
              <strong>{coin.coin_id}</strong>: {coin.value} USD
              <br />
              <small>Last Updated: {new Date(coin.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading coins...</p> 
      )}
    </div>
  );
}

export default App;
