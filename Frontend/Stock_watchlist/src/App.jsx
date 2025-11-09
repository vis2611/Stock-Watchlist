import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [stocks, setStocks] = useState([]);
  const [stockName, setStockName] = useState('');
  const apiUrl = 'http://localhost:5000/stocks'; 


  useEffect(() => {
    fetchStocks();
  }, []);

 
  const fetchStocks = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        setStocks(data);
      } else {
        alert('Error fetching stocks');
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };


  const handleAddStock = async (e) => {
    e.preventDefault();
    const formattedStockName = stockName.toUpperCase().trim();


    if (formattedStockName.length < 1 || formattedStockName.length > 5) {
      alert('Stock name must be between 1 to 5 characters long.');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formattedStockName }),
      });

      if (response.ok) {
        setStockName('');
        fetchStocks(); 
      } else {
        alert('Error adding stock');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Stock Watchlist</h1>
      </header>
      <div className="form-container">
        <h2>Add Stock to Watchlist</h2>
        <form onSubmit={handleAddStock}>
          <input
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="Enter Stock Name (e.g., APPLE)"
            required
          />
          <button type="submit">Add Stock</button>
        </form>
      </div>
      <div className="watchlist">
        <h2>My Watchlist</h2>
        <ul>
          {stocks.map((stock) => (
            <li key={stock._id}>{stock.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
