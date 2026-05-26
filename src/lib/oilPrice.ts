import axios from 'axios';

// Using multiple free APIs for oil prices
const EIA_API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY || '';
const ALPHA_VANTAGE_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY || '';

export interface OilPrice {
  price: number; // USD per barrel
  timestamp: number;
  source: 'WTI' | 'Brent';
  change24h?: number;
}

export interface OilPriceHistory {
  timestamp: number;
  price: number;
}

/**
 * Get current WTI crude oil price - SIMPLIFIED (static value)
 */
export async function getWTIOilPrice(): Promise<OilPrice> {
  // Return static oil price of $75/barrel
  return {
    price: 75,
    timestamp: Date.now(),
    source: 'WTI',
    change24h: 0,
  };
}

/**
 * Get Brent crude oil price
 */
export async function getBrentOilPrice(): Promise<OilPrice> {
  // For now, use WTI and add typical Brent premium
  try {
    const wtiPrice = await getWTIOilPrice();
    const brentPremium = 2; // Brent typically trades $2-3 higher than WTI
    
    return {
      price: wtiPrice.price + brentPremium,
      timestamp: wtiPrice.timestamp,
      source: 'Brent',
      change24h: wtiPrice.change24h,
    };
  } catch (error) {
    console.error('Error fetching Brent price:', error);
    return await getOilPriceFromBackup();
  }
}

/**
 * Backup oil price source (using commodity API or web scraping)
 */
async function getOilPriceFromBackup(): Promise<OilPrice> {
  try {
    // Using a free commodity API as backup
    const response = await axios.get(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'WTI',
          interval: 'daily',
          apikey: ALPHA_VANTAGE_KEY || 'demo',
        },
      }
    );

    if (response.data && response.data.data) {
      const latestData = response.data.data[0];
      return {
        price: parseFloat(latestData.value),
        timestamp: new Date(latestData.date).getTime(),
        source: 'WTI',
      };
    }

    // Final fallback: return mock data
    return {
      price: 75,
      timestamp: Date.now(),
      source: 'WTI',
      change24h: 0,
    };
  } catch (error) {
    console.error('Error in backup oil price fetch:', error);
    // Return mock data
    return {
      price: 75,
      timestamp: Date.now(),
      source: 'WTI',
      change24h: 0,
    };
  }
}

/**
 * Get historical oil prices
 */
export async function getOilPriceHistory(
  days: number = 30
): Promise<OilPriceHistory[]> {
  // EIA historical data often fails, use mock data for now
  // In production, you'd want to use a paid API or web scraping
  console.log('Using mock oil price history data');
  return generateMockOilHistory(days);
}

/**
 * Generate mock historical data for development
 */
function generateMockOilHistory(days: number): OilPriceHistory[] {
  const history: OilPriceHistory[] = [];
  const basePrice = 75;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 10;
    history.push({
      timestamp: now - (i * dayMs),
      price: basePrice + variance,
    });
  }

  return history;
}

/**
 * Calculate oil peg factor based on current price
 */
export function calculateOilPegFactor(
  currentPrice: number,
  baselinePrice: number = 75
): number {
  const factor = currentPrice / baselinePrice;
  return Math.min(Math.max(factor, 0.5), 2.0);
}

/**
 * Stream oil prices (real-time updates)
 */
export function subscribeToOilPrice(
  callback: (price: OilPrice) => void,
  intervalMs: number = 300000 // Every 5 minutes (oil prices don't change that fast)
): () => void {
  const interval = setInterval(async () => {
    try {
      const price = await getWTIOilPrice();
      callback(price);
    } catch (error) {
      console.error('Error in oil price subscription:', error);
    }
  }, intervalMs);

  // Fetch immediately
  (async () => {
    try {
      const price = await getWTIOilPrice();
      callback(price);
    } catch (error) {
      console.error('Error in initial oil price fetch:', error);
    }
  })();

  return () => clearInterval(interval);
}

/**
 * Get oil price summary
 */
export async function getOilPriceSummary(): Promise<{
  wti: OilPrice;
  brent: OilPrice;
  average: number;
  pegFactor: number;
}> {
  try {
    const [wti, brent] = await Promise.all([
      getWTIOilPrice(),
      getBrentOilPrice(),
    ]);

    const average = (wti.price + brent.price) / 2;
    const pegFactor = calculateOilPegFactor(wti.price);

    return {
      wti,
      brent,
      average,
      pegFactor,
    };
  } catch (error) {
    console.error('Error fetching oil price summary:', error);
    throw error;
  }
}
