# 🛢️ PetroGas Protocol

**El gas digital cotiza como el gas real** - Earn refunds on Ethereum gas fees, indexed to global oil prices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/solidity-0.8.24-green.svg)
![Next.js](https://img.shields.io/badge/next.js-15.0-black.svg)

## 🎯 Overview

PetroGas Protocol is a DeFi innovation that creates economic correlation between:
- 🛢️ **Oil Price (WTI/Brent)** - Global energy market
- ⛽ **Ethereum Gas Price** - Network fees in gwei
- 💰 **ETH Price** - Market value

Every transaction generates a **Gas Receipt** that can be staked for enhanced refunds. Your refund scales with:
1. **Oil Peg Factor** - Higher oil = higher refund
2. **Time Multiplier** - Longer stake = bigger multiplier (up to 2x)
3. **Gwei Efficiency** - Transact during low gas for bonus

## ✨ Features

- 🎨 **Retro Pixel UI** - Inspired by uPNG, built with Tailwind CSS
- 🔐 **Privy Authentication** - Email, social, and wallet login
- 📊 **Supabase Backend** - Real-time data and analytics
- ⛓️ **Fully On-Chain** - No IPFS, no servers
- 🎨 **Lucide Icons** - Beautiful, consistent iconography
- 📱 **Fully Responsive** - Mobile-first design

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS with custom retro theme
- **Privy** - Wallet connection and authentication
- **Wagmi** - React hooks for Ethereum
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Smart Contracts
- **Solidity 0.8.24** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **Ethers.js** - Ethereum library

### Backend
- **Supabase** - PostgreSQL database, real-time subscriptions
- **Node.js** - Server-side JavaScript

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/petrogas-protocol.git
cd petrogas-protocol
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Run local blockchain (optional)**
```bash
npx hardhat node
```

6. **Deploy contracts**
```bash
# Local
npm run deploy:local

# Sepolia testnet
npm run deploy:sepolia
```

7. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
petrogas-protocol/
├── contracts/              # Solidity smart contracts
│   └── PetroGasProtocol.sol
├── scripts/               # Deployment scripts
│   └── deploy.js
├── test/                  # Contract tests
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   └── Providers.tsx
│   ├── lib/              # Utilities
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── public/               # Static assets
├── hardhat.config.js     # Hardhat configuration
├── tailwind.config.js    # Tailwind CSS config
└── package.json
```

## 🎮 How It Works

### 1. Create Gas Receipt
When you make a transaction on Ethereum, create a receipt in the protocol:
- Records: gas used, gas price (gwei), ETH price
- Calculates: fee paid in USD
- Stores: immutable on-chain receipt

### 2. Stake Your Receipt
Lock your receipt for enhanced refunds:
- **0 days**: 1.0x multiplier
- **90 days**: 1.25x multiplier
- **180 days**: 1.49x multiplier
- **365 days**: 2.0x multiplier

### 3. Oil Price Oracle
The protocol tracks WTI oil prices:
- **Baseline**: $75 USD
- **Higher oil** (e.g., $90): 1.2x oil peg factor
- **Lower oil** (e.g., $60): 0.8x oil peg factor
- **Capped**: 0.5x - 2.0x range

### 4. Claim Refund
After staking period ends:
```
Refund = Fee × Oil Peg × Time Mult × Gwei Efficiency
```

## 🎨 Design System

### Color Palette
- **Cream**: Warm background tones (#d9c5b3)
- **Rust**: Primary action color (#ee865d)
- **Brown**: Text and borders (#8b6f53, #3a2c21)
- **Forest**: Success states (#788e69)

### Typography
- **Font**: Courier New, monospace
- **Style**: Pixel-perfect, retro gaming aesthetic
- **Weights**: Regular (400), Bold (700)

### Components
- Pixel buttons with shadow-pixel effect
- Card layouts with thick borders
- Icon boxes inspired by uPNG
- Badges for status indicators

## 📊 Database Schema (Supabase)

### gas_receipts
```sql
CREATE TABLE gas_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  receipt_id INTEGER NOT NULL,
  gas_used BIGINT NOT NULL,
  gas_price_gwei INTEGER NOT NULL,
  eth_price_usd NUMERIC NOT NULL,
  fee_paid_usd NUMERIC NOT NULL,
  oil_price_usd NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  staked_until TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT false,
  refund_amount NUMERIC,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_stats
```sql
CREATE TABLE user_stats (
  user_address TEXT PRIMARY KEY,
  total_fees_paid NUMERIC DEFAULT 0,
  total_refunds_claimed NUMERIC DEFAULT 0,
  total_receipts INTEGER DEFAULT 0,
  total_staked INTEGER DEFAULT 0,
  roi_percentage NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Run contract tests
npm run test

# Run with coverage
npx hardhat coverage

# Run specific test file
npx hardhat test test/PetroGasProtocol.test.js
```

## 📦 Deployment

### Testnet (Sepolia)
```bash
npm run deploy:sepolia
```

### Mainnet
```bash
npm run deploy:mainnet
```

After deployment, verify on Etherscan:
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS ORACLE_ADDRESS
```

## 🔐 Security

- ✅ OpenZeppelin contracts
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Access control with Ownable
- ✅ Input validation
- ✅ Safe math operations
- 🔜 Professional audit (planned)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: https://petrogas.protocol
- **Documentation**: https://docs.petrogas.protocol
- **Twitter**: https://twitter.com/petrogasprotocol
- **Discord**: https://discord.gg/petrogas

## 👥 Team

Built with ❤️ by the PetroGas team

---

**Disclaimer**: This is experimental software. Use at your own risk. Always do your own research.
