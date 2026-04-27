'use client';

import { SwapWidget } from '@uniswap/widgets';

const PGAS_TOKEN = process.env.NEXT_PUBLIC_PGAS_TOKEN_ADDRESS;
const ANKR_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY;

export function UniswapSwapWidget() {
  return (
    <div className="card-pixel max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-brown-900 uppercase mb-6">
        Swap PGAS
      </h2>
      
      <SwapWidget
        jsonRpcUrlMap={{
          1: [`https://rpc.ankr.com/eth/${ANKR_KEY}`],
        }}
        tokenList={[
          {
            name: 'PetroGas',
            address: PGAS_TOKEN || '',
            symbol: 'PGAS',
            decimals: 18,
            chainId: 1,
            logoURI: '/logo.png',
          },
        ]}
        defaultInputTokenAddress="NATIVE"
        defaultOutputTokenAddress={PGAS_TOKEN}
        theme={{
          primary: '#ee865d',
          secondary: '#d9c5b3',
          interactive: '#8b6f53',
          container: '#f3ebe1',
          module: '#f9f5ed',
          accent: '#ee865d',
          outline: '#3a2c21',
          dialog: '#f3ebe1',
          fontFamily: 'Courier New, monospace'
        }}
      />
    </div>
  );
}