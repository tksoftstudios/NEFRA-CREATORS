import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  RefreshCw, 
  ExternalLink, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  Repeat,
  Sun,
  Moon,
  Sparkles,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import confetti from 'canvas-confetti';

import { StripeTopupModal } from '../creator/StripeTopupModal';
import { SUPPORTED_CURRENCIES } from '../../services/currencyService';

export function TopBar({
  activePortal,
  setActivePortal,
  credits,
  creatorCredits: propCreatorCredits,
  brandCredits: propBrandCredits,
  onRefillCredits,
  onRefillCreatorCredits,
  onRefillBrandCredits,
  activeCreator,
  currentUser,
  userProfile,
  onSignOut,
  onSwitchAccount,
  preferredCurrency = 'USD',
  onCurrencyChange,
  theme = 'dark',
  onThemeToggle,
  onOpenScoreJustification
}) {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripePortalType, setStripePortalType] = useState('creator');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const creatorCredits = propCreatorCredits !== undefined ? propCreatorCredits : (credits || 0);
  const brandCredits = propBrandCredits !== undefined ? propBrandCredits : 250;

  const isAdmin = userProfile?.role === 'admin' || currentUser?.email?.includes('admin@nefra.com');
  const userRole = userProfile?.role || 'creator';

  const portalTitles = {
    creator: "Nefra Creator",
    brand: "Nefra Brand",
    admin: "Nefra Admin"
  };

  const handleRefillClick = (portalType) => {
    setStripePortalType(portalType);
    setIsStripeModalOpen(true);
  };

  const displayName = activePortal === 'creator' 
    ? (activeCreator?.name || currentUser?.displayName || 'Creator')
    : (activePortal === 'brand' ? (userProfile?.companyName || userProfile?.creatorName || currentUser?.displayName || 'Brand Partner') : 'Nefra Admin');

  const userAvatar = activePortal === 'brand' && !userProfile?.creatorName
    ? (currentUser?.photoURL || "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80")
    : (activeCreator?.avatar || currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

  const currentCurr = SUPPORTED_CURRENCIES[preferredCurrency] || SUPPORTED_CURRENCIES.USD;
  const aiScore = activeCreator?.aiScore || activeCreator?.audit?.aiScore || 92;

  return (
    <header className="h-14 border-b border-[#27272a] bg-[#000000] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left: Portal Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded bg-[#e11d48] flex items-center justify-center font-bold text-white text-xs shadow-md shadow-[#e11d48]/20 shrink-0">
          N
        </div>
        <span className="font-semibold text-sm tracking-tight text-[#fafafa] hidden sm:inline">
          {portalTitles[activePortal] || "NEFRA Platform"}
        </span>

        {/* AI Score Badge (Click to View Justification Breakdown) */}
        {activePortal === 'creator' && onOpenScoreJustification && (
          <button
            onClick={onOpenScoreJustification}
            title="Click to view AI Score Calculation & Justifications"
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-semibold text-[#fafafa] cursor-pointer transition-colors"
          >
            <Sparkles size={11} className="text-[#e11d48]" />
            <span className="text-[11px] text-[#e11d48] font-bold">{aiScore}</span>
            <span className="text-[10px] text-[#71717a]">/100</span>
          </button>
        )}
      </div>

      {/* Center: Portal Switcher (Creator & Brand; Admin only if authorized) */}
      <div className="flex items-center bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
        <button
          onClick={() => setActivePortal('creator')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activePortal === 'creator'
              ? 'bg-[#e11d48] text-white shadow-sm'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          Creator Portal
        </button>
        <button
          onClick={() => setActivePortal('brand')}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            activePortal === 'brand'
              ? 'bg-[#3b82f6] text-white shadow-sm'
              : 'text-[#a1a1aa] hover:text-[#fafafa]'
          }`}
        >
          Brand Portal
        </button>
        {isAdmin && (
          <button
            onClick={() => setActivePortal('admin')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-[#10b981] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Admin
          </button>
        )}
      </div>

      {/* Right: Currency Selector, Theme Toggle, Credits & User Capsule */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Preferred Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
            title="Select preferred display currency"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] text-xs font-medium text-[#fafafa] transition-colors cursor-pointer"
          >
            <span className="text-xs">{currentCurr.flag}</span>
            <span className="font-mono text-[11px]">{currentCurr.code}</span>
            <ChevronDown size={11} className="text-[#71717a]" />
          </button>

          {isCurrencyMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 rounded-xl bg-[#09090b] border border-[#27272a] shadow-2xl py-1 z-50 text-xs"
              onClick={() => setIsCurrencyMenuOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-[#27272a] text-[10px] uppercase font-bold text-[#71717a] tracking-wider">
                Select Display Currency
              </div>
              <div className="max-h-60 overflow-y-auto">
                {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      if (onCurrencyChange) onCurrencyChange(c.code);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-[#18181b] ${
                      preferredCurrency === c.code ? 'text-[#e11d48] font-bold bg-[#18181b]/50' : 'text-[#a1a1aa]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                    </span>
                    <span className="text-[11px] text-[#71717a] font-mono">{c.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onThemeToggle}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-1.5 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-blue-400" />}
        </button>

        {/* AI Credits (Creator vs Brand) */}
        {activePortal === 'creator' ? (
          <div className="flex items-center space-x-1.5 bg-[#09090b] border border-[#27272a] px-2.5 py-1 rounded-lg">
            <Coins size={14} className="text-[#e11d48]" />
            <span className="text-xs font-medium text-[#fafafa] tabular-nums">
              {creatorCredits} <span className="hidden sm:inline text-[11px] text-[#71717a]">Creator Credits</span>
            </span>
            <button
              onClick={() => handleRefillClick('creator')}
              title="Top-up Creator Credits with Stripe Sandbox"
              className="ml-1 text-[#a1a1aa] hover:text-[#e11d48] transition-colors p-0.5 cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        ) : activePortal === 'brand' ? (
          <div className="flex items-center space-x-1.5 bg-[#09090b] border border-[#27272a] px-2.5 py-1 rounded-lg">
            <Coins size={14} className="text-[#3b82f6]" />
            <span className="text-xs font-medium text-[#fafafa] tabular-nums">
              {brandCredits} <span className="hidden sm:inline text-[11px] text-[#3b82f6]">Brand Credits</span>
            </span>
            <button
              onClick={() => handleRefillClick('brand')}
              title="Top-up Brand Credits with Stripe Sandbox"
              className="ml-1 text-[#a1a1aa] hover:text-[#3b82f6] transition-colors p-0.5 cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        ) : null}

        {/* User Account Capsule with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 pl-2 border-l border-[#27272a] hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <img
              src={userAvatar}
              alt="Avatar"
              className="w-7 h-7 rounded-full border border-[#27272a] object-cover ring-1 ring-white/10"
            />
            <div className="hidden md:block text-left">
              <div className="flex items-center space-x-1.5">
                <p className="text-xs font-medium text-[#fafafa] leading-none group-hover:text-white truncate max-w-[120px]">
                  {displayName}
                </p>
                <span className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase tracking-wider ${
                  userRole === 'brand'
                    ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                    : 'bg-[#e11d48]/20 text-[#e11d48] border border-[#e11d48]/30'
                }`}>
                  {userRole === 'brand' ? 'Business' : 'Creator'}
                </span>
              </div>
              <p className="text-[10px] text-[#71717a] leading-none mt-0.5 truncate max-w-[140px]">
                {currentUser?.email || (userRole === 'brand' ? 'Verified Business' : 'Verified Talent')}
              </p>
            </div>
            <ChevronDown size={12} className="text-[#71717a] group-hover:text-white transition-colors" />
          </button>

          {/* Account Dropdown Menu */}
          {isUserMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-64 rounded-xl bg-[#09090b] border border-[#27272a] shadow-2xl py-1.5 z-50 text-xs"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#27272a]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white truncate">{displayName}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    userRole === 'brand'
                      ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                      : 'bg-[#e11d48]/20 text-[#e11d48]'
                  }`}>
                    {userRole === 'brand' ? 'Business Persona' : 'Creator Persona'}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717a] truncate mt-0.5">{currentUser?.email || 'Logged in'}</p>
              </div>

              {/* Balances Quick Breakdown */}
              <div className="px-3 py-2 border-b border-[#27272a]/70 space-y-1.5 bg-[#18181b]/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#71717a] flex items-center space-x-1">
                    <Coins size={11} className="text-[#e11d48]" />
                    <span>Creator Credits</span>
                  </span>
                  <span className="font-bold text-[#fafafa] tabular-nums">{creatorCredits}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#71717a] flex items-center space-x-1">
                    <Coins size={11} className="text-[#3b82f6]" />
                    <span>Brand Credits</span>
                  </span>
                  <span className="font-bold text-[#3b82f6] tabular-nums">{brandCredits}</span>
                </div>
              </div>

              {onSwitchAccount && (
                <button
                  onClick={onSwitchAccount}
                  className="w-full text-left px-3 py-2 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] flex items-center space-x-2 cursor-pointer transition-colors"
                >
                  <Repeat size={13} className="text-[#3b82f6]" />
                  <span>Switch Google Account</span>
                </button>
              )}

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-[#18181b] flex items-center space-x-2 cursor-pointer transition-colors border-t border-[#27272a]/60"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <StripeTopupModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        portalType={stripePortalType}
        userProfile={userProfile}
        onSuccess={(added, receipt) => {
          if (stripePortalType === 'brand') {
            if (onRefillBrandCredits) onRefillBrandCredits(added, receipt);
            else if (onRefillCredits) onRefillCredits(added, receipt);
          } else {
            if (onRefillCreatorCredits) onRefillCreatorCredits(added, receipt);
            else if (onRefillCredits) onRefillCredits(added, receipt);
          }
        }}
      />
    </header>
  );
}

