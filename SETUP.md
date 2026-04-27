# ⚡ Quick Setup Guide

## 1. Privy Configuration

1. Go to [privy.io](https://privy.io)
2. Create a new app
3. Copy your App ID
4. Add to `.env.local`:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
```

## 2. Supabase Configuration

1. Create project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Run these SQL commands in Supabase SQL Editor:

```sql
-- Create gas_receipts table
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

-- Create user_stats table
CREATE TABLE user_stats (
  user_address TEXT PRIMARY KEY,
  total_fees_paid NUMERIC DEFAULT 0,
  total_refunds_claimed NUMERIC DEFAULT 0,
  total_receipts INTEGER DEFAULT 0,
  total_staked INTEGER DEFAULT 0,
  roi_percentage NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create oil_price_history table
CREATE TABLE oil_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_usd NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL
);

-- Create indexes
CREATE INDEX idx_gas_receipts_user ON gas_receipts(user_address);
CREATE INDEX idx_gas_receipts_timestamp ON gas_receipts(timestamp);
CREATE INDEX idx_oil_price_timestamp ON oil_price_history(timestamp);

-- Enable Row Level Security
ALTER TABLE gas_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE oil_price_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own receipts"
  ON gas_receipts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own receipts"
  ON gas_receipts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view all stats"
  ON user_stats FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view oil prices"
  ON oil_price_history FOR SELECT
  USING (true);
```

## 3. Blockchain Configuration

### For Local Development (Hardhat)

1. Start local node:
```bash
npx hardhat node
```

2. Deploy contracts:
```bash
npm run deploy:local
```

3. Contract address will be shown in terminal - add to `.env.local`:
```
NEXT_PUBLIC_PETROGAS_CONTRACT_ADDRESS=0x...
```

### For Sepolia Testnet

1. Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)

2. Get Alchemy API key from [alchemy.com](https://alchemy.com)

3. Add to `.env.local`:
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
ETHERSCAN_API_KEY=your_etherscan_key
```

4. Deploy:
```bash
npm run deploy:sepolia
```

## 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5. Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Wallet connection issues
- Check that Privy App ID is correct
- Make sure you're on the right network
- Clear browser cache and try again

### Contract deployment fails
- Check you have enough ETH for gas
- Verify RPC URL is correct
- Check network connection

## 6. Next Steps

1. ✅ Connect your wallet
2. ✅ Create your first gas receipt
3. ✅ Stake for enhanced refunds
4. ✅ Monitor oil prices
5. ✅ Claim your refunds

## Need Help?

- Check the [full README](./README.md)
- Join our [Discord](https://discord.gg/petrogas)
- Read the [docs](https://docs.petrogas.protocol)
