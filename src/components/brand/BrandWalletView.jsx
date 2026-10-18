import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Coins, 
  CreditCard, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  Wand2, 
  PlusCircle, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { StripeTopupModal } from '../creator/StripeTopupModal';
import { BRAND_CREDIT_PACKAGES } from '../../services/stripeService';

export function BrandWalletView({
  brandCredits = 250,
  onRefillBrandCredits,
  transactions = [],
  userProfile = null
}) {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const handleStripeSuccess = (creditsAdded, receipt) => {
    if (onRefillBrandCredits) {
      onRefillBrandCredits(creditsAdded, receipt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              Brand Credit Wallet &amp; Ledger
            </h1>
            <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">
              ● Stripe Sandbox Active • Business Tier
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Dedicated Brand Credits power AI Content Creator posters, Gemini multimodal campaign briefs, and NefraSense intelligence.
          </p>
        </div>

        <Button 
          onClick={() => setIsStripeModalOpen(true)} 
          size="sm" 
          className="space-x-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white shrink-0 shadow-sm cursor-pointer"
        >
          <CreditCard size={14} />
          <span>Top-Up Brand Credits</span>
        </Button>
      </div>

      <StripeTopupModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onSuccess={handleStripeSuccess}
        portalType="brand"
        userProfile={userProfile}
      />

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#09090b] border-[#27272a]">
          <div className="flex items-center justify-between text-xs text-[#71717a]">
            <div className="flex items-center space-x-1.5">
              <Coins size={14} className="text-[#3b82f6]" />
              <span className="uppercase font-semibold tracking-wider">Usable Brand Credits</span>
            </div>
            <span className="text-[10px] text-[#10b981] font-semibold bg-[#10b981]/10 px-1.5 py-0.5 rounded">
              Active Balance
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#fafafa] tabular-nums mt-2">{brandCredits}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Estimated ~{Math.floor(brandCredits / 20)} poster generations or {Math.floor(brandCredits / 15)} AI campaign briefs
          </p>
        </Card>

        <Card className="bg-[#09090b] border-[#27272a]">
          <div className="flex items-center space-x-1.5 text-xs text-[#71717a]">
            <Zap size={14} className="text-amber-400" />
            <span className="uppercase font-semibold tracking-wider">AI Feature Pricing</span>
          </div>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#a1a1aa]">
              <span className="flex items-center space-x-1">
                <Wand2 size={12} className="text-[#e11d48]" />
                <span>AI Poster &amp; Copy Generation</span>
              </span>
              <strong className="text-[#fafafa] font-mono">20 credits</strong>
            </div>
            <div className="flex justify-between text-[#a1a1aa]">
              <span className="flex items-center space-x-1">
                <PlusCircle size={12} className="text-[#3b82f6]" />
                <span>AI Campaign Brief Draft</span>
              </span>
              <strong className="text-[#fafafa] font-mono">15 credits</strong>
            </div>
            <div className="flex justify-between text-[#a1a1aa]">
              <span className="flex items-center space-x-1">
                <MessageSquare size={12} className="text-[#10b981]" />
                <span>NefraSense Strategy Advisor</span>
              </span>
              <strong className="text-[#fafafa] font-mono">10 credits</strong>
            </div>
          </div>
        </Card>

        <Card className="bg-[#09090b] border-[#27272a]">
          <div className="flex items-center space-x-1.5 text-xs text-[#71717a]">
            <Building2 size={14} className="text-[#635bff]" />
            <span className="uppercase font-semibold tracking-wider">Enterprise Invoicing</span>
          </div>
          <p className="text-base font-bold text-[#fafafa] mt-2">B2B Stripe Sandbox</p>
          <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
            Need high-volume credits with dedicated VAT receipts? Instant corporate top-ups available via 1-click test checkout.
          </p>
          <button 
            onClick={() => setIsStripeModalOpen(true)}
            className="mt-3 text-[11px] text-[#3b82f6] hover:text-[#60a5fa] font-semibold cursor-pointer flex items-center space-x-1"
          >
            <span>View enterprise tiers</span>
            <ArrowUpRight size={12} />
          </button>
        </Card>
      </div>

      {/* Credit Package Quick Cards */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
          Available Brand Credit Packs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BRAND_CREDIT_PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className="p-4 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-[#3b82f6]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-[#fafafa]">{pkg.name}</h4>
                  {pkg.popular && (
                    <Badge className="bg-[#3b82f6] text-white text-[9px]">POPULAR</Badge>
                  )}
                </div>
                <div className="flex items-baseline space-x-1.5 mt-2">
                  <span className="text-2xl font-black text-[#fafafa] tabular-nums">
                    {pkg.credits + (pkg.bonusCredits || 0)}
                  </span>
                  <span className="text-xs text-[#a1a1aa]">Brand Credits</span>
                </div>
                {pkg.bonusCredits > 0 && (
                  <span className="text-[11px] text-[#10b981] font-semibold block mt-0.5">
                    +{pkg.bonusCredits} Free Business Bonus
                  </span>
                )}
                <p className="text-xs text-[#71717a] mt-2 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#27272a] flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#fafafa]">${pkg.amountDollars}.00</span>
                  <span className="text-[10px] text-[#71717a] ml-1">USD</span>
                </div>
                <Button 
                  onClick={() => setIsStripeModalOpen(true)}
                  size="sm" 
                  variant="outline" 
                  className="text-xs border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#3b82f6]/10 cursor-pointer"
                >
                  Buy with Stripe
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Ledger */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
            Brand Credit Transaction Ledger
          </h3>
          <span className="text-[10px] text-[#71717a]">
            {transactions.length} record{transactions.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="divide-y divide-[#27272a] text-xs">
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-[#71717a]">
              No brand credit transactions recorded yet.
            </div>
          ) : (
            transactions.map((tx, idx) => {
              const isPositive = tx.amount > 0;
              return (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded flex items-center justify-center ${
                      isPositive ? 'bg-[#3b82f6]/15 text-[#3b82f6]' : 'bg-[#e11d48]/15 text-[#e11d48]'
                    }`}>
                      {isPositive ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    </div>
                    <div>
                      <p className="font-semibold text-[#fafafa]">{tx.description}</p>
                      <p className="text-[10px] text-[#71717a]">{tx.timestamp}</p>
                    </div>
                  </div>

                  <span className={`font-bold tabular-nums ${isPositive ? 'text-[#3b82f6]' : 'text-[#e11d48]'}`}>
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
