import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CoinMarketData = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('market_cap_desc'); // Initial sort

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: sortCriteria, // Use state variable for sort
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [sortCriteria]); // Refetch data on sort change

  const filteredData = data.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const sortData = (criteria) => {
    if (criteria === 'market_cap') {
      return [...data].sort((a, b) => b.market_cap - a.market_cap);
    } else if (criteria === 'price_change_percentage_24h') {
      return [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    }
    return data; // Default sort (no change)
  };

  const sortedData = sortData(sortCriteria);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by Name or Symbol"
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Image</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Volume (USD)</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.id}</td>
              <td><img src={coin.image} alt={coin.name} /></td>
              <td>{coin.symbol}</td>
              <td>{coin.current_price}</td>
              <td>{coin.total_volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleSortChange('market_cap')}>Sort by Market Cap</button>
      <button onClick={() => handleSortChange('price_change_percentage_24h')}>
        Sort by Percentage Change (24h)
      </button>
    </div>
  );
};

export default CoinMarketData;