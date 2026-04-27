'use client';

export default function SwapPage() {
  const PGAS_TOKEN = process.env.NEXT_PUBLIC_PGAS_TOKEN_ADDRESS || '';
  
  return (
    <div className="min-h-screen bg-cream-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brown-900 uppercase mb-3">
            Swap PGAS Tokens
          </h1>
          <p className="text-brown-700 font-mono">
            Trade PetroGas tokens on Uniswap
          </p>
        </div>

        {/* Uniswap Widget en iframe */}
        <div className="card-pixel max-w-xl mx-auto">
          <iframe
            src={`https://app.uniswap.org/#/swap?outputCurrency=${PGAS_TOKEN}&chain=mainnet`}
            height="660"
            width="100%"
            style={{
              border: '4px solid #3a2c21',
              borderRadius: '0',
            }}
            title="Uniswap Interface"
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          <div className="card-pixel text-center">
            <div className="text-xs uppercase text-brown-600 mb-2">Contract</div>
            <div className="text-sm font-mono text-brown-900 break-all">
              {PGAS_TOKEN
                ? `${PGAS_TOKEN.slice(0, 6)}...${PGAS_TOKEN.slice(-4)}`
                : 'Not deployed'}
            </div>
          </div>
          
          <div className="card-pixel text-center">
            <div className="text-xs uppercase text-brown-600 mb-2">Network</div>
            <div className="text-lg font-bold text-brown-900">Ethereum</div>
          </div>
          
          <div className="card-pixel text-center">
            <div className="text-xs uppercase text-brown-600 mb-2">DEX</div>
            <div className="text-lg font-bold text-brown-900">Uniswap V3</div>
          </div>
        </div>

        {/* Links */}
        <div className="text-center mt-8">
          <a
            href={`https://app.uniswap.org/#/add/ETH/${PGAS_TOKEN}/3000`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pixel inline-flex items-center gap-2"
          >
            <span>Add Liquidity</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}