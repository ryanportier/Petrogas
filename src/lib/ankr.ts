import axios from 'axios';

const ANKR_API_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY || '';
const ANKR_ENDPOINT = 'https://rpc.ankr.com/eth';

export interface AnkrGasPrice {
  gasPrice: string; // in wei
  gasPriceGwei: number;
  timestamp: number;
}

export interface AnkrBlockData {
  number: number;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas?: string;
}

export interface AnkrTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  timestamp: number;
}

/**
 * Get current gas price from Ankr
 */
export async function getGasPrice(): Promise<AnkrGasPrice> {
  try {
    const response = await axios.post(
      `${ANKR_ENDPOINT}/${ANKR_API_KEY}`,
      {
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 1,
      }
    );

    const gasPriceWei = parseInt(response.data.result, 16);
    const gasPriceGwei = gasPriceWei / 1e9;

    return {
      gasPrice: gasPriceWei.toString(),
      gasPriceGwei: Math.round(gasPriceGwei),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching gas price from Ankr:', error);
    throw error;
  }
}

/**
 * Get latest block data
 */
export async function getLatestBlock(): Promise<AnkrBlockData> {
  try {
    const response = await axios.post(
      `${ANKR_ENDPOINT}/${ANKR_API_KEY}`,
      {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      }
    );

    const block = response.data.result;
    
    return {
      number: parseInt(block.number, 16),
      timestamp: parseInt(block.timestamp, 16),
      gasUsed: parseInt(block.gasUsed, 16).toString(),
      gasLimit: parseInt(block.gasLimit, 16).toString(),
      baseFeePerGas: block.baseFeePerGas 
        ? parseInt(block.baseFeePerGas, 16).toString() 
        : undefined,
    };
  } catch (error) {
    console.error('Error fetching block from Ankr:', error);
    throw error;
  }
}

/**
 * Get ETH price in USD
 */
export async function getEthPrice(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Fallback price
    return 3000;
  }
}

/**
 * Get historical gas prices (last N blocks)
 */
export async function getHistoricalGasPrices(
  blockCount: number = 20
): Promise<AnkrGasPrice[]> {
  try {
    const latestBlock = await getLatestBlock();
    const prices: AnkrGasPrice[] = [];

    // Fetch last N blocks
    const promises = [];
    for (let i = 0; i < blockCount; i++) {
      const blockNumber = latestBlock.number - i;
      promises.push(
        axios.post(`${ANKR_ENDPOINT}/${ANKR_API_KEY}`, {
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [`0x${blockNumber.toString(16)}`, false],
          id: i,
        })
      );
    }

    const responses = await Promise.all(promises);

    responses.forEach((response) => {
      const block = response.data.result;
      if (block && block.baseFeePerGas) {
        const baseFee = parseInt(block.baseFeePerGas, 16);
        const gasPriceGwei = baseFee / 1e9;
        
        prices.push({
          gasPrice: baseFee.toString(),
          gasPriceGwei: Math.round(gasPriceGwei),
          timestamp: parseInt(block.timestamp, 16) * 1000,
        });
      }
    });

    return prices.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error fetching historical gas prices:', error);
    return [];
  }
}

/**
 * Get average gas price over time period
 */
export async function getAverageGasPrice(
  minutes: number = 60
): Promise<number> {
  try {
    const prices = await getHistoricalGasPrices(20);
    
    if (prices.length === 0) return 45; // fallback

    const sum = prices.reduce((acc, price) => acc + price.gasPriceGwei, 0);
    return Math.round(sum / prices.length);
  } catch (error) {
    console.error('Error calculating average gas price:', error);
    return 45;
  }
}

/**
 * Stream gas prices (for real-time updates)
 */
export function subscribeToGasPrices(
  callback: (price: AnkrGasPrice) => void,
  intervalMs: number = 12000 // Every ~1 block (12 seconds)
): () => void {
  const interval = setInterval(async () => {
    try {
      const price = await getGasPrice();
      callback(price);
    } catch (error) {
      console.error('Error in gas price subscription:', error);
    }
  }, intervalMs);

  // Fetch immediately on first call
  (async () => {
    try {
      const price = await getGasPrice();
      callback(price);
    } catch (error) {
      console.error('Error in initial gas price fetch:', error);
    }
  })();

  // Return cleanup function
  return () => clearInterval(interval);
}