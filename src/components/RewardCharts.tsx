'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useOilPriceHistory, useRewardVariance } from '@/hooks/useRealTimeData';
import { formatUSD, formatNumber, calculateOilPegFactor, calculateRefund } from '@/lib/utils';
import { TrendingUp, Info } from 'lucide-react';

interface RewardChartProps {
  baseFeePaid?: number;
  stakeDays?: number;
  gweiEfficiency?: number;
}

export function RewardVarianceChart({ 
  baseFeePaid = 25, 
  stakeDays = 180,
  gweiEfficiency = 1.0 
}: RewardChartProps) {
  const { history, loading } = useOilPriceHistory(30);
  const [chartData, setChartData] = useState<any[]>([]);

  const timeMultiplier = 1 + (stakeDays / 365);

  useEffect(() => {
    if (history.length === 0) return;

    const data = history.map((point) => {
      const oilPegFactor = calculateOilPegFactor(point.price);
      const refund = calculateRefund(
        baseFeePaid,
        oilPegFactor,
        timeMultiplier,
        gweiEfficiency
      );
      const roi = ((refund / baseFeePaid) - 1) * 100;

      return {
        date: new Date(point.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        timestamp: point.timestamp,
        oilPrice: point.price,
        pegFactor: oilPegFactor,
        refund: refund,
        roi: roi,
        feePaid: baseFeePaid,
      };
    });

    setChartData(data);
  }, [history, baseFeePaid, timeMultiplier, gweiEfficiency]);

  if (loading) {
    return (
      <div className="card-pixel">
        <div className="text-center py-12">
          <div className="text-brown-600 font-mono">Loading chart data...</div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="border-4 border-brown-900 bg-cream-50 p-3 shadow-pixel-sm">
          <p className="text-xs font-bold text-brown-900 mb-2">{data.date}</p>
          <div className="space-y-1 text-xs">
            <p className="text-brown-700">
              Oil: <span className="font-bold">${formatNumber(data.oilPrice, 2)}</span>
            </p>
            <p className="text-brown-700">
              Peg Factor: <span className="font-bold">{formatNumber(data.pegFactor, 2)}x</span>
            </p>
            <p className="text-rust-600">
              Refund: <span className="font-bold">${formatNumber(data.refund, 2)}</span>
            </p>
            <p className="text-forest-600">
              ROI: <span className="font-bold">{formatNumber(data.roi, 1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const currentRefund = chartData.length > 0 ? chartData[chartData.length - 1].refund : 0;
  const minRefund = Math.min(...chartData.map(d => d.refund));
  const maxRefund = Math.max(...chartData.map(d => d.refund));
  const variance = ((maxRefund - minRefund) / baseFeePaid) * 100;

  return (
    <div className="card-pixel">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-brown-900 uppercase mb-1">
            Reward Variance (Last 30 Days)
          </h3>
          <p className="text-sm text-brown-600">
            How oil prices affect your refund in real-time
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-brown-900 bg-rust-500 text-cream-50 text-xs font-bold uppercase">
          <div className="w-2 h-2 bg-cream-50 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border-2 border-brown-900 bg-cream-50 p-3">
          <div className="text-xs text-brown-600 uppercase tracking-wide mb-1">Current</div>
          <div className="text-lg font-bold text-brown-900">
            {formatUSD(currentRefund)}
          </div>
        </div>
        <div className="border-2 border-brown-900 bg-cream-50 p-3">
          <div className="text-xs text-brown-600 uppercase tracking-wide mb-1">30d Range</div>
          <div className="text-lg font-bold text-brown-900">
            {formatUSD(minRefund)} - {formatUSD(maxRefund)}
          </div>
        </div>
        <div className="border-2 border-brown-900 bg-cream-50 p-3">
          <div className="text-xs text-brown-600 uppercase tracking-wide mb-1">Variance</div>
          <div className="text-lg font-bold text-rust-600">
            {formatNumber(variance, 1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="border-4 border-brown-900 bg-cream-50 p-4" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRefund" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ee865d" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ee865d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#8b6f53" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#3a2c21"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#3a2c21"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="refund" 
              stroke="#ee865d" 
              strokeWidth={3}
              fill="url(#colorRefund)" 
            />
            <Line 
              type="monotone" 
              dataKey="feePaid" 
              stroke="#8b6f53" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-rust-500"></div>
          <span className="text-brown-700 font-mono">Refund Amount</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 border-t-2 border-brown-600 border-dashed"></div>
          <span className="text-brown-700 font-mono">Fee Paid (Base)</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 border-2 border-brown-900 bg-cream-400 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-brown-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-brown-700 leading-relaxed">
            <strong>How it works:</strong> This chart shows how your refund varies based on oil price fluctuations over the past 30 days. 
            Higher oil prices = higher oil peg factor = bigger refunds. Current parameters: 
            ${baseFeePaid} fee, {stakeDays} days staked, {formatNumber(gweiEfficiency, 2)}x gwei efficiency.
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Oil Price Chart Component
 */
export function OilPriceChart() {
  const { history, loading } = useOilPriceHistory(30);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (history.length === 0) return;

    const data = history.map((point) => ({
      date: new Date(point.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: point.price,
      pegFactor: calculateOilPegFactor(point.price),
    }));

    setChartData(data);
  }, [history]);

  if (loading) {
    return (
      <div className="card-pixel">
        <div className="text-center py-12">
          <div className="text-brown-600 font-mono">Loading oil data...</div>
        </div>
      </div>
    );
  }

  const avgPrice = chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length;

  return (
    <div className="card-pixel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-brown-900 uppercase">
          WTI Oil Price (30 Days)
        </h3>
        <div className="text-sm text-brown-600">
          Avg: <span className="font-bold">${formatNumber(avgPrice, 2)}</span>
        </div>
      </div>

      <div className="border-4 border-brown-900 bg-cream-50 p-4" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#8b6f53" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              stroke="#3a2c21"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#3a2c21"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f3ebe1',
                border: '4px solid #251b14',
                fontFamily: 'monospace'
              }}
              formatter={(value: any) => [`$${formatNumber(value, 2)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8b6f53" 
              strokeWidth={3}
              dot={{ fill: '#8b6f53', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
