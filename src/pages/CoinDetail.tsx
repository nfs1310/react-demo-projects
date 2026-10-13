import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getCryptoById } from '../api/coinGecko';
import type Coin from '../interfaces/Coin';
import { formatPrice } from '../utils/formatter';

const CoinDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coin, setCoin] = useState<Coin>();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (id) {
      try {
        const data: Coin = await getCryptoById(id);
        if (data) {
          setCoin(data);
          console.log(data);
        }
      } catch (err) {
        console.error('Error fetching data: ', err);
      } finally {
        setIsLoading(false);
      }
    }

  };

  if (isLoading) {
    return (
      <div className='app'>
        <div className='loading'>
          <div className='spinner'></div>
          <p>Loading Crypto Data ...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className='app'>
        <div className='no-results'>
          <p>Coin not found !!</p>
          <button onClick={() => { navigate('/') }}>Go Back</button>
        </div>
      </div>
    )
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange < 0;

  return (
    <div className='app'>
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <button onClick={() => navigate("/")} className="back-button">
            ← Back to List
          </button>
        </div>
      </header>
      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>
          <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
        </div>
        <div className='coin-price-section'>
          <div className='current-price'>
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span className={`change-badge ${isPositive ? 'negative' : 'positive'}`}>
              {isPositive ? '↓' : '↑'}
              {" "}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>3
          <div className='price-ranges'>
            <div className='price-range'>
              <div className='range-label'>24h High</div>
              <div className='range-value'>{formatPrice(coin.market_data.high_24h.usd)}</div>
            </div>
            <div className='price-range'>
              <div className='range-label'>24h Low</div>
              <div className='range-value'>{formatPrice(coin.market_data.low_24h.usd)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    

  )
}

export default CoinDetail