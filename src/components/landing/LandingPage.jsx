import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Video, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Globe2, 
  Zap, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Award,
  Play,
  Flame,
  Star,
  Users,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../services/currencyService';
import { INITIAL_CREATORS } from '../../data/seedData';
import { deduplicateCreators } from '../../lib/utils';

export function LandingPage({ 
  creators = [], 
  preferredCurrency = 'USD', 
  onSelectFocus, 
  onSignIn, 
  onDemoLogin,
  isAuthenticating 
}) {
  const [selectedFocus, setSelectedFocus] = useState(null); // 'creator' | 'brand'
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const allAvailableCreators = deduplicateCreators((creators && creators.length > 0) ? creators : INITIAL_CREATORS);
  // Exclude unverified empty initial placeholder account if not yet connected
  const validCreators = allAvailableCreators.filter(c => c.id !== 'creator_01' || c.youtubeConnected);

  const categories = [
    { id: 'Technology & AI', label: 'Tech & AI', icon: Cpu, color: '#3b82f6' },
    { id: 'Education & Science', label: 'Education & Science', icon: Sparkles, color: '#e11d48' },
    { id: 'Gaming & Esports', label: 'Gaming & Esports', icon: Zap, color: '#8b5cf6' },
    { id: 'Acoustic & Music', label: 'Acoustic & Music', icon: Video, color: '#ec4899' },
    { id: 'Finance & Web3', label: 'Finance & Web3', icon: DollarSign, color: '#10b981' },
    { id: 'Design & Creative', label: 'Design & Creative', icon: TrendingUp, color: '#f59e0b' }
  ];

  const getTop3ForCategory = (catId) => {
    return validCreators
      .filter(c => c.category === catId)
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0) || (b.subscribers || 0) - (a.subscribers || 0))
      .slice(0, 3);
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
          <Award size={10} className="fill-current" />
          <span>#1 Ranked</span>
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-300/20 text-slate-200 border border-slate-400/40">
          <Award size={10} />
          <span>#2 Ranked</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-700/20 text-amber-300 border border-amber-600/40">
        <Award size={10} />
        <span>#3 Ranked</span>
      </span>
    );
  };

  const handleFocusClick = (focus) => {
    setSelectedFocus(focus);
    if (onSelectFocus) {
      onSelectFocus(focus);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] flex flex-col selection:bg-[#e11d48] selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#e11d48]/20 via-[#9333ea]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-gradient-to-t from-[#2563eb]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Landing Navigation Bar */}
      <header className="h-16 border-b border-[#27272a]/80 bg-[#000000]/80 backdrop-blur-md px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img
            src="/LOGO.png"
            alt="NEFRA Logo"
            className="w-8 h-8 rounded-lg object-contain bg-[#09090b] border border-[#27272a] shadow-lg shadow-[#e11d48]/20 shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-[#fafafa]">NEFRA</span>
              <Badge variant="outline" className="text-[10px] bg-[#18181b] border-[#3f3f46] text-[#a1a1aa] py-0 px-1.5">
                CREATORS X
              </Badge>
            </div>
          </div>
        </div>

        {/* Global Value Pillars */}
        <div className="hidden md:flex items-center space-x-6 text-xs text-[#a1a1aa]">
          <span className="flex items-center space-x-1.5">
            <Lock size={13} className="text-[#10b981]" />
            <span>100% Pre-Funded Escrow</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Cpu size={13} className="text-[#e11d48]" />
            <span>Google Vertex AI Verified</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Globe2 size={13} className="text-[#3b82f6]" />
            <span>Global Multi-Currency</span>
          </span>
        </div>

        {/* Top Sign-in & Demo CTAs */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onDemoLogin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDemoLogin('brand')}
                className="border-[#3b82f6]/40 text-[#3b82f6] hover:bg-[#3b82f6]/10 text-xs font-semibold cursor-pointer hidden md:flex items-center space-x-1"
              >
                <Building2 size={13} />
                <span>Brand Demo (250 Credits)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDemoLogin('creator')}
                className="border-[#e11d48]/40 text-[#e11d48] hover:bg-[#e11d48]/10 text-xs font-semibold cursor-pointer hidden md:flex items-center space-x-1"
              >
                <Video size={13} />
                <span>Creator Demo (50 Credits)</span>
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSignIn ? onSignIn('creator') : null}
            disabled={isAuthenticating}
            className="border-[#3f3f46] hover:bg-[#18181b] text-xs font-medium cursor-pointer"
          >
            {isAuthenticating ? (
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In with Google</span>
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-[#e11d48] text-xs font-medium mb-6">
          <Sparkles size={14} />
          <span>Next-Gen Creator Escrow & AI Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fafafa] max-w-4xl leading-tight">
          Sponsorships guaranteed by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#ec4899]">
            Pre-Funded Escrow
          </span>{' '}
          & AI Channel Telemetry.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#a1a1aa] max-w-2xl leading-relaxed">
          NEFRA unites global content creators and forward-thinking businesses. No unpaid invoices, no inflated follower vanity metrics, and no payment delays.
        </p>

        {/* PRIMARY FOCUS PROMPT - CORE REQUIREMENT */}
        <div className="w-full mt-12 pt-8 border-t border-[#27272a]/60">
          <div className="mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#e11d48] bg-[#e11d48]/10 px-3 py-1 rounded-full border border-[#e11d48]/20">
              Get Started
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#fafafa] mt-3">
              What is your primary focus?
            </h2>
            <p className="text-xs sm:text-sm text-[#71717a] mt-1">
              Select your path to continue with your authenticated Google account.
            </p>
          </div>

          {/* DUAL PATH CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* FOCUS OPTION 1: CONTENT CREATOR */}
            <div 
              onClick={() => handleFocusClick('creator')}
              className={`group relative rounded-2xl p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                selectedFocus === 'creator'
                  ? 'bg-gradient-to-b from-[#18181b] to-[#121214] border-[#e11d48] shadow-2xl shadow-[#e11d48]/20 ring-1 ring-[#e11d48]'
                  : 'bg-[#09090b]/80 hover:bg-[#121214] border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#e11d48]/10 border border-[#e11d48]/20 flex items-center justify-center text-[#e11d48] group-hover:scale-105 transition-transform">
                    <Video size={24} />
                  </div>
                  <Badge className="bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/30 text-[11px] font-semibold">
                    For Creators & Streamers
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-[#fafafa] group-hover:text-white transition-colors">
                  Content Creator
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed">
                  I produce videos, podcasts, streams or digital content and want transparent brand deals, guaranteed milestone payouts, and Vertex AI channel audits.
                </p>

                {/* Benefits List */}
                <ul className="mt-5 space-y-2 text-xs text-[#d4d4d8]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#10b981] shrink-0" />
                    <span>100% pre-funded escrow deposits before you produce</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#10b981] shrink-0" />
                    <span>Vertex AI multimodal video & audience diagnostics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#10b981] shrink-0" />
                    <span>Connect YouTube & social channels with real telemetry</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#10b981] shrink-0" />
                    <span>Instant credit refill with Stripe Sandbox testmode</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[#27272a] space-y-2">
                <Button 
                  className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-medium text-xs sm:text-sm py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-[#e11d48]/25 cursor-pointer"
                  disabled={isAuthenticating}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFocusClick('creator');
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue as Content Creator</span>
                  <ArrowRight size={14} />
                </Button>
                {onDemoLogin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDemoLogin('creator');
                    }}
                    className="w-full text-center text-[11px] text-[#a1a1aa] hover:text-[#e11d48] transition-colors cursor-pointer block"
                  >
                    Or explore 1-click Creator Sandbox (50 Credits) →
                  </button>
                )}
              </div>
            </div>

            {/* FOCUS OPTION 2: BUSINESS / BRAND */}
            <div 
              onClick={() => handleFocusClick('brand')}
              className={`group relative rounded-2xl p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                selectedFocus === 'brand'
                  ? 'bg-gradient-to-b from-[#18181b] to-[#121214] border-[#3b82f6] shadow-2xl shadow-[#3b82f6]/20 ring-1 ring-[#3b82f6]'
                  : 'bg-[#09090b]/80 hover:bg-[#121214] border-[#27272a] hover:border-[#3f3f46]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6] group-hover:scale-105 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30 text-[11px] font-semibold">
                    For Brands & Agencies
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-[#fafafa] group-hover:text-white transition-colors">
                  Business / Brand
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 leading-relaxed">
                  I represent a company, startup, or agency looking to hire vetted global creators with guaranteed escrow delivery and AI-driven campaign matching.
                </p>

                {/* Benefits List */}
                <ul className="mt-5 space-y-2 text-xs text-[#d4d4d8]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#3b82f6] shrink-0" />
                    <span>Funds held securely in escrow until deliverables pass review</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#3b82f6] shrink-0" />
                    <span>AI Campaign Builder generates custom creative briefs in seconds</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#3b82f6] shrink-0" />
                    <span>Authentic YouTube metrics verified via Google API (zero fake stats)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 size={14} className="text-[#3b82f6] shrink-0" />
                    <span>Global talent sourcing across USA, Europe, Sri Lanka, APAC</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[#27272a] space-y-2">
                <Button 
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium text-xs sm:text-sm py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-[#3b82f6]/25 cursor-pointer"
                  disabled={isAuthenticating}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFocusClick('brand');
                  }}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue as Business</span>
                  <ArrowRight size={14} />
                </Button>
                {onDemoLogin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDemoLogin('brand');
                    }}
                    className="w-full text-center text-[11px] text-[#a1a1aa] hover:text-[#3b82f6] transition-colors cursor-pointer block"
                  >
                    Or explore 1-click Business Sandbox (250 Brand Credits) →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TOP 3 CREATORS OF EACH CATEGORY SHOWCASE */}
        {/* ======================================================== */}
        <section className="mt-20 w-full max-w-6xl text-left space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#27272a] pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} />
                <span>Verified Talent Roster</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fafafa] tracking-tight">
                Top 3 Creators in Every Category
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] mt-1.5 max-w-2xl leading-relaxed">
                Pre-screened and certified by Google Cloud Vertex AI multimodal video analysis. Real YouTube Data API metrics, zero vanity figures, backed by 100% pre-funded escrow.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 shrink-0">
              <button
                onClick={() => setActiveCategoryTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategoryTab === 'all'
                    ? 'bg-[#e11d48] text-white shadow-sm shadow-[#e11d48]/30'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeCategoryTab === cat.id
                      ? 'bg-[#e11d48] text-white shadow-sm shadow-[#e11d48]/30'
                      : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Sections */}
          <div className="space-y-12">
            {categories
              .filter(cat => activeCategoryTab === 'all' || activeCategoryTab === cat.id)
              .map(cat => {
                const top3 = getTop3ForCategory(cat.id);
                if (top3.length === 0) return null;

                const CatIcon = cat.icon;

                return (
                  <div key={cat.id} className="space-y-4">
                    {/* Category Title Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                        >
                          <CatIcon size={16} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#fafafa] flex items-center gap-2">
                            <span>{cat.id}</span>
                            <Badge variant="outline" className="text-[10px] text-[#71717a] border-[#27272a]">
                              Top 3 Ranked
                            </Badge>
                          </h3>
                        </div>
                      </div>

                      <span className="text-[11px] text-[#71717a]">
                        Google Vertex AI Certified
                      </span>
                    </div>

                    {/* Top 3 Creator Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {top3.map((creator, idx) => (
                        <div 
                          key={creator.id}
                          className="p-5 rounded-2xl bg-[#09090b]/80 border border-[#27272a] hover:border-[#3f3f46] transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-black/50"
                        >
                          <div className="space-y-4">
                            {/* Card Top: Rank Badge & Country */}
                            <div className="flex items-center justify-between">
                              {getRankBadge(idx)}
                              <span className="text-[11px] text-[#a1a1aa] font-medium flex items-center gap-1">
                                <span>{creator.residence || creator.country}</span>
                              </span>
                            </div>

                            {/* Creator Avatar & Basic Info */}
                            <div className="flex items-center space-x-3.5">
                              <div className="relative shrink-0">
                                <img
                                  src={creator.avatar}
                                  alt={creator.name}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-[#27272a] group-hover:border-[#e11d48] transition-colors"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-[#09090b] flex items-center justify-center text-white">
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-[#fafafa] truncate group-hover:text-white">
                                  {creator.name}
                                </h4>
                                <p className="text-xs text-[#a1a1aa] font-mono truncate">
                                  {creator.handle}
                                </p>
                                <div className="flex items-center space-x-1 mt-1 text-[#e11d48] font-bold text-xs">
                                  <Sparkles size={11} />
                                  <span>{creator.aiScore || 92}/100 AI Score</span>
                                </div>
                              </div>
                            </div>

                            {/* Bio / Positioning */}
                            <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                              {creator.bio || "Certified YouTube creator with verified audience retention and sponsor readiness."}
                            </p>

                            {/* Verified Telemetry Numbers */}
                            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#121215] border border-[#27272a]/60 text-center">
                              <div>
                                <span className="text-[10px] text-[#71717a] uppercase block">Subscribers</span>
                                <span className="text-xs font-extrabold text-[#fafafa] font-mono">
                                  {creator.subscribersFormatted || "0"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-[#71717a] uppercase block">Avg Views</span>
                                <span className="text-xs font-extrabold text-[#fafafa] font-mono">
                                  {creator.avgViewsFormatted || "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {(creator.tags || []).slice(0, 3).map((tag, tIdx) => (
                                <span 
                                  key={tIdx} 
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#18181b] border border-[#27272a] text-[#a1a1aa]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer with Starting Price & Hire CTA */}
                          <div className="mt-5 pt-4 border-t border-[#27272a] flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-[#71717a] uppercase block font-medium">Starting Package</span>
                              <span className="text-xs font-bold text-white tabular-nums">
                                {formatCurrency(creator.startingPriceCents || 85000, preferredCurrency)}
                              </span>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => onSignIn ? onSignIn('brand') : null}
                              disabled={isAuthenticating}
                              className="bg-[#18181b] hover:bg-[#e11d48] hover:text-white border border-[#3f3f46] text-[#fafafa] text-xs font-medium transition-colors cursor-pointer"
                            >
                              <span>Hire with Escrow</span>
                              <ArrowRight size={12} className="ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* TRUST BANNER & ARCHITECTURE PILLARS */}
        <div className="mt-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a]">
            <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 text-[#10b981] flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#fafafa]">Smart Escrow Engine</h4>
            <p className="text-xs text-[#71717a] mt-1">
              State-machine governed funds. 100% pre-funded before kickoff, released upon milestone sign-off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a]">
            <div className="w-8 h-8 rounded-lg bg-[#e11d48]/10 text-[#e11d48] flex items-center justify-center mb-3">
              <Sparkles size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#fafafa]">Vertex AI Diagnostic</h4>
            <p className="text-xs text-[#71717a] mt-1">
              Authentic channel metrics, niche tag extraction, and multimodal video diagnostics on Google Cloud.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#09090b] border border-[#27272a]">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center mb-3">
              <DollarSign size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#fafafa]">Zero Vanity Metrics</h4>
            <p className="text-xs text-[#71717a] mt-1">
              Direct Google YouTube Data API integration prevents fake handles or inflated subscriber figures.
            </p>
          </div>
        </div>
      </main>

      {/* Landing Footer (No admin links, purely public platform info) */}
      <footer className="border-t border-[#27272a] bg-[#050505] py-8 px-6 text-center text-xs text-[#71717a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img
              src="/LOGO.png"
              alt="NEFRA Logo"
              className="w-5 h-5 rounded object-contain bg-[#09090b] border border-[#27272a] shrink-0"
            />
            <span className="font-semibold text-[#fafafa]">NEFRA Creators Platform</span>
            <span>— Global Escrow & Creator Engine</span>
          </div>
          <div>
            <span>Protected by Google Cloud Vertex AI & Stripe Sandbox</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
