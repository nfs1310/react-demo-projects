import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getCryptoById, gettDataForChart } from '../api/coinGecko';
import type Coin from '../interfaces/Coin';
import { formatPrice } from '../utils/formatter';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type MarketChart from '../interfaces/MarketChart';

interface ChartDataPoint {
  time: string;
  price: number;
}

const CoinDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coin, setCoin] = useState<Coin>();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    void getCryptoById(id)
      .then((data) => {
        if (cancelled || !data) return;
        setCoin(data);
      })
      .catch((err) => console.error('Error fetching data: ', err));

    void gettDataForChart(id)
      .then((data: MarketChart) => {
        if (cancelled) return;
        setChartData(
          data.prices.map((price) => ({
            time: new Date(price[0]).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            price: price[1],
          })),
        );
      })
      .catch((err) => console.error('Error fetching data: ', err))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Crypto Data ...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin not found !!</p>
          <button
            onClick={() => {
              void navigate('/');
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isNegative = priceChange < 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <button onClick={() => void navigate('/')} className="back-button">
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
        <div className="coin-price-section">
          <div className="current-price">
            <h2>{formatPrice(coin.market_data.current_price.usd)}</h2>
            <span className={`change-badge ${isNegative ? 'negative' : 'positive'}`}>
              {isNegative ? '↓' : '↑'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">{formatPrice(coin.market_data.high_24h.usd)}</span>
            </div>
            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">{formatPrice(coin.market_data.low_24h.usd)}</span>
            </div>
          </div>
        </div>
        <div className="chart-section">
          <h3>Price Chart (7 Days)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
