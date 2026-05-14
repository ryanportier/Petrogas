'use client';

import { useState, useEffect } from 'react';
import { getGasPrice, getAverageGasPrice, subscribeToGasPrices, AnkrGasPrice, getHypePrice } from '@/lib/ankr';
import { getTokenMetrics, subscribeToTokenMetrics, TokenMetrics } from '@/lib/dexscreener';
import { getWTIOilPrice, subscribeToOilPrice, OilPrice, getOilPriceHistory, OilPriceHistory } from '@/lib/oilPrice';
import { calculateRefund, calculateOilPegFactor, calculateTimeMultiplier, calculateGweiEfficiency } from '@/lib/utils';

/**
 * Hook for real-time gas price
 */
export function useGasPrice(updateIntervalMs: number = 12000) {
  const [gasPrice, setGasPrice] = useState<AnkrGasPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const price = await getGasPrice();
        setGasPrice(price);
        setLoading(false);

        // Subscribe to updates
        unsubscribe = subscribeToGasPrices((newPrice) => {
          setGasPrice(newPrice);
        }, updateIntervalMs);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [updateIntervalMs]);

  return { gasPrice, loading, error };
}

/**
 * Hook for real-time HYPE price
 */
export function useEthPrice(updateIntervalMs: number = 30000) {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchPrice = async () => {
      try {
        const price = await getHypePrice();
        setEthPrice(price);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchPrice();
    interval = setInterval(fetchPrice, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  return { ethPrice, loading, error };
}

/**
 * Hook for real-time oil price
 */
export function useOilPrice(updateIntervalMs: number = 300000) {
  const [oilPrice, setOilPrice] = useState<OilPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const price = await getWTIOilPrice();
        setOilPrice(price);
        setLoading(false);

        // Subscribe to updates
        unsubscribe = subscribeToOilPrice((newPrice) => {
          setOilPrice(newPrice);
        }, updateIntervalMs);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [updateIntervalMs]);

  return { oilPrice, loading, error };
}

/**
 * Hook for oil price history
 */
export function useOilPriceHistory(days: number = 30) {
  const [history, setHistory] = useState<OilPriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getOilPriceHistory(days);
        setHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [days]);

  return { history, loading, error };
}

/**
 * Hook for token metrics (DexScreener)
 */
export function useTokenMetrics(
  tokenAddress: string,
  updateIntervalMs: number = 30000
) {
  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        const data = await getTokenMetrics(tokenAddress);
        setMetrics(data);
        setLoading(false);

        // Subscribe to updates
        unsubscribe = subscribeToTokenMetrics(
          tokenAddress,
          (newMetrics) => {
            setMetrics(newMetrics);
          },
          updateIntervalMs
        );
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tokenAddress, updateIntervalMs]);

  return { metrics, loading, error };
}

/**
 * Hook for real-time refund calculation
 */
export function useRefundCalculator() {
  const { gasPrice } = useGasPrice();
  const { ethPrice } = useEthPrice();
  const { oilPrice } = useOilPrice();

  const calculateReward = (
    gasUsed: number,
    stakeDays: number
  ): {
    feePaid: number;
    oilPegFactor: number;
    timeMultiplier: number;
    gweiEfficiency: number;
    finalRefund: number;
    roi: number;
  } | null => {
    if (!gasPrice || !ethPrice || !oilPrice) return null;

    // Calculate fee paid
    const gasPriceEth = gasPrice.gasPriceGwei * 1e-9;
    const feePaid = gasUsed * gasPriceEth * ethPrice;

    // Calculate multipliers
    const oilPegFactor = calculateOilPegFactor(oilPrice.price);
    const timeMultiplier = calculateTimeMultiplier(stakeDays);
    const avgGwei = 45; // You could make this dynamic
    const gweiEfficiency = calculateGweiEfficiency(gasPrice.gasPriceGwei, avgGwei);

    // Final refund
    const finalRefund = calculateRefund(
      feePaid,
      oilPegFactor,
      timeMultiplier,
      gweiEfficiency
    );

    // ROI
    const roi = ((finalRefund / feePaid) - 1) * 100;

    return {
      feePaid,
      oilPegFactor,
      timeMultiplier,
      gweiEfficiency,
      finalRefund,
      roi,
    };
  };

  return {
    gasPrice,
    ethPrice,
    oilPrice,
    calculateReward,
    isReady: !!(gasPrice && ethPrice && oilPrice),
  };
}

/**
 * Hook for real-time average gas price
 */
export function useAverageGasPrice(minutes: number = 60) {
  const [avgGasPrice, setAvgGasPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const avg = await getAverageGasPrice(minutes);
        setAvgGasPrice(avg);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching average gas price:', err);
        setLoading(false);
      }
    };

    fetchAverage();
    
    // Update every 5 minutes
    const interval = setInterval(fetchAverage, 300000);

    return () => clearInterval(interval);
  }, [minutes]);

  return { avgGasPrice, loading };
}

/**
 * Hook for real-time reward variance based on oil price
 */
export function useRewardVariance() {
  const { oilPrice } = useOilPrice();
  const { history } = useOilPriceHistory(30);

  const calculateVariance = (baseFeePaid: number): {
    currentRefund: number;
    minRefund: number;
    maxRefund: number;
    variance: number;
  } | null => {
    if (!oilPrice || history.length === 0) return null;

    const timeMultiplier = 1.5; // Example: 180 days
    const gweiEfficiency = 1.0; // Neutral

    // Current refund
    const currentPegFactor = calculateOilPegFactor(oilPrice.price);
    const currentRefund = calculateRefund(
      baseFeePaid,
      currentPegFactor,
      timeMultiplier,
      gweiEfficiency
    );

    // Min and max from history
    const prices = history.map(h => h.price);
    const minOilPrice = Math.min(...prices);
    const maxOilPrice = Math.max(...prices);

    const minPegFactor = calculateOilPegFactor(minOilPrice);
    const maxPegFactor = calculateOilPegFactor(maxOilPrice);

    const minRefund = calculateRefund(
      baseFeePaid,
      minPegFactor,
      timeMultiplier,
      gweiEfficiency
    );

    const maxRefund = calculateRefund(
      baseFeePaid,
      maxPegFactor,
      timeMultiplier,
      gweiEfficiency
    );

    const variance = ((maxRefund - minRefund) / baseFeePaid) * 100;

    return {
      currentRefund,
      minRefund,
      maxRefund,
      variance,
    };
  };

  return {
    oilPrice,
    history,
    calculateVariance,
    isReady: !!(oilPrice && history.length > 0),
  };
}
