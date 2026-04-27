'use client';

import { Fuel, TrendingUp, Clock, Droplet, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { LiveStats } from '@/components/LiveStats';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 grid-paper opacity-30"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 border-4 border-brown-900 bg-rust-500 text-cream-50 font-bold uppercase text-xs shadow-pixel">
              <Droplet className="w-4 h-4" />
              <span>Oil-Indexed Gas Refunds</span>
              <Droplet className="w-4 h-4" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-brown-900 mb-6 leading-tight">
            Every transaction
            <br />
            earns you a{' '}
            <span className="text-rust-500 text-shadow-pixel">
              Refund
            </span>
          </h1>

          <p className="text-center text-lg sm:text-xl text-brown-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Every Ethereum transaction creates a gas receipt. Stake to multiply your refund. 
            Oil goes up = your refund goes up. <strong>No IPFS. Fully on-chain.</strong>
          </p>

          {/* Icon Grid - uPNG style */}
          <div className="flex justify-center gap-4 mb-12">
            <div className="icon-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer">
              <Fuel className="w-8 h-8 text-rust-500 group-hover:text-brown-900 transition-colors" />
            </div>
            <div className="icon-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer">
              <TrendingUp className="w-8 h-8 text-rust-500 group-hover:text-brown-900 transition-colors" />
            </div>
            <div className="icon-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer">
              <Clock className="w-8 h-8 text-rust-500 group-hover:text-brown-900 transition-colors" />
            </div>
            <div className="icon-box group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform cursor-pointer">
              <Droplet className="w-8 h-8 text-rust-500 group-hover:text-brown-900 transition-colors" />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/swap" className="btn-pixel inline-flex items-center gap-2">
              <span>Start Earning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/whitepaper" className="btn-pixel-secondary inline-flex items-center gap-2">
              <span>Read Docs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <LiveStats />

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brown-900 mb-12 uppercase">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card-pixel-hover">
              <div className="w-16 h-16 border-4 border-brown-900 bg-rust-500 flex items-center justify-center mb-4 shadow-pixel-sm">
                <Fuel className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3 uppercase">
                Deterministic
              </h3>
              <p className="text-brown-700 leading-relaxed">
                Each transaction generates a unique gas receipt. Same inputs = same refund. 
                Completely verifiable on-chain.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-pixel-hover">
              <div className="w-16 h-16 border-4 border-brown-900 bg-forest-500 flex items-center justify-center mb-4 shadow-pixel-sm">
                <TrendingUp className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3 uppercase">
                Oil-Indexed
              </h3>
              <p className="text-brown-700 leading-relaxed">
                Your refund scales with the price of oil. Expensive global gas = higher compensation. 
                1 barrel = 1 multiplier.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-pixel-hover">
              <div className="w-16 h-16 border-4 border-brown-900 bg-brown-600 flex items-center justify-center mb-4 shadow-pixel-sm">
                <Clock className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-brown-900 mb-3 uppercase">
                Time Staking
              </h3>
              <p className="text-brown-700 leading-relaxed">
                Stake your receipt for days. Each day increases your multiplier. 
                365 days = 2x refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brown-900 mb-4 uppercase">
            Earning Strategies
          </h2>
          <p className="text-center text-brown-700 mb-12 max-w-2xl mx-auto">
            Combine factors to maximize your ROI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strategy 1 */}
            <div className="border-4 border-brown-900 bg-cream-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-4 border-brown-900 bg-rust-500 flex items-center justify-center text-cream-50 font-bold text-xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-brown-900 uppercase">Gas Hunter</h3>
              </div>
              <p className="text-brown-700 mb-4 leading-relaxed">
                Wait for low gas (&lt;30 gwei). Maximize gwei efficiency bonus.
              </p>
              <div className="flex items-center justify-between">
                <span className="badge-rust">ROI: +40-60%</span>
                <Zap className="w-5 h-5 text-rust-500" />
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="border-4 border-brown-900 bg-cream-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-4 border-brown-900 bg-brown-600 flex items-center justify-center text-cream-50 font-bold text-xl">
                  🛢️
                </div>
                <h3 className="text-xl font-bold text-brown-900 uppercase">Oil Speculator</h3>
              </div>
              <p className="text-brown-700 mb-4 leading-relaxed">
                Stake during oil crises (price &gt;$90). Capture high oil peg.
              </p>
              <div className="flex items-center justify-between">
                <span className="badge-brown">ROI: +80-150%</span>
                <TrendingUp className="w-5 h-5 text-brown-600" />
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="border-4 border-brown-900 bg-cream-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-4 border-brown-900 bg-forest-600 flex items-center justify-center text-cream-50 font-bold text-xl">
                  💎
                </div>
                <h3 className="text-xl font-bold text-brown-900 uppercase">Diamond Hands</h3>
              </div>
              <p className="text-brown-700 mb-4 leading-relaxed">
                Stake for the full 365 days. Maximize time multiplier to 2.0x.
              </p>
              <div className="flex items-center justify-between">
                <span className="badge-forest">ROI: +100-200%</span>
                <Clock className="w-5 h-5 text-forest-600" />
              </div>
            </div>

            {/* Strategy 4 - Highlighted */}
            <div className="border-6 border-rust-500 bg-rust-50 p-6 relative">
              <div className="absolute -top-4 -right-4 px-3 py-1 border-4 border-brown-900 bg-rust-500 text-cream-50 font-bold text-xs uppercase shadow-pixel">
                Best
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 border-4 border-brown-900 bg-rust-500 flex items-center justify-center text-cream-50 font-bold text-xl">
                  🚀
                </div>
                <h3 className="text-xl font-bold text-brown-900 uppercase">Combo Master</h3>
              </div>
              <p className="text-brown-700 mb-4 leading-relaxed">
                Combine everything: low gas + high oil + 365 days staking.
              </p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-bold uppercase border-4 border-brown-900 bg-rust-500 text-cream-50">
                  ROI: +300%+
                </span>
                <BarChart3 className="w-5 h-5 text-rust-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-forest-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-brown-900 mb-6 uppercase">
            Fully Audited
          </h2>
          <p className="text-lg text-brown-700 mb-8 leading-relaxed">
            Smart contracts audited by experts. No IPFS, no servers. 
            All state lives on-chain on Ethereum.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="badge-forest text-base px-6 py-2">OpenZeppelin</span>
            <span className="badge-forest text-base px-6 py-2">Verified Contract</span>
            <span className="badge-forest text-base px-6 py-2">On-Chain Oracle</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brown-900 border-t-4 border-brown-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-cream-50 mb-6 uppercase leading-tight">
            Start earning today
          </h2>
          <p className="text-xl text-cream-300 mb-10 leading-relaxed">
            Connect your wallet and create your first gas receipt
          </p>
          <Link
            href="/swap"
            className="inline-block px-10 py-4 font-mono font-bold uppercase tracking-wide border-4 border-cream-50 bg-rust-500 text-cream-50 shadow-pixel hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-sm transition-all duration-150 text-lg"
          >
            Launch App →
          </Link>
        </div>
      </section>
    </div>
  );
}
