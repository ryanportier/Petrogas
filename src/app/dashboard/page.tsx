'use client';

import { useState } from 'react';
import { LiveStats } from '@/components/LiveStats';
import { RewardVarianceChart, OilPriceChart } from '@/components/RewardCharts';
import { useRefundCalculator } from '@/hooks/useRealTimeData';
import { formatUSD, formatNumber, formatPercentage } from '@/lib/utils';
import { FormattedNumber } from '@/components/FormattedNumber';
import { Calculator, TrendingUp, Droplet, Zap, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [gasUsed, setGasUsed] = useState(150000);
  const [stakeDays, setStakeDays] = useState(180);
  
  const { 
    gasPrice, 
    ethPrice, 
    oilPrice, 
    calculateReward,
    isReady 
  } = useRefundCalculator();

  const reward = isReady ? calculateReward(gasUsed, stakeDays) : null;

  return (
    <div className="min-h-screen bg-cream-500">
      {/* Hero Section */}
      <section className="bg-cream-400 border-b-4 border-brown-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 border-4 border-brown-900 bg-rust-500 flex items-center justify-center shadow-pixel">
              <TrendingUp className="w-8 h-8 text-cream-50" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brown-900 uppercase">
                Live Dashboard
              </h1>
              <p className="text-brown-700 font-mono">
                Real-time gas, oil, and reward metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <LiveStats />

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Refund Calculator */}
          <div className="card-pixel">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-rust-500" />
              <h2 className="text-2xl font-bold text-brown-900 uppercase">
                Calculate Your Refund
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-brown-900 uppercase">
                      Gas Used (units)
                    </label>
                    <span className="text-sm font-mono text-brown-700">
                      <FormattedNumber value={gasUsed} />
                    </span>
                  </div>
                  <input
                    type="range"
                    min="21000"
                    max="500000"
                    step="1000"
                    value={gasUsed}
                    onChange={(e) => setGasUsed(parseInt(e.target.value))}
                    className="input-pixel"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-brown-900 uppercase">
                      Staking Days
                    </label>
                    <span className="text-sm font-mono text-brown-700">
                      {stakeDays} days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="365"
                    step="1"
                    value={stakeDays}
                    onChange={(e) => setStakeDays(parseInt(e.target.value))}
                    className="input-pixel"
                  />
                </div>

                {/* Current Prices */}
                <div className="border-4 border-brown-900 bg-cream-400 p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-brown-900 mb-3">
                    Current Live Prices
                  </h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Gas Price
                    </span>
                    <span className="font-bold font-mono text-brown-900">
                      {gasPrice?.gasPriceGwei || '--'} gwei
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-700 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      ETH Price
                    </span>
                    <span className="font-bold font-mono text-brown-900">
                      {ethPrice ? formatUSD(ethPrice) : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-700 flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Oil Price
                    </span>
                    <span className="font-bold font-mono text-brown-900">
                      ${oilPrice?.price.toFixed(2) || '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {!isReady ? (
                  <div className="border-4 border-brown-900 bg-cream-50 p-8 text-center">
                    <div className="text-brown-600 font-mono mb-2">
                      Loading live data...
                    </div>
                    <div className="w-12 h-12 border-4 border-brown-900 border-t-rust-500 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : reward ? (
                  <>
                    {/* Fee Paid */}
                    <div className="border-4 border-brown-900 bg-cream-50 p-4">
                      <div className="text-xs uppercase tracking-wide text-brown-600 mb-1">
                        Fee Paid
                      </div>
                      <div className="text-2xl font-bold text-brown-900">
                        {formatUSD(reward.feePaid)}
                      </div>
                    </div>

                    {/* Multipliers */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border-2 border-brown-900 bg-cream-50 p-3 text-center">
                        <div className="text-xs text-brown-600 mb-1">Oil Peg</div>
                        <div className="text-lg font-bold text-brown-900">
                          {formatNumber(reward.oilPegFactor, 2)}x
                        </div>
                      </div>
                      <div className="border-2 border-brown-900 bg-cream-50 p-3 text-center">
                        <div className="text-xs text-brown-600 mb-1">Time</div>
                        <div className="text-lg font-bold text-brown-900">
                          {formatNumber(reward.timeMultiplier, 2)}x
                        </div>
                      </div>
                      <div className="border-2 border-brown-900 bg-cream-50 p-3 text-center">
                        <div className="text-xs text-brown-600 mb-1">Gwei</div>
                        <div className="text-lg font-bold text-brown-900">
                          {formatNumber(reward.gweiEfficiency, 2)}x
                        </div>
                      </div>
                    </div>

                    {/* Final Refund */}
                    <div className="border-6 border-rust-500 bg-rust-50 p-6">
                      <div className="text-xs uppercase tracking-wide text-rust-700 mb-2">
                        Your Refund
                      </div>
                      <div className="text-4xl font-bold text-rust-600 mb-3">
                        {formatUSD(reward.finalRefund)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brown-700">ROI:</span>
                        <span className={`text-xl font-bold ${
                          reward.roi >= 0 ? 'text-forest-600' : 'text-rust-600'
                        }`}>
                          {formatPercentage(reward.roi)}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link 
                      href="/swap" 
                      className="btn-pixel w-full flex items-center justify-center gap-2"
                    >
                      <span>Create Receipt</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 border-t-4 border-brown-900 pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-brown-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-brown-700 leading-relaxed">
                  <strong>Real-time calculation:</strong> This calculator uses live prices from Ankr (gas), 
                  CoinGecko (ETH), and EIA (oil). Your actual refund will depend on the prices at the time 
                  you create your gas receipt and when you claim. All values update automatically.
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reward Variance Chart */}
            <div>
              <RewardVarianceChart 
                baseFeePaid={reward?.feePaid || 25}
                stakeDays={stakeDays}
                gweiEfficiency={reward?.gweiEfficiency || 1.0}
              />
            </div>

            {/* Oil Price Chart */}
            <div>
              <OilPriceChart />
            </div>
          </div>

          {/* How Variance Works */}
          <div className="card-pixel bg-brown-900 border-brown-900 text-cream-100">
            <h3 className="text-2xl font-bold mb-4 uppercase text-cream-50">
              Understanding Reward Variance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Droplet className="w-6 h-6 text-rust-500" />
                  <h4 className="font-bold text-lg text-cream-50">Oil Price Impact</h4>
                </div>
                <p className="text-cream-300 text-sm leading-relaxed">
                  When oil prices rise, your oil peg factor increases (up to 2.0x), 
                  multiplying your base refund. When oil is cheap, the factor decreases 
                  (minimum 0.5x). This creates natural variance in your rewards.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-6 h-6 text-forest-500" />
                  <h4 className="font-bold text-lg text-cream-50">Staking Strategy</h4>
                </div>
                <p className="text-cream-300 text-sm leading-relaxed">
                  Stake during high oil prices to lock in a higher base peg factor. 
                  Combine with long stake periods (365 days = 2.0x time multiplier) 
                  for maximum refunds. Track the 30-day variance to time your stakes.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-6 h-6 text-rust-500" />
                  <h4 className="font-bold text-lg text-cream-50">Gas Optimization</h4>
                </div>
                <p className="text-cream-300 text-sm leading-relaxed">
                  Transact when gas is low (&lt;30 gwei) to maximize your gwei efficiency 
                  bonus. This multiplier compounds with oil peg and time factors, 
                  potentially tripling your base refund or more.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
