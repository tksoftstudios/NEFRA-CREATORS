import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Video, 
  Building2, 
  Globe2, 
  DollarSign, 
  Share2, 
  Check, 
  AlertCircle,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { connectYouTubeWithServer } from '../../services/youtubeOAuthService';
import { saveCreatorProfile, saveBrandProfile } from '../../services/authService';
import { AutoAuditModal } from '../creator/AutoAuditModal';

function YoutubeIcon({ className = "w-5 h-5", size = 20 }) {
  return (
    <svg style={{ width: size, height: size }} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4", size = 16 }) {
  return (
    <svg style={{ width: size, height: size }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4", size = 16 }) {
  return (
    <svg style={{ width: size, height: size }} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4", size = 16 }) {
  return (
    <svg style={{ width: size, height: size }} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const GLOBAL_COUNTRIES = [
  'Sri Lanka',
  'United States',
  'United Kingdom',
  'Singapore',
  'India',
  'Australia',
  'Canada',
  'Germany',
  'United Arab Emirates',
  'Japan',
  'France',
  'Brazil',
  'Indonesia',
  'Malaysia',
  'Nigeria',
  'South Africa',
  'Kenya',
  'Philippines',
  'Other'
];

const CREATOR_CATEGORIES = [
  'Education & Science',
  'Technology & AI',
  'Gaming & Esports',
  'Business & Finance',
  'Lifestyle & Travel',
  'Entertainment & Comedy',
  'Fashion & Beauty',
  'Health & Fitness'
];

const LANGUAGES = [
  'English',
  'Sinhala',
  'Tamil',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Japanese',
  'Chinese'
];

export function OnboardingStepper({ 
  user, 
  initialRole = 'creator', 
  onComplete, 
  onSignOut 
}) {
  const [role, setRole] = useState(initialRole);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ---------------- Creator State ----------------
  const [creatorForm, setCreatorForm] = useState({
    name: user?.displayName || '',
    country: 'Sri Lanka',
    category: 'Education & Science',
    languages: ['English'],
    bio: '',
    // Social Connections
    youtubeConnected: false,
    youtubeData: null,
    instagram: '',
    tiktok: '',
    twitter: '',
    linkedin: '',
    // Modality & Rates
    modalities: ['online'],
    startingPriceUsd: 850,
    willingToTravel: true
  });

  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const [autoAuditChannel, setAutoAuditChannel] = useState(null);

  // ---------------- Business State ----------------
  const [brandForm, setBrandForm] = useState({
    companyName: user?.displayName ? `${user.displayName}'s Brand` : '',
    website: '',
    country: 'United States',
    industry: 'SaaS & Enterprise Tech',
    businessSize: '11-50', // '1-10' | '11-50' | '51-250' | '250+'
    monthlyBudgetTier: '$5,000 - $25,000',
    campaignGoals: ['Dedicated Product Reviews', 'Short-Form Virality'],
    targetRegions: ['Global', 'South Asia']
  });

  // Handle YouTube OAuth Connect
  const handleConnectYouTube = async () => {
    setIsConnectingYouTube(true);
    setErrorMessage('');
    try {
      const result = await connectYouTubeWithServer({ creatorId: user.uid });
      if (result.success && result.channel) {
        setCreatorForm(prev => ({
          ...prev,
          youtubeConnected: true,
          youtubeData: result.channel,
          name: prev.name || result.channel.title
        }));

        // Launch Automatic Audit & Rate Card Calibration
        setAutoAuditChannel(result.channel);
      }
    } catch (err) {
      console.error('[Onboarding] YouTube connect notice:', err);
      setErrorMessage(err.message || 'Failed to connect YouTube channel.');
    } finally {
      setIsConnectingYouTube(false);
    }
  };

  const handleAutoAuditComplete = ({ audit, rateCards }) => {
    if (autoAuditChannel) {
      setCreatorForm(prev => ({
        ...prev,
        category: audit?.category || prev.category,
        startingPriceUsd: rateCards?.[0] ? Math.round(rateCards[0].priceCents / 100) : prev.startingPriceUsd
      }));
    }
    setAutoAuditChannel(null);
  };

  // Validation Check: Content Creator Socials
  const hasAtLeastOneSocialNetwork = () => {
    if (creatorForm.youtubeConnected) return true;
    if (creatorForm.instagram && creatorForm.instagram.trim().length > 1) return true;
    if (creatorForm.tiktok && creatorForm.tiktok.trim().length > 1) return true;
    if (creatorForm.twitter && creatorForm.twitter.trim().length > 1) return true;
    if (creatorForm.linkedin && creatorForm.linkedin.trim().length > 1) return true;
    return false;
  };

  // Step Navigation Check
  const canProceedToNextStep = () => {
    if (role === 'creator') {
      if (currentStep === 1) {
        return creatorForm.name.trim().length > 0 && creatorForm.country;
      }
      if (currentStep === 2) {
        return hasAtLeastOneSocialNetwork();
      }
      if (currentStep === 3) {
        return creatorForm.startingPriceUsd > 0 && creatorForm.modalities.length > 0;
      }
    } else {
      // Business
      if (currentStep === 1) {
        return brandForm.companyName.trim().length > 0 && brandForm.country;
      }
      if (currentStep === 2) {
        return Boolean(brandForm.businessSize && brandForm.monthlyBudgetTier);
      }
      if (currentStep === 3) {
        return brandForm.campaignGoals.length > 0;
      }
    }
    return true;
  };

  // Final Form Submission
  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (role === 'creator') {
        const payload = {
          name: creatorForm.name,
          handle: creatorForm.youtubeData?.handle || `@${creatorForm.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: creatorForm.youtubeData?.avatar || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          country: creatorForm.country,
          residence: creatorForm.country,
          category: creatorForm.category,
          languages: creatorForm.languages,
          bio: creatorForm.bio || `${creatorForm.name} verified creator channel.`,
          subscribers: creatorForm.youtubeData?.subscribers || 0,
          subscribersFormatted: creatorForm.youtubeData?.subscribersFormatted || '0',
          viewCount: creatorForm.youtubeData?.viewCount || 0,
          videoCount: creatorForm.youtubeData?.videoCount || 0,
          recentVideos: creatorForm.youtubeData?.recentUploads || [],
          youtube: creatorForm.youtubeData || null,
          youtubeConnected: creatorForm.youtubeConnected,
          verified: creatorForm.youtubeConnected,
          credits: 50, // Welcome creator gift credits!
          creatorCredits: 50,
          startingPriceCents: Math.round(Number(creatorForm.startingPriceUsd) * 100),
          modalityPreference: creatorForm.modalities,
          willingToTravel: creatorForm.willingToTravel,
          socialHandles: {
            instagram: creatorForm.instagram,
            tiktok: creatorForm.tiktok,
            twitter: creatorForm.twitter,
            linkedin: creatorForm.linkedin
          },
          googleAccount: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        };

        const saved = await saveCreatorProfile(user.uid, payload);
        if (onComplete) onComplete({ role: 'creator', profile: saved });
      } else {
        // Business Profile
        const payload = {
          companyName: brandForm.companyName,
          website: brandForm.website,
          country: brandForm.country,
          industry: brandForm.industry,
          businessSize: brandForm.businessSize,
          monthlyBudgetTier: brandForm.monthlyBudgetTier,
          campaignGoals: brandForm.campaignGoals,
          targetRegions: brandForm.targetRegions,
          credits: 250, // Welcome brand marketing credits!
          brandCredits: 250,
          googleAccount: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        };

        const saved = await saveBrandProfile(user.uid, payload);
        if (onComplete) onComplete({ role: 'brand', profile: saved });
      }
    } catch (err) {
      console.error('[Onboarding] Submission failed:', err);
      setErrorMessage(err.message || 'Failed to complete onboarding. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#e11d48]/15 via-[#3b82f6]/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Account Info Pill & Sign-out button */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2 text-xs text-[#a1a1aa]">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full border border-[#27272a]" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#27272a] flex items-center justify-center text-[10px] text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span>Signed in as <strong className="text-white">{user?.email}</strong></span>
        </div>

        <button
          onClick={onSignOut}
          className="text-xs text-[#71717a] hover:text-[#e11d48] flex items-center space-x-1 transition-colors cursor-pointer"
          title="Switch to another Google profile"
        >
          <LogOut size={13} />
          <span>Switch Account</span>
        </button>
      </div>

      {/* Main Stepper Card */}
      <div className="w-full max-w-2xl bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 flex flex-col">
        {/* Stepper Header: Role Switcher */}
        <div className="flex items-center justify-between border-b border-[#27272a] pb-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#a1a1aa]">
                Onboarding Stepper
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1">
              Welcome to NEFRA Creators
            </h2>
          </div>

          {/* Toggle Role */}
          <div className="flex items-center bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
            <button
              type="button"
              onClick={() => { setRole('creator'); setCurrentStep(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                role === 'creator'
                  ? 'bg-[#e11d48] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Video size={13} />
              <span>Creator</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('brand'); setCurrentStep(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                role === 'brand'
                  ? 'bg-[#3b82f6] text-white shadow-md'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Building2 size={13} />
              <span>Business</span>
            </button>
          </div>
        </div>

        {/* 3-Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-[#a1a1aa] mb-2">
            <span className={currentStep === 1 ? 'text-white font-bold' : ''}>
              1. {role === 'creator' ? 'Global Identity' : 'Company Profile'}
            </span>
            <span className={currentStep === 2 ? 'text-white font-bold' : ''}>
              2. {role === 'creator' ? 'Connect Socials' : 'Size & Budget'}
            </span>
            <span className={currentStep === 3 ? 'text-white font-bold' : ''}>
              3. {role === 'creator' ? 'Rates & Modality' : 'Campaign Goals'}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#18181b] rounded-full overflow-hidden flex">
            <div 
              className={`h-full transition-all duration-300 ${role === 'creator' ? 'bg-[#e11d48]' : 'bg-[#3b82f6]'}`}
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEPPER CONTENT: CREATOR */}
        {role === 'creator' && (
          <div className="space-y-6 flex-1">
            {/* STEP 1: Global Identity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                    Creator / Channel Name *
                  </label>
                  <input
                    type="text"
                    value={creatorForm.name}
                    onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                    placeholder="e.g. TKSOFT STUDIOS or Kaveen Kudagala"
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#e11d48]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      Country of Residence (Global) *
                    </label>
                    <select
                      value={creatorForm.country}
                      onChange={(e) => setCreatorForm({ ...creatorForm, country: e.target.value })}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e11d48] cursor-pointer"
                    >
                      {GLOBAL_COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      Primary Niche / Category *
                    </label>
                    <select
                      value={creatorForm.category}
                      onChange={(e) => setCreatorForm({ ...creatorForm, category: e.target.value })}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e11d48] cursor-pointer"
                    >
                      {CREATOR_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                    Languages Spoken / Content Language
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map(lang => {
                      const isSelected = creatorForm.languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setCreatorForm({
                                ...creatorForm,
                                languages: creatorForm.languages.filter(l => l !== lang)
                              });
                            } else {
                              setCreatorForm({
                                ...creatorForm,
                                languages: [...creatorForm.languages, lang]
                              });
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#e11d48] text-white'
                              : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                    Short Bio / Channel Overview
                  </label>
                  <textarea
                    rows={3}
                    value={creatorForm.bio}
                    onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                    placeholder="Tell brands about your audience demographics, production quality, and creative formats..."
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#e11d48]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Connect Social Networks (Mandatory >= 1) */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-[#18181b]/80 border border-[#27272a]">
                  <div className="flex items-start space-x-2.5">
                    <ShieldCheck size={18} className="text-[#10b981] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-white">Connect At Least One Social Network</p>
                      <p className="text-[#a1a1aa] mt-0.5">
                        To protect brand escrow deposits and guarantee genuine reach, you must connect your YouTube channel or provide your social handles.
                      </p>
                    </div>
                  </div>
                </div>

                {/* YouTube Connect Card */}
                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                      <YoutubeIcon size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <span>YouTube Channel</span>
                        {creatorForm.youtubeConnected && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                            Connected
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-[#a1a1aa]">
                        {creatorForm.youtubeConnected
                          ? `${creatorForm.youtubeData?.title} (${creatorForm.youtubeData?.subscribersFormatted || '0'} subs)`
                          : 'Connect your verified channel with Google OAuth'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {creatorForm.youtubeConnected ? (
                      <span className="text-xs text-[#10b981] font-medium flex items-center space-x-1">
                        <CheckCircle2 size={14} />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleConnectYouTube}
                        disabled={isConnectingYouTube}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer"
                      >
                        {isConnectingYouTube ? 'Connecting...' : 'Connect YouTube'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Additional / Alternative Socials */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-[#a1a1aa]">
                    Or connect other social networks:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-[#e1306c]">
                        <InstagramIcon size={15} />
                      </div>
                      <input
                        type="text"
                        value={creatorForm.instagram}
                        onChange={(e) => setCreatorForm({ ...creatorForm, instagram: e.target.value })}
                        placeholder="Instagram @handle"
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-[#1da1f2]">
                        <TwitterIcon size={15} />
                      </div>
                      <input
                        type="text"
                        value={creatorForm.twitter}
                        onChange={(e) => setCreatorForm({ ...creatorForm, twitter: e.target.value })}
                        placeholder="X (Twitter) @handle"
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div className="relative">
                      <Share2 size={15} className="absolute left-3 top-2.5 text-[#a1a1aa]" />
                      <input
                        type="text"
                        value={creatorForm.tiktok}
                        onChange={(e) => setCreatorForm({ ...creatorForm, tiktok: e.target.value })}
                        placeholder="TikTok @handle"
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-[#0077b5]">
                        <LinkedinIcon size={15} />
                      </div>
                      <input
                        type="text"
                        value={creatorForm.linkedin}
                        onChange={(e) => setCreatorForm({ ...creatorForm, linkedin: e.target.value })}
                        placeholder="LinkedIn / Portfolio URL"
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>
                  </div>
                </div>

                {/* Validation Badge */}
                <div className="pt-2">
                  {hasAtLeastOneSocialNetwork() ? (
                    <div className="flex items-center space-x-2 text-xs text-[#10b981]">
                      <CheckCircle2 size={15} />
                      <span>Social network requirement fulfilled. You may proceed.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-xs text-amber-400">
                      <AlertCircle size={15} />
                      <span>Please connect YouTube or enter at least one active handle.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Modality & Rates */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                    Campaign Modality Preferences
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'online', label: 'Online / Digital', desc: 'Dedicated videos, shorts, integrations' },
                      { id: 'physical', label: 'In-Person / Events', desc: 'Conferences, launches, meetups' },
                      { id: 'hybrid', label: 'Hybrid', desc: 'Combination of digital & presence' }
                    ].map(mod => {
                      const isChecked = creatorForm.modalities.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => {
                            if (isChecked) {
                              if (creatorForm.modalities.length > 1) {
                                setCreatorForm({
                                  ...creatorForm,
                                  modalities: creatorForm.modalities.filter(m => m !== mod.id)
                                });
                              }
                            } else {
                              setCreatorForm({
                                ...creatorForm,
                                modalities: [...creatorForm.modalities, mod.id]
                              });
                            }
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#18181b] border-[#e11d48] text-white'
                              : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{mod.label}</span>
                            {isChecked && <Check size={14} className="text-[#e11d48]" />}
                          </div>
                          <p className="text-[11px] text-[#71717a] mt-1">{mod.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      Starting Package Rate (USD $) *
                    </label>
                    <div className="relative">
                      <DollarSign size={15} className="absolute left-3 top-2.5 text-[#10b981]" />
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={creatorForm.startingPriceUsd}
                        onChange={(e) => setCreatorForm({ ...creatorForm, startingPriceUsd: Number(e.target.value) })}
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#e11d48]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      Willing to Travel Globally?
                    </label>
                    <div className="flex items-center space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setCreatorForm({ ...creatorForm, willingToTravel: true })}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                          creatorForm.willingToTravel
                            ? 'bg-[#18181b] border-[#10b981] text-white'
                            : 'border-[#27272a] text-[#71717a]'
                        }`}
                      >
                        Yes, willing to travel
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreatorForm({ ...creatorForm, willingToTravel: false })}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border cursor-pointer ${
                          !creatorForm.willingToTravel
                            ? 'bg-[#18181b] border-[#e11d48] text-white'
                            : 'border-[#27272a] text-[#71717a]'
                        }`}
                      >
                        Remote only
                      </button>
                    </div>
                  </div>
                </div>

                {/* Welcome Bonus Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#e11d48]/10 via-[#9333ea]/10 to-transparent border border-[#e11d48]/20 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">50 AI Credits Welcome Grant</p>
                    <p className="text-[#a1a1aa]">
                      Upon finalizing registration, 50 free credits will be deposited to your wallet for AI Channel Audits and Campaign Proposals.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEPPER CONTENT: BUSINESS */}
        {role === 'brand' && (
          <div className="space-y-6 flex-1">
            {/* STEP 1: Company Profile */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={brandForm.companyName}
                    onChange={(e) => setBrandForm({ ...brandForm, companyName: e.target.value })}
                    placeholder="e.g. Acme Corp, TechVentures or Pixel Studio"
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      HQ Country (Global) *
                    </label>
                    <select
                      value={brandForm.country}
                      onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6] cursor-pointer"
                    >
                      {GLOBAL_COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                      Industry / Sector *
                    </label>
                    <select
                      value={brandForm.industry}
                      onChange={(e) => setBrandForm({ ...brandForm, industry: e.target.value })}
                      className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6] cursor-pointer"
                    >
                      {[
                        'SaaS & Enterprise Tech',
                        'E-commerce & Direct-to-Consumer',
                        'FinTech & Web3',
                        'Gaming & Entertainment',
                        'Education & EdTech',
                        'Health & Wellness',
                        'Media & Agency'
                      ].map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                    Corporate Website
                  </label>
                  <input
                    type="url"
                    value={brandForm.website}
                    onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Business Size & Marketing Budget */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                    Size of Business *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: '1-10', label: '1 - 10 employees', desc: 'Startup / Boutique' },
                      { id: '11-50', label: '11 - 50 employees', desc: 'Growth Scale' },
                      { id: '51-250', label: '51 - 250 employees', desc: 'Mid-Market' },
                      { id: '250+', label: '250+ employees', desc: 'Enterprise' }
                    ].map(size => {
                      const isSelected = brandForm.businessSize === size.id;
                      return (
                        <div
                          key={size.id}
                          onClick={() => setBrandForm({ ...brandForm, businessSize: size.id })}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#18181b] border-[#3b82f6] text-white'
                              : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                          }`}
                        >
                          <p className="text-xs font-bold">{size.label}</p>
                          <p className="text-[11px] text-[#71717a] mt-0.5">{size.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                    Monthly Influencer & Creator Budget Tier *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Under $5,000 / month',
                      '$5,000 - $25,000 / month',
                      '$25,000 - $100,000 / month',
                      '$100,000+ / month'
                    ].map(tier => {
                      const isSelected = brandForm.monthlyBudgetTier === tier;
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setBrandForm({ ...brandForm, monthlyBudgetTier: tier })}
                          className={`p-3 text-left rounded-xl border cursor-pointer transition-all text-xs font-medium ${
                            isSelected
                              ? 'bg-[#18181b] border-[#3b82f6] text-white'
                              : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Campaign Goals & Global Scope */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                    Primary Campaign Goals
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Dedicated Product Reviews (YouTube 4K)',
                      'Short-Form Virality (Shorts & Reels)',
                      'Podcast Sponsorships & Host Reads',
                      'Brand Ambassadorship & Retainers',
                      'Keynote & Live Event Activations'
                    ].map(goal => {
                      const isChecked = brandForm.campaignGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setBrandForm({
                                ...brandForm,
                                campaignGoals: brandForm.campaignGoals.filter(g => g !== goal)
                              });
                            } else {
                              setBrandForm({
                                ...brandForm,
                                campaignGoals: [...brandForm.campaignGoals, goal]
                              });
                            }
                          }}
                          className={`p-2.5 text-left rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-[#18181b] border-[#3b82f6] text-white'
                              : 'bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46]'
                          }`}
                        >
                          <span>{goal}</span>
                          {isChecked && <Check size={14} className="text-[#3b82f6]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                    Target Creator Audience Geographies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Global', 'North America', 'Europe', 'South Asia (Sri Lanka, India)', 'Asia Pacific', 'Middle East'].map(region => {
                      const isChecked = brandForm.targetRegions.includes(region);
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setBrandForm({
                                ...brandForm,
                                targetRegions: brandForm.targetRegions.filter(r => r !== region)
                              });
                            } else {
                              setBrandForm({
                                ...brandForm,
                                targetRegions: [...brandForm.targetRegions, region]
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                            isChecked
                              ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                              : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                          }`}
                        >
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200">
                  <p className="font-semibold">Pre-Funded Escrow Guarantee</p>
                  <p className="text-blue-300/80 mt-0.5">
                    All contracts on NEFRA require 100% pre-funding into escrow before kickoff, protecting both your brand deliverables and creator milestones.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEPPER FOOTER BUTTONS */}
        <div className="mt-8 pt-6 border-t border-[#27272a] flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="border-[#27272a] hover:bg-[#18181b] text-xs cursor-pointer flex items-center space-x-1.5"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep < 3 ? (
              <Button
                size="sm"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceedToNextStep()}
                className={`${
                  role === 'creator' ? 'bg-[#e11d48] hover:bg-[#be123c]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'
                } text-white text-xs font-medium flex items-center space-x-1.5 cursor-pointer disabled:opacity-50`}
              >
                <span>Continue</span>
                <ArrowRight size={13} />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting || !canProceedToNextStep()}
                className={`${
                  role === 'creator' ? 'bg-[#e11d48] hover:bg-[#be123c]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'
                } text-white text-xs font-medium flex items-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg`}
              >
                {isSubmitting ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Complete Onboarding & Enter Portal</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AutoAuditModal
        isOpen={Boolean(autoAuditChannel)}
        channel={autoAuditChannel}
        creator={user}
        onComplete={handleAutoAuditComplete}
      />
    </div>
  );
}
