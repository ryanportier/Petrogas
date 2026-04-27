-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Gas Receipts Table
CREATE TABLE IF NOT EXISTS gas_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  receipt_id INTEGER NOT NULL,
  gas_used BIGINT NOT NULL,
  gas_price_gwei INTEGER NOT NULL,
  eth_price_usd NUMERIC(20, 8) NOT NULL,
  fee_paid_usd NUMERIC(20, 8) NOT NULL,
  oil_price_usd NUMERIC(20, 8) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  staked_until TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT FALSE,
  refund_amount NUMERIC(20, 8),
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Stats Table
CREATE TABLE IF NOT EXISTS user_stats (
  user_address TEXT PRIMARY KEY,
  total_fees_paid NUMERIC(20, 8) DEFAULT 0,
  total_refunds_claimed NUMERIC(20, 8) DEFAULT 0,
  total_receipts INTEGER DEFAULT 0,
  total_staked INTEGER DEFAULT 0,
  roi_percentage NUMERIC(10, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Oil Price History Table
CREATE TABLE IF NOT EXISTS oil_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_usd NUMERIC(10, 2) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_gas_receipts_user ON gas_receipts(user_address);
CREATE INDEX idx_gas_receipts_timestamp ON gas_receipts(timestamp DESC);
CREATE INDEX idx_gas_receipts_claimed ON gas_receipts(claimed);
CREATE INDEX idx_oil_price_timestamp ON oil_price_history(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE gas_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE oil_price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view receipts"
  ON gas_receipts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own receipts"
  ON gas_receipts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own receipts"
  ON gas_receipts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can view stats"
  ON user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update their stats"
  ON user_stats FOR UPDATE
  USING (true);

CREATE POLICY "Users can insert their stats"
  ON user_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view oil prices"
  ON oil_price_history FOR SELECT
  USING (true);

CREATE POLICY "System can insert oil prices"
  ON oil_price_history FOR INSERT
  WITH CHECK (true);