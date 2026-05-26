import axios from 'axios';

const ANKR_API_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY || '';

// Lista de RPCs con fallbacks
const RPC_ENDPOINTS = [
  `https://rpc.ankr.com/eth/${ANKR_API_KEY}`,
  'https://eth.llamarpc.com',
  'https://rpc.ankr.com/eth',
  'https://ethereum.publicnode.com',
  'https://eth.drpc.org',
];

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
 * Try multiple RPC endpoints until one works
 */
async function makeRpcCall(method: string, params: any[], maxRetries: number = 3): Promise<any> {
  for (const endpoint of RPC_ENDPOINTS) {
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        const response = await axios.post(
          endpoint,
          {
            jsonrpc: '2.0',
            method,
            params,
            id: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data && response.data.result !== undefined) {
          return response.data.result;
        }
      } catch (error) {
        console.warn(`RPC call failed for ${endpoint}, attempt ${retry + 1}/${maxRetries}:`, error);
        // Continue to next retry or endpoint
      }
    }
  }
  
  throw new Error(`All RPC endpoints failed for method: ${method}`);
}

/**
 * Get current gas price - SIMPLIFIED (static value)
 */
export async function getGasPrice(): Promise<AnkrGasPrice> {
  // Return static gas price of 30 gwei
  return {
    gasPrice: '30000000000', // 30 gwei in wei
    gasPriceGwei: 30,
    timestamp: Date.now(),
  };
}

/**
 * Get latest block data
 */
export async function getLatestBlock(): Promise<AnkrBlockData> {
  try {
    const block = await makeRpcCall('eth_getBlockByNumber', ['latest', false]);
    
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
    console.error('Error fetching block:', error);
    throw error;
  }
}

/**
 * Get ETH price in USD
 */
export async function getEthPrice(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { timeout: 10000 }
    );
    
    return response.data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    
    // Try alternative API
    try {
      const altResponse = await axios.get(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
        { timeout: 10000 }
      );
      return altResponse.data.USD;
    } catch (altError) {
      console.error('Alternative ETH price fetch failed:', altError);
      // Fallback price
      return 3000;
    }
  }
}

/**
 * Get HYPE price in USD from HypeEVM
 */
export async function getHypePrice(): Promise<number> {
  try {
    // Primero intentamos con CoinGecko para HYPE
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=hyperliquid&vs_currencies=usd',
      { timeout: 10000 }
    );
    
    return response.data.hyperliquid.usd;
  } catch (error) {
    console.error('Error fetching HYPE price from CoinGecko:', error);
    
    // Fallback a DexScreener - necesitarás reemplazar con la dirección correcta del token HYPE
    try {
      // Reemplaza 'HYPE_TOKEN_ADDRESS' con la dirección real del contrato de HYPE en HypeEVM
      const HYPE_TOKEN_ADDRESS = '0x...' // <- COLOCA AQUÍ LA DIRECCIÓN DEL TOKEN HYPE
      
      const dexResponse = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${HYPE_TOKEN_ADDRESS}`,
        { timeout: 10000 }
      );
      
      if (dexResponse.data.pairs && dexResponse.data.pairs.length > 0) {
        return parseFloat(dexResponse.data.pairs[0].priceUsd);
      }
    } catch (dexError) {
      console.error('Error fetching HYPE price from DexScreener:', dexError);
    }
    
    // Fallback price si todo falla
    return 0;
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

    // Fetch last N blocks (in smaller batches to avoid timeout)
    const batchSize = 5;
    for (let i = 0; i < blockCount; i += batchSize) {
      const batch = [];
      const end = Math.min(i + batchSize, blockCount);
      
      for (let j = i; j < end; j++) {
        const blockNumber = latestBlock.number - j;
        batch.push(
          makeRpcCall('eth_getBlockByNumber', [`0x${blockNumber.toString(16)}`, false])
        );
      }

      const blocks = await Promise.all(batch);
      
      blocks.forEach((block) => {
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
    }

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
