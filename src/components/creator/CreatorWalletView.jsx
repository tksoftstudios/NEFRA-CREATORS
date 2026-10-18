import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Coins, Plus, RefreshCw, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

import { StripeTopupModal } from './StripeTopupModal';

export function CreatorWalletView({
  credits,
  onRefillCredits,
  transactions = []
}) {
  const [isStripeModalOpen, setIsStripeModalOpen] = React.useState(false);

  const handleStripeSuccess = (creditsAdded, receipt) => {
    onRefillCredits(creditsAdded, receipt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              Creator credit wallet &amp; ledger
            </h1>
            <Badge className="bg-[#635bff]/15 text-[#635bff] border-[#635bff]/30 text-[10px]">
              ● Stripe Sandbox Active
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Credits are consumed when running Vertex AI multimodal audits, drafting proposals, and bidding on campaigns.
          </p>
        </div>

        <Button 
          onClick={() => setIsStripeModalOpen(true)} 
          size="sm" 
          className="space-x-1.5 bg-[#635bff] hover:bg-[#534be7] text-white shrink-0 shadow-sm cursor-pointer"
        >
          <CreditCard size={14} />
          <span>Top-up with Stripe</span>
        </Button>
      </div>

      <StripeTopupModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onSuccess={handleStripeSuccess}
      />

      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#09090b]">
          <div className="flex items-center space-x-2 text-xs text-[#71717a]">
            <Coins size={14} className="text-[#e11d48]" />
            <span className="uppercase font-semibold tracking-wider">Usable credit balance</span>
          </div>
          <p className="text-3xl font-bold text-[#fafafa] tabular-nums mt-2">{credits}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Sufficient for {Math.floor(credits / 5)} AI pitch proposals</p>
        </Card>

        <Card>
          <p className="text-xs uppercase font-semibold text-[#71717a] tracking-wider">AI proposal cost</p>
          <p className="text-3xl font-bold text-[#fafafa] tabular-nums mt-2">5</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Credits per proposal generated</p>
        </Card>

        <Card>
          <p className="text-xs uppercase font-semibold text-[#71717a] tracking-wider">Daily demo bonus</p>
          <p className="text-3xl font-bold text-[#e11d48] tabular-nums mt-2">+15</p>
          <p className="text-xs text-[#a1a1aa] mt-1">1-click sandbox refill allowance</p>
        </Card>
      </div>

      {/* Transactions Ledger */}
      <Card className="space-y-4">
        <h3 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
          Credit transaction ledger
        </h3>

        <div className="divide-y divide-[#27272a] text-xs">
          {transactions.length === 0 ? (
            <div className="py-6 text-center text-[#71717a]">
              No credit transactions recorded yet.
            </div>
          ) : (
            transactions.map((tx, idx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${
                      isPositive ? 'bg-[#18181b] text-[#fafafa]' : 'bg-[#e11d48]/15 text-[#e11d48]'
                    }`}>
                      {isPositive ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    </div>
                    <div>
                      <p className="font-semibold text-[#fafafa]">{tx.description}</p>
                      <p className="text-[10px] text-[#71717a]">{tx.timestamp}</p>
                    </div>
                  </div>

                  <span className={`font-bold tabular-nums ${isPositive ? 'text-[#fafafa]' : 'text-[#e11d48]'}`}>
                    {isPositive ? `+${tx.amount}` : tx.amount} credits
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
