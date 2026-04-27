'use client';

import {
  FileText,
  Download,
  ExternalLink,
  Droplet,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-cream-500">
      {/* Hero */}
      <section className="bg-cream-400 border-b-4 border-brown-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 border-4 border-brown-900 bg-rust-500 flex items-center justify-center shadow-pixel">
              <FileText className="w-8 h-8 text-cream-50" />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-brown-900 uppercase">
                Whitepaper
              </h1>
              <p className="text-brown-700 font-mono">
                Technical Documentation v1.0
              </p>
            </div>
          </div>

          {/* FIX: aquí faltaba abrir correctamente la etiqueta <a> */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/petrogas_protocol.md"
              download
              className="btn-pixel inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </a>

            <Link
              href="/dashboard"
              className="btn-pixel-secondary inline-flex items-center gap-2"
            >
              <span>Launch App</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Abstract */}
          <div className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              Abstract
            </h2>

            <p className="text-brown-700 leading-relaxed mb-4">
              PetroGas Protocol introduces a novel mechanism for Ethereum gas fee
              refunds indexed to global oil prices. Users receive deterministic,
              verifiable receipts for gas expenditure, which can be staked for
              enhanced returns correlated with crude oil market dynamics.
            </p>

            <p className="text-brown-700 leading-relaxed">
              This system creates economic alignment between blockchain
              transaction costs and real-world energy markets, providing
              predictable yield mechanisms while maintaining full on-chain
              transparency.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4">
              Table of Contents
            </h2>

            <ol className="space-y-2 text-brown-700">
              <li>
                <a href="#introduction">1. Introduction</a>
              </li>
              <li>
                <a href="#mechanism">2. Core Mechanism</a>
              </li>
              <li>
                <a href="#economics">3. Economic Model</a>
              </li>
              <li>
                <a href="#formulas">4. Mathematical Formulas</a>
              </li>
              <li>
                <a href="#strategies">5. User Strategies</a>
              </li>
              <li>
                <a href="#security">6. Security & Audits</a>
              </li>
              <li>
                <a href="#roadmap">7. Roadmap</a>
              </li>
            </ol>
          </div>

          {/* Introduction */}
          <section id="introduction" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              1. Introduction
            </h2>

            <h3 className="text-xl font-bold text-brown-900 mb-3">
              1.1 Problem Statement
            </h3>

            <p className="text-brown-700 leading-relaxed mb-4">
              Ethereum users face unpredictable gas costs ranging from 5 to
              500+ gwei, creating economic uncertainty for transaction
              execution.
            </p>

            <h3 className="text-xl font-bold text-brown-900 mb-3">
              1.2 Our Solution
            </h3>

            <p className="text-brown-700 leading-relaxed">
              PetroGas Protocol transforms gas fees from pure cost into
              potential yield through deterministic refunds indexed to oil
              prices.
            </p>
          </section>

          {/* Mechanism */}
          <section id="mechanism" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              2. Core Mechanism
            </h2>

            <p className="text-brown-700">
              Every transaction creates a unique on-chain gas receipt.
            </p>
          </section>

          {/* Economics */}
          <section id="economics" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              3. Economic Model
            </h2>

            <p className="text-brown-700">
              Treasury allocation ensures refund sustainability and protocol
              growth.
            </p>
          </section>

          {/* Formulas */}
          <section id="formulas" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              4. Mathematical Formulas
            </h2>

            <div className="border-4 border-brown-900 bg-cream-50 p-4 font-mono">
              Refund = Fee × Oil Peg × Time Multiplier × Gwei Efficiency
            </div>
          </section>

          {/* Strategies */}
          <section id="strategies" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              5. User Strategies
            </h2>

            <p className="text-brown-700">
              Optimize low gas timing, high oil price periods, and long staking
              durations.
            </p>
          </section>

          {/* Security */}
          <section id="security" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              6. Security & Audits
            </h2>

            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-forest-600" />
              <span className="text-brown-700">
                Fully on-chain, audited architecture
              </span>
            </div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="card-pixel">
            <h2 className="text-2xl font-bold text-brown-900 uppercase mb-4 border-b-4 border-brown-900 pb-2">
              7. Roadmap
            </h2>

            <p className="text-brown-700">
              Testnet → Audit → Mainnet → Multi-chain Expansion → DAO
            </p>
          </section>

          {/* Footer */}
          <div className="card-pixel bg-brown-900 text-center">
            <p className="text-cream-100 mb-4">
              For questions or collaboration inquiries:
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:team@petrogas.protocol"
                className="text-rust-500 font-mono text-sm"
              >
                team@petrogas.protocol
              </a>

              <a
                href="https://twitter.com/petrogas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rust-500 font-mono text-sm"
              >
                @petrogas
              </a>

              <a
                href="https://github.com/petrogas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rust-500 font-mono text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
