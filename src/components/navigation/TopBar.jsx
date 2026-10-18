import React from 'react';
import { ShieldCheck, Coins, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import confetti from 'canvas-confetti';

import { StripeTopupModal } from '../creator/StripeTopupModal';

export function TopBar({
  activePortal,
  setActivePortal,
  credits,
  onRefillCredits,
  activeCreator
}) {
  const [isStripeModalOpen, setIsStripeModalOpen] = React.useState(false);

  const portalTitles = {
    creator: "Nefra Creator",
    brand: "Nefra Brand",
    admin: "Nefra Admin"
  };

  const handleRefillClick = () => {
    setIsStripeModalOpen(true);
  };

  return (
    <header className="h-14 border-b border-[#27272a] bg-[#000000] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Portal Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded bg-[#e11d48] flex items-center justify-center font-bold text-white text-xs">
          N
        </div>
        <span className="font-semibold text-sm tracking-tight text-[#fafafa]">
          {portalTitles[activePortal]}
        </span>
        <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
          MVP Sandbox
        </Badge>
      </div>

      {/* Center: 3-Portal Switcher (Frictionless MVP Navigator) */}
      <div className="flex items-center bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
        <button
          onClick={() => setActivePortal('creator')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activePortal === 'creator'
              ? 'bg-[#e11d48] text-white'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          Creator Portal
        </button>
        <button
          onClick={() => setActivePortal('brand')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activePortal === 'brand'
              ? 'bg-[#e11d48] text-white'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          Brand Portal
        </button>
        <button
          onClick={() => setActivePortal('admin')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activePortal === 'admin'
              ? 'bg-[#e11d48] text-white'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          Admin Portal
        </button>
      </div>

      {/* Right: Credits, Verification & Persona Indicator */}
      <div className="flex items-center space-x-3">
        {activePortal === 'creator' && (
          <div className="flex items-center space-x-1.5 bg-[#09090b] border border-[#27272a] px-2.5 py-1 rounded-lg">
            <Coins size={14} className="text-[#e11d48]" />
            <span className="text-xs font-medium text-[#fafafa] tabular-nums">
              {credits} credits
            </span>
            <button
              onClick={handleRefillClick}
              title="Top-up credits with Stripe Sandbox"
              className="ml-1 text-[#a1a1aa] hover:text-[#e11d48] transition-colors p-0.5 cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 pl-2 border-l border-[#27272a]">
          <img
            src={activeCreator?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt="Persona Avatar"
            className="w-7 h-7 rounded-full border border-[#27272a] object-cover"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-[#fafafa] leading-none">
              {activePortal === 'creator' ? activeCreator?.name : (activePortal === 'brand' ? 'Acme Enterprise' : 'Nefra Admin')}
            </p>
            <p className="text-[10px] text-[#71717a] leading-none mt-0.5">
              {activePortal === 'creator' ? 'Verified Talent' : (activePortal === 'brand' ? 'Verified Buyer' : 'Root Access')}
            </p>
          </div>
        </div>
      </div>

      <StripeTopupModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onSuccess={(added, receipt) => {
          onRefillCredits(added, receipt);
        }}
      />
    </header>
  );
}
