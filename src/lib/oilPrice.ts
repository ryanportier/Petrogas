import axios from 'axios';

// Using EIA (U.S. Energy Information Administration) API for oil prices
// Alternative: Alpha Vantage, Oilprice.com API
const EIA_API_KEY = process.env.NEXT_PUBLIC_EIA_API_KEY || '';
const EIA_API_BASE = 'https://api.eia.gov/v2';

// Backup: Use a financial data API
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
 * Get current WTI crude oil price from EIA
 */
export async function getWTIOilPrice(): Promise<OilPrice> {
  try {
    // EIA API endpoint for WTI spot price
    const response = await axios.get(
      `${EIA_API_BASE}/petroleum/pri/spt/data/`,
      {
        params: {
          api_key: EIA_API_KEY,
          frequency: 'daily',
          'data[0]': 'value',
          'facets[series][]': 'RWTC', // WTI Cushing, OK
          sort: 'period',
          length: 2, // Get last 2 days for change calculation
        },
      }
    );

    if (response.data.response?.data && response.data.response.data.length > 0) {
      const latestData = response.data.response.data[0];
      const previousData = response.data.response.data[1];
      
      const currentPrice = parseFloat(latestData.value);
      const previousPrice = previousData ? parseFloat(previousData.value) : currentPrice;
      const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;

      return {
        price: currentPrice,
        timestamp: new Date(latestData.period).getTime(),
        source: 'WTI',
        change24h,
      };
    }

    // Fallback to backup API
    return await getOilPriceFromBackup();
  } catch (error) {
    console.error('Error fetching WTI price from EIA:', error);
    return await getOilPriceFromBackup();
  }
}

/**
 * Get Brent crude oil price
 */
export async function getBrentOilPrice(): Promise<OilPrice> {
  try {
    const response = await axios.get(
      `${EIA_API_BASE}/petroleum/pri/spt/data/`,
      {
        params: {
          api_key: EIA_API_KEY,
          frequency: 'daily',
          'data[0]': 'value',
          'facets[series][]': 'RBRTE', // Brent Europe
          sort: 'period',
          length: 2,
        },
      }
    );

    if (response.data.response?.data && response.data.response.data.length > 0) {
      const latestData = response.data.response.data[0];
      const previousData = response.data.response.data[1];
      
      const currentPrice = parseFloat(latestData.value);
      const previousPrice = previousData ? parseFloat(previousData.value) : currentPrice;
      const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;

      return {
        price: currentPrice,
        timestamp: new Date(latestData.period).getTime(),
        source: 'Brent',
        change24h,
      };
    }

    return await getOilPriceFromBackup();
  } catch (error) {
    console.error('Error fetching Brent price from EIA:', error);
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
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await axios.get(
      `${EIA_API_BASE}/petroleum/pri/spt/data/`,
      {
        params: {
          api_key: EIA_API_KEY,
          frequency: 'daily',
          'data[0]': 'value',
          'facets[series][]': 'RWTC',
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          sort: 'period',
        },
      }
    );

    if (response.data.response?.data) {
      return response.data.response.data.map((item: any) => ({
        timestamp: new Date(item.period).getTime(),
        price: parseFloat(item.value),
      })).reverse(); // Sort oldest to newest
    }

    return [];
  } catch (error) {
    console.error('Error fetching oil price history:', error);
    // Return mock historical data
    return generateMockOilHistory(days);
  }
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
