import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface GasReceiptDB {
  id: string;
  user_address: string;
  receipt_id: number;
  gas_used: number;
  gas_price_gwei: number;
  eth_price_usd: number;
  fee_paid_usd: number;
  oil_price_usd: number;
  timestamp: string;
  staked_until: string | null;
  claimed: boolean;
  refund_amount: number | null;
  tx_hash: string;
  created_at: string;
}

export interface UserStatsDB {
  user_address: string;
  total_fees_paid: number;
  total_refunds_claimed: number;
  total_receipts: number;
  total_staked: number;
  roi_percentage: number;
  updated_at: string;
}

export interface OilPriceHistoryDB {
  id: string;
  price_usd: number;
  timestamp: string;
  source: string;
}
