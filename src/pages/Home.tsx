import { useEffect, useState } from 'react'
import { getCryptoData } from '../api/coinGecko';
import type Coin from '../interfaces/Crypto';
import CryptoCard from '../components/CryptoCard';

const Home = () => {
    const [cryptoList, setCryptoList] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadCryptoData();
    }, []);

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

    return (
        <div className='app'>
            {/* <h1>Home</h1>
            {} */}
            {isLoading ? (
                <div className='loading'>
                    <div className='spinner'></div>
                    <p>Loading Crypto Data ...</p>
                </div>
            ) : (
                <div className='crypto-container'>
                    {cryptoList.map((crypto, key) => (
                        <CryptoCard crypto={crypto} key={key} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home
