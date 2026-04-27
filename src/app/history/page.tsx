'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/lib/supabase';
import { History, ExternalLink, Clock } from 'lucide-react';
import { formatUSD, formatAddress, timeAgo } from '@/lib/utils';

interface Receipt {
  id: string;
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
}

export default function HistoryPage() {
  const { user, authenticated } = usePrivy();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'claimed'>('all');

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchReceipts();
    }
  }, [authenticated, user]);

  const fetchReceipts = async () => {
    if (!user?.wallet?.address) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('gas_receipts')
        .select('*')
        .eq('user_address', user.wallet.address.toLowerCase())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setReceipts(data || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    if (filter === 'active') return !receipt.claimed;
    if (filter === 'claimed') return receipt.claimed;
    return true;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream-500 flex items-center justify-center px-4">
        <div className="card-pixel max-w-md text-center">
          <h2 className="text-2xl font-bold text-brown-900 mb-4 uppercase">
            Connect Wallet
          </h2>
          <p className="text-brown-700 mb-6">
            Connect your wallet to view your transaction history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-500 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 border-4 border-brown-900 bg-brown-600 flex items-center justify-center shadow-pixel">
            <History className="w-8 h-8 text-cream-50" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brown-900 uppercase">
              Transaction History
            </h1>
            <p className="text-brown-700 font-mono">
              {user?.wallet?.address ? formatAddress(user.wallet.address) : ''}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'claimed'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 font-mono font-bold uppercase text-sm border-2 border-brown-900 transition-colors ${
                filter === type
                  ? 'bg-rust-500 text-cream-50'
                  : 'bg-cream-100 text-brown-900 hover:bg-cream-200'
              }`}
            >
              {type} (
              {type === 'all'
                ? receipts.length
                : type === 'active'
                ? receipts.filter(r => !r.claimed).length
                : receipts.filter(r => r.claimed).length}
              )
            </button>
          ))}
        </div>

        {/* Receipts */}
        {loading ? (
          <div className="card-pixel text-center py-12">
            <div className="text-brown-600 font-mono">Loading history...</div>
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div className="card-pixel text-center py-12">
            <div className="text-brown-600 font-mono mb-2">No receipts found</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReceipts.map((receipt) => (
              <div key={receipt.id} className="card-pixel-hover">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div className="flex-1">
                    <div className="text-xs font-bold text-brown-600 uppercase mb-2">
                      Receipt #{receipt.receipt_id}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-brown-600">Fee Paid</div>
                        <div className="font-bold">{formatUSD(receipt.fee_paid_usd)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-brown-600">Gas Used</div>
                        <div className="font-bold">{receipt.gas_used}</div>
                      </div>
                    </div>
                  </div>

                  {/* FIX AQUÍ 👇 */}
                  <a
                    href={`https://etherscan.io/tx/${receipt.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-rust-600 hover:text-rust-700 font-mono"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}