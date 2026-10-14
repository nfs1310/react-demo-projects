import { useEffect, useState } from 'react';
import { getCryptoData } from '../api/coinGecko';
import type Coin from '../interfaces/Crypto';
import CryptoCard from '../components/CryptoCard';

const Home = () => {
  const [cryptoList, setCryptoList] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<string>('grid');
  const [sortBy, setSortBy] = useState<string>('market_cap_rank');
  const [filteredList, setFilteredList] = useState<Coin[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);

  const loadCryptoData = async () => {
    try {
      const data: Coin[] = await getCryptoData();
      if (data) {
        setCryptoList(data);
        console.log(data);
      }
    } catch (err) {
      console.error('Error fetching data: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const runUpdate = () => {
      void loadCryptoData();
      setUpdatedTime(new Date().toLocaleTimeString());
    };
    runUpdate();
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 30) {
      void loadCryptoData();
      setUpdatedTime(new Date().toLocaleTimeString());
    }
  }, [countdown]); // eslint-disable-line react-hooks/set-state-in-effect

  useEffect(() => {
    const filterAndSort = () => {
      const filteredData = cryptoList.filter(
        (c) =>
          c.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
          c.symbol.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()),
      );
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.current_price - b.current_price;
          case 'price_desc':
            return b.current_price - a.current_price;
          case 'change':
            return a.price_change_percentage_24h - b.price_change_percentage_24h;
          case 'market_cap':
            return a.market_cap - b.market_cap;
          default:
            return a.market_cap_rank - b.market_cap_rank;
        }
      });
      setFilteredList(filteredData);
    };
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptos by name ..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>
      <div className="controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>
        </div>

        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
            Grid
          </button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            List
          </button>
        </div>
      </div>
      <div className="update-status">
        <span className="update-time">Last updated on {updatedTime}</span>
        <span className="update-countdown">Next update in {countdown}s</span>
        <div className="update-progress">
          <div className="update-progress-fill" style={{ width: `${(countdown / 30) * 100}%` }}></div>
        </div>
      </div>
      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Crypto Data ...</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode === 'grid' ? 'grid' : 'list'}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>
      )}

      <footer className="footer">
        <p>Data provided by CoinGecko API • Updated every 30 seconds</p>
      </footer>
    </div>
  );
};

export default Home;
