import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Inbox, 
  Video, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  LogOut
} from 'lucide-react';
import ApplyProposalModal from './ApplyProposalModal';
import { 
  getCreatorWallet, 
  getStoredApplications, 
  refillDemoCredits,
  updateApplicationStatus,
  calculateMatchScore
} from '../../services/marketplaceService';
import { analyzeCreatorVideosWithGemini } from '../../services/geminiService';
import { SEED_CAMPAIGNS } from '../../data/seedCampaigns';
import confetti from 'canvas-confetti';

export default function SingleCreatorDashboard({ 
  creator, 
  onSignOut, 
  apiKey,
  onCreatorEnrolled 
}) {
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'audit' | 'deals' | 'inbox' | 'wallet'
  
  // Wallet & Applications State
  const [wallet, setWallet] = useState(getCreatorWallet);
  const [applications, setApplications] = useState(getStoredApplications);

  // Gemini AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  // Opportunities & Apply Modal
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedInboxApp, setSelectedInboxApp] = useState(null);

  // Filters for campaigns
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sync wallet & applications from custom events
  useEffect(() => {
    const handleWalletUpdate = (e) => {
      if (e.detail) setWallet(e.detail);
      else setWallet(getCreatorWallet());
    };
    const handleAppsUpdate = (e) => {
      if (e.detail) setApplications(e.detail);
      else setApplications(getStoredApplications());
    };

    window.addEventListener('nefra_wallet_updated', handleWalletUpdate);
    window.addEventListener('nefra_applications_updated', handleAppsUpdate);
    return () => {
      window.removeEventListener('nefra_wallet_updated', handleWalletUpdate);
      window.removeEventListener('nefra_applications_updated', handleAppsUpdate);
    };
  }, []);

  // Quick Refill (+15 Credits)
  const handleRefillCredits = () => {
    const updated = refillDemoCredits();
    setWallet(updated);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.3 } });
  };

  // Run Gemini 3-Video Analysis
  const handleRunAiAudit = async () => {
    if (!creator || !creator.recentVideos) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCreatorVideosWithGemini(
        apiKey,
        creator,
        creator.recentVideos
      );
      setAnalysisResult(result);
      setIsAnalyzing(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch (err) {
      console.warn('AI Analysis notice:', err.message);
      setIsAnalyzing(false);
    }
  };

  // Enroll in Top 10 Directory
  const handleEnrollInDirectory = () => {
    if (!creator) return;
    const enrolled = {
      ...creator,
      category: analysisResult?.category || creator.category,
      categoryLabel: analysisResult?.categoryLabel || creator.categoryLabel,
      subCategory: analysisResult?.subCategory || creator.subCategory || 'Featured Content Creation',
      nefraScore: analysisResult?.nefraScore || creator.nefraScore || 95,
      tags: analysisResult?.tags || creator.tags || [],
      aiSummary: analysisResult?.aiSummary || creator.aiSummary,
      audience: analysisResult?.audience || creator.audience,
      videoReviews: analysisResult?.videoReviews || [],
    };
    if (onCreatorEnrolled) {
      onCreatorEnrolled(enrolled);
    }
    setEnrolledSuccess(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Accept / Decline Brand Offer
  const handleAcceptOffer = async (app) => {
    const updated = await updateApplicationStatus(app.id, 'accepted');
    setApplications(updated);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    if (selectedInboxApp?.id === app.id) {
      setSelectedInboxApp((prev) => ({ ...prev, status: 'accepted' }));
    }
  };

  const handleDeclineOffer = async (app) => {
    const updated = await updateApplicationStatus(app.id, 'declined');
    setApplications(updated);
    if (selectedInboxApp?.id === app.id) {
      setSelectedInboxApp((prev) => ({ ...prev, status: 'declined' }));
    }
  };

  // Filtered Campaigns
  const appliedCampaignIds = applications.map((a) => a.campaignId);
  const matchedCampaigns = SEED_CAMPAIGNS.map((c) => ({
    ...c,
    matchScore: calculateMatchScore(creator, c),
    isApplied: appliedCampaignIds.includes(c.id)
  })).filter((c) => {
    if (categoryFilter !== 'all' && c.targetCategory !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.brandName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased pb-16">
      
      {/* Light Preline Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Channel Identity */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 tracking-tight">
                  NEFRA CREATOR STUDIO
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Creator Portal
                </span>
              </div>
              <span className="text-2xs text-slate-400 block -mt-0.5">
                Logged in as <strong>{creator.title}</strong>
              </span>
            </div>
          </div>

          {/* Right Header CTAs: Credits, Refill, Sign Out */}
          <div className="flex items-center gap-3">
            
            {/* Wallet Pill */}
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              <Coins className="size-4 text-amber-500 shrink-0" />
              <span>{wallet.balance} Credits</span>
              <button
                type="button"
                onClick={handleRefillCredits}
                className="ml-1 text-2xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                title="Claim daily bonus (+15 credits)"
              >
                +15 Refill
              </button>
            </div>

            {/* Channel Avatar */}
            <img
              src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={creator.title}
              className="size-8 rounded-full object-cover border border-slate-200"
            />

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onSignOut}
              className="py-1.5 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <LogOut className="size-3.5 text-slate-400" />
              Sign Out
            </button>

          </div>

        </div>
      </header>

      {/* Main Single Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Welcome Profile Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img
                src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={creator.title}
                className="size-16 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900">
                    Welcome back, {creator.title}
                  </h1>
                  <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="size-3" />
                    Verified Partner
                  </span>
                  <span className="inline-flex items-center py-0.5 px-2 rounded-md text-2xs font-medium bg-slate-100 text-slate-700">
                    {creator.categoryLabel || creator.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {creator.handle || '@creator'} • {creator.subscribersFormatted || '1.68M'} Subscribers • {creator.totalViews || '185M Views'} • {creator.country || 'JAPAC'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-2xs text-slate-500">
                  <span>Engagement: <strong>{creator.audience?.avgEngagementRate || '6.4%'}</strong></span>
                  <span>•</span>
                  <span>Audited Style: <em>{creator.aiSummary || 'High quality original creator'}</em></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
              <button
                type="button"
                onClick={handleRunAiAudit}
                disabled={isAnalyzing}
                className="py-2 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
                {isAnalyzing ? 'Auditing 3 Videos...' : 'Run Gemini 3-Video Audit'}
              </button>

              {!enrolledSuccess ? (
                <button
                  type="button"
                  onClick={handleEnrollInDirectory}
                  className="py-2 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <Award className="size-3.5 text-blue-600" />
                  Enroll in Directory
                </button>
              ) : (
                <span className="py-2 px-3 inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-3.5" />
                  Enrolled & Synced
                </span>
              )}
            </div>

          </div>

          {/* 4 Light-Themed KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100">
            
            {/* KPI 1: Wallet */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <span>Credit Balance</span>
                <Coins className="size-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {wallet.balance} <span className="text-xs font-normal text-slate-400">Credits</span>
              </div>
              <span className="text-2xs text-slate-500">5 credits per application</span>
            </div>

            {/* KPI 2: Reach */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <span>Subscribers</span>
                <Video className="size-3.5 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {creator.subscribersFormatted || '1.68M'}
              </div>
              <span className="text-2xs text-slate-500">{creator.totalViews || '185M'} Total Views</span>
            </div>

            {/* KPI 3: Content Score */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <span>Nefra Content Score</span>
                <Award className="size-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {analysisResult?.nefraScore || creator.nefraScore || 96} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <span className="text-2xs text-emerald-600 font-medium">Gemini Evaluated</span>
            </div>

            {/* KPI 4: Deals & Pipeline */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <span>Pipeline Deals</span>
                <Inbox className="size-3.5 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {applications.length} Active
              </div>
              <span className="text-2xs text-amber-600 font-medium">1 Offer received</span>
            </div>

          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-2xs">
          <nav className="flex space-x-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'Overview Dashboard' },
              { id: 'audit', label: '3-Video Content Audit' },
              { id: 'deals', label: 'Brand Opportunities' },
              { id: 'inbox', label: `My Pipeline (${applications.length})` },
              { id: 'wallet', label: 'Credits & Wallet' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`py-2 px-3.5 rounded-lg transition-colors ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* SECTION 1: 3-VIDEO AUDIT & SCORECARDS */}
        {(activeSection === 'all' || activeSection === 'audit') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  3 Latest Uploads & Visual Metric Scorecards
                </h3>
                <p className="text-xs text-slate-500">
                  Multimodal analysis performed by Gemini Flash evaluating production, retention, and brand alignment.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600">
                3 Videos Analyzed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(creator.recentVideos || []).slice(0, 3).map((video, idx) => {
                const review = analysisResult?.videoReviews?.[idx] || {
                  productionQuality: 92 - idx * 3,
                  engagementIndex: 89 + idx * 2,
                  brandSafety: 98,
                  tips: 'Excellent visual framing and retention. Consistent pacing with clear narrative delivery.'
                };

                return (
                  <div 
                    key={video.id || idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video bg-slate-100">
                        <img
                          src={video.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-2xs font-bold">
                          Video #{idx + 1}
                        </div>
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-white text-2xs">
                          {video.viewCountFormatted || 'Upload'}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {video.title}
                        </h4>

                        {/* Metric Bars */}
                        <div className="space-y-2 text-2xs pt-2 border-t border-slate-200">
                          <div>
                            <div className="flex justify-between text-slate-600 mb-0.5">
                              <span>Production Quality</span>
                              <strong className="text-slate-900">{review.productionQuality}%</strong>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${review.productionQuality}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-600 mb-0.5">
                              <span>Retention Index</span>
                              <strong className="text-slate-900">{review.engagementIndex}%</strong>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${review.engagementIndex}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-slate-600 mb-0.5">
                              <span>Brand Alignment</span>
                              <strong className="text-slate-900">{review.brandSafety}%</strong>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${review.brandSafety}%` }} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-3 bg-white border-t border-slate-200 text-2xs text-slate-600">
                      <strong className="text-slate-800 block mb-0.5">Gemini Critique:</strong>
                      {review.tips}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: BRAND OPPORTUNITIES */}
        {(activeSection === 'all' || activeSection === 'deals') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Matched Brand Campaign Opportunities
                </h3>
                <p className="text-xs text-slate-500">
                  Active sponsorships matched with your channel category and audited audience.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deals..."
                  className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="music">Music</option>
                  <option value="tech">Tech</option>
                  <option value="travel">Travel</option>
                  <option value="gaming">Gaming</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>

            {/* Campaign Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedCampaigns.map((camp) => (
                <div 
                  key={camp.id}
                  className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    {/* Top Brand Info */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={camp.brandLogo}
                          alt={camp.brandName}
                          className="size-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 block leading-tight">
                            {camp.brandName}
                          </strong>
                          <span className="text-2xs text-slate-500">
                            {camp.targetCategoryLabel || camp.targetCategory}
                          </span>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <span className="inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <TrendingUp className="size-3" />
                        {camp.matchScore}% Match
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mb-1">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {camp.description}
                    </p>

                    {/* Meta row */}
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg text-2xs mb-3">
                      <div>
                        <span className="text-slate-400 block">Compensation</span>
                        <strong className="text-slate-900">{camp.budgetFormatted}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Deliverable</span>
                        <span className="text-slate-700 font-medium">{camp.deliverable}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xs text-slate-500">
                      Fee: <strong>5 Credits</strong>
                    </span>

                    {camp.isApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="size-3.5" />
                        Proposal Submitted
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCampaignForApply(camp);
                          setIsApplyModalOpen(true);
                        }}
                        className="py-1.5 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
                      >
                        <Sparkles className="size-3.5" />
                        Apply with AI Pitch
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 3: INBOX & PIPELINE */}
        {(activeSection === 'all' || activeSection === 'inbox') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Applications & Brand Offers Inbox
                </h3>
                <p className="text-xs text-slate-500">
                  Track sponsor reviews, accept incoming offers, and review your submitted pitches.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {applications.length} Submissions
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-xs font-bold text-slate-900">
                        {app.campaignTitle}
                      </strong>
                      
                      {app.status === 'offer_received' && (
                        <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-2xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Brand Offer Received
                        </span>
                      )}
                      {app.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="size-3" />
                          Accepted
                        </span>
                      )}
                      {app.status === 'pending' && (
                        <span className="inline-flex items-center py-0.5 px-2 rounded-full text-2xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          Under Review
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Brand: <strong>{app.brandName}</strong> • Agreed: <strong>{app.budgetFormatted}</strong> • Deliverable: {app.deliverable}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'offer_received' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(app)}
                          className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Accept Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineOffer(app)}
                          className="py-1.5 px-2.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedInboxApp(app)}
                      className="py-1.5 px-2.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      View Pitch
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 4: WALLET TRANSACTION HISTORY */}
        {(activeSection === 'all' || activeSection === 'wallet') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Credit Wallet & Activity Ledger
                </h3>
                <p className="text-xs text-slate-500">
                  Transparent record of grants, daily refills, and campaign proposal submissions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefillCredits}
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-2xs"
              >
                +15 Daily Refill
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left divide-y divide-slate-100">
                <thead>
                  <tr className="text-slate-400 font-semibold uppercase text-2xs">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Activity</th>
                    <th className="py-2.5">Note</th>
                    <th className="py-2.5 text-right">Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(wallet.history || []).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2.5 text-slate-500 whitespace-nowrap">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 font-medium text-slate-900">
                        {tx.title}
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {tx.note || '—'}
                      </td>
                      <td className="py-2.5 text-right font-bold whitespace-nowrap">
                        <span className={tx.delta > 0 ? 'text-emerald-600' : 'text-slate-800'}>
                          {tx.delta > 0 ? `+${tx.delta}` : tx.delta} cr
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* Apply Proposal Modal */}
      <ApplyProposalModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        campaign={selectedCampaignForApply}
        creator={creator}
        apiKey={apiKey}
        wallet={wallet}
        onApplicationSubmitted={(newApp) => {
          setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
        }}
        onWalletUpdated={() => {
          setWallet(getCreatorWallet());
        }}
      />

      {/* View Pitch Modal */}
      {selectedInboxApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{selectedInboxApp.campaignTitle}</h4>
                <p className="text-xs text-slate-500">Brand: {selectedInboxApp.brandName} • {selectedInboxApp.budgetFormatted}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInboxApp(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-2xs font-semibold uppercase text-slate-400 mb-1">
                Your Submitted AI Pitch
              </label>
              <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedInboxApp.pitchText}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInboxApp(null)}
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
