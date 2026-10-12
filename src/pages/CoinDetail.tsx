import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getCryptoById } from '../api/coinGecko';
import type Crypto from '../interfaces/Crypto';

const CoinDetail = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coin, setCoin] = useState<Crypto>();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (id) {
      try {
        const data: Crypto = await getCryptoById(id);
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
      <div className='loading'>
        <div className='spinner'></div>
        <p>Loading Crypto Data ...</p>
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

  return (
    <div>This is the coin page {id}</div>
    // { <div>CoinDetail</div>
    // {isLoading ? (
    //   <div className='loading'>
    //     <div className='spinner'></div>
    //     <p>Loading Crypto Data ...</p>
    //   </div>
    // ) : (
    //   <div className={`crypto-container ${viewMode === 'grid' ? 'grid' : 'list'}`}>
    //     {filteredList.map((crypto, key) => (
    //       <CryptoCard crypto={crypto} key={key} />
    //     ))}
    //   </div>
    // )} }

  )
}

export default CoinDetail