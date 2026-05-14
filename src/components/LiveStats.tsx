'use client';

import { useGasPrice, useEthPrice, useOilPrice, useTokenMetrics } from '@/hooks/useRealTimeData';
import { Fuel, TrendingUp, TrendingDown, Droplet, Zap, Users, DollarSign, Activity } from 'lucide-react';
import { formatUSD, formatNumber, formatPercentage } from '@/lib/utils';

interface LiveStatsProps {
  tokenAddress?: string;
  showTokenMetrics?: boolean;
}

export function LiveStats({ tokenAddress, showTokenMetrics = false }: LiveStatsProps) {
  const { gasPrice, loading: gasLoading } = useGasPrice();
  const { ethPrice, loading: ethLoading } = useEthPrice();
  const { oilPrice, loading: oilLoading } = useOilPrice();
  const { metrics, loading: metricsLoading } = useTokenMetrics(
    tokenAddress || '',
    showTokenMetrics ? 30000 : 999999999
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-cream-400 border-y-4 border-brown-900">
      <div className="max-w-7xl mx-auto">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Gas Price */}
          <div className="stat-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <div className="stat-label">Gas Price</div>
              <Zap className="w-4 h-4 text-rust-500" />
            </div>
            {gasLoading ? (
              <div className="stat-value text-brown-400">Loading...</div>
            ) : (
              <>
                <div className="stat-value text-rust-600">
                  {gasPrice?.gasPriceGwei || '--'} gwei
                </div>
                <div className="text-xs text-brown-600 mt-1">
                  Live • Updates every 12s
                </div>
              </>
            )}
          </div>

          {/* ETH Price */}
          <div className="stat-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <div className="stat-label">Hyper Price</div>
              <Fuel className="w-4 h-4 text-forest-600" />
            </div>
            {ethLoading ? (
              <div className="stat-value text-brown-400">Loading...</div>
            ) : (
              <>
                <div className="stat-value text-forest-600">
                  {ethPrice ? formatUSD(ethPrice) : '--'}
                </div>
                <div className="text-xs text-brown-600 mt-1">
                  Live • Updates every 30s
                </div>
              </>
            )}
          </div>

          {/* Oil Price */}
          <div className="stat-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="stat-label">Oil Price (WTI)</div>
              <Droplet className="w-4 h-4 text-brown-600" />
            </div>
            {oilLoading ? (
              <div className="stat-value text-brown-400">Loading...</div>
            ) : (
              <>
                <div className="stat-value text-brown-700">
                  ${formatNumber(oilPrice?.price || 0, 2)}
                  <span className="text-lg">/barrel</span>
                </div>
                {oilPrice?.change24h !== undefined && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${
                    oilPrice.change24h >= 0 ? 'text-forest-600' : 'text-rust-600'
                  }`}>
                    {oilPrice.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{formatPercentage(oilPrice.change24h)} (24h)</span>
                  </div>
                )}
              </>
            )}
            
            {/* Pulsing indicator */}
            {!oilLoading && (
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Token Metrics (if enabled) */}
        {showTokenMetrics && tokenAddress && (
          <div className="border-t-4 border-brown-900 pt-8">
            <h3 className="text-xl font-bold text-brown-900 mb-4 uppercase">
              Token Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Market Cap */}
              <div className="border-4 border-brown-900 bg-cream-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-brown-600" />
                  <div className="text-xs uppercase tracking-wide text-brown-600">
                    Market Cap
                  </div>
                </div>
                <div className="text-2xl font-bold text-brown-900">
                  {metricsLoading ? '...' : formatUSD(metrics?.marketCap || 0)}
                </div>
              </div>

              {/* Holders */}
              <div className="border-4 border-brown-900 bg-cream-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-brown-600" />
                  <div className="text-xs uppercase tracking-wide text-brown-600">
                    Holders
                  </div>
                </div>
                <div className="text-2xl font-bold text-brown-900">
                  {metricsLoading ? '...' : formatNumber(metrics?.holders || 0, 0)}
                </div>
              </div>

              {/* Volume 24h */}
              <div className="border-4 border-brown-900 bg-cream-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-brown-600" />
                  <div className="text-xs uppercase tracking-wide text-brown-600">
                    Volume 24h
                  </div>
                </div>
                <div className="text-2xl font-bold text-brown-900">
                  {metricsLoading ? '...' : formatUSD(metrics?.volume24h || 0)}
                </div>
              </div>

              {/* Price Change */}
              <div className="border-4 border-brown-900 bg-cream-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-brown-600" />
                  <div className="text-xs uppercase tracking-wide text-brown-600">
                    24h Change
                  </div>
                </div>
                <div className={`text-2xl font-bold ${
                  (metrics?.priceChange24h || 0) >= 0 
                    ? 'text-forest-600' 
                    : 'text-rust-600'
                }`}>
                  {metricsLoading ? '...' : formatPercentage(metrics?.priceChange24h || 0)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
