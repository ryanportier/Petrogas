import axios from 'axios';

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

export interface TokenMetrics {
  price: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  liquidity: number;
  priceChange24h: number;
  txns24h: number;
  fdv: number;
  timestamp: number;
}

/**
 * Get token data from DexScreener by token address
 */
export async function getTokenData(
  tokenAddress: string
): Promise<DexScreenerPair | null> {
  try {
    const response = await axios.get(
      `${DEXSCREENER_API}/tokens/${tokenAddress}`
    );

    if (response.data.pairs && response.data.pairs.length > 0) {
      // Return the pair with highest liquidity
      const pairs = response.data.pairs.sort(
        (a: DexScreenerPair, b: DexScreenerPair) => 
          (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
      return pairs[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching token data from DexScreener:', error);
    return null;
  }
}

/**
 * Get token data by pair address
 */
export async function getPairData(
  pairAddress: string
): Promise<DexScreenerPair | null> {
  try {
    const response = await axios.get(
      `${DEXSCREENER_API}/pairs/ethereum/${pairAddress}`
    );

    if (response.data.pair) {
      return response.data.pair;
    }

    return null;
  } catch (error) {
    console.error('Error fetching pair data from DexScreener:', error);
    return null;
  }
}

/**
 * Search for token by symbol or name
 */
export async function searchToken(
  query: string
): Promise<DexScreenerPair[]> {
  try {
    const response = await axios.get(
      `${DEXSCREENER_API}/search?q=${encodeURIComponent(query)}`
    );

    return response.data.pairs || [];
  } catch (error) {
    console.error('Error searching token:', error);
    return [];
  }
}

/**
 * Get formatted token metrics for dashboard
 */
export async function getTokenMetrics(
  tokenAddress: string
): Promise<TokenMetrics | null> {
  try {
    const pairData = await getTokenData(tokenAddress);
    
    if (!pairData) return null;

    // Calculate total transactions
    const txns24h = 
      (pairData.txns.h24?.buys || 0) + 
      (pairData.txns.h24?.sells || 0);

    return {
      price: parseFloat(pairData.priceUsd || '0'),
      marketCap: pairData.marketCap || 0,
      holders: 0, // DexScreener doesn't provide holders, need to get from blockchain
      volume24h: pairData.volume.h24 || 0,
      liquidity: pairData.liquidity?.usd || 0,
      priceChange24h: pairData.priceChange.h24 || 0,
      txns24h,
      fdv: pairData.fdv || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting token metrics:', error);
    return null;
  }
}

/**
 * Get number of holders from Ankr
 */
export async function getHoldersCount(
  tokenAddress: string
): Promise<number> {
  try {
    // This would require Ankr's token holders endpoint
    // For now, return a mock value
    // In production, use: await ankr.getTokenHolders(tokenAddress)
    return 1250; // Mock value
  } catch (error) {
    console.error('Error fetching holders count:', error);
    return 0;
  }
}

/**
 * Stream token metrics (real-time updates)
 */
export function subscribeToTokenMetrics(
  tokenAddress: string,
  callback: (metrics: TokenMetrics) => void,
  intervalMs: number = 30000 // Every 30 seconds
): () => void {
  const interval = setInterval(async () => {
    try {
      const metrics = await getTokenMetrics(tokenAddress);
      if (metrics) {
        // Fetch holders separately and add to metrics
        const holders = await getHoldersCount(tokenAddress);
        callback({ ...metrics, holders });
      }
    } catch (error) {
      console.error('Error in token metrics subscription:', error);
    }
  }, intervalMs);

  // Fetch immediately
  (async () => {
    try {
      const metrics = await getTokenMetrics(tokenAddress);
      if (metrics) {
        const holders = await getHoldersCount(tokenAddress);
        callback({ ...metrics, holders });
      }
    } catch (error) {
      console.error('Error in initial token metrics fetch:', error);
    }
  })();

  return () => clearInterval(interval);
}

/**
 * Get trending pairs on Ethereum
 */
export async function getTrendingPairs(limit: number = 10): Promise<DexScreenerPair[]> {
  try {
    // DexScreener doesn't have a direct trending endpoint
    // We'll search for popular tokens and sort by volume
    const response = await axios.get(
      `${DEXSCREENER_API}/search?q=ethereum`
    );

    if (response.data.pairs) {
      return response.data.pairs
        .filter((p: DexScreenerPair) => p.chainId === 'ethereum')
        .sort((a: DexScreenerPair, b: DexScreenerPair) => 
          (b.volume.h24 || 0) - (a.volume.h24 || 0)
        )
        .slice(0, limit);
    }

    return [];
  } catch (error) {
    console.error('Error fetching trending pairs:', error);
    return [];
  }
}
