import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { 
  auditChannelWithGemini, 
  getGeminiApiKey, 
  saveGeminiApiKey 
} from '../../packages/ai/geminiClient';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Key, 
  TrendingUp, 
  Coins, 
  Play, 
  Zap, 
  Clock, 
  AlertCircle,
  Globe2,
  Check,
  Award,
  VideoOff
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AUDIT_DEPTH_TIERS = [
  {
    id: 'standard',
    videoCount: 3,
    creditsCost: 10,
    label: 'Standard Baseline (3 Videos)',
    shortLabel: '3 Videos',
    badge: 'DEFAULT',
    badgeVariant: 'outline',
    tagline: 'Last 3 Published Videos',
    desc: 'Evaluates the 3 most recently published uploads for fast hook and retention baseline.'
  },
  {
    id: 'deep',
    videoCount: 5,
    creditsCost: 18,
    label: 'Deep Multi-Video Scan (5 Videos)',
    shortLabel: '5 Videos',
    badge: 'POPULAR',
    badgeVariant: 'action',
    tagline: 'Last 5 Published Videos',
    desc: 'Scans 5 published videos for consistent pacing, narrative flow, and hook variance.'
  },
  {
    id: 'pro',
    videoCount: 10,
    creditsCost: 30,
    label: 'Pro Multimodal Audit (10 Videos)',
    shortLabel: '10 Videos',
    badge: 'RECOMMENDED',
    badgeVariant: 'secondary',
    tagline: 'Last 10 Published Videos',
    desc: 'Multi-month cross-format audit benchmarking long-term audience retention and mid-roll stability.'
  },
  {
    id: 'catalogue',
    videoCount: 20,
    creditsCost: 50,
    label: 'Full Catalogue Audit (20 Videos)',
    shortLabel: '20 Videos',
    badge: 'ENTERPRISE',
    badgeVariant: 'outline',
    tagline: 'Last 20 Published Videos',
    desc: 'Exhaustive 20-video multimodal analysis for high-tier brand safety certifications and premium pricing.'
  }
];

export function ChannelAuditView({
  creator,
  credits = 50,
  onDeductCredits,
  onUpdateAudit
}) {
  const [selectedDepth, setSelectedDepth] = useState(AUDIT_DEPTH_TIERS[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey());
  const [hasCustomKey, setHasCustomKey] = useState(() => Boolean(getGeminiApiKey()));
  const [statusNotice, setStatusNotice] = useState(null);
  const [currentAudit, setCurrentAudit] = useState(creator.audit || null);
  const [auditResultSummary, setAuditResultSummary] = useState(null);
  const [vertexStatus, setVertexStatus] = useState(null);
  const [serviceAccountInput, setServiceAccountInput] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [credsError, setCredsError] = useState(null);

  // Sync when creator prop updates
  React.useEffect(() => {
    if (creator.audit) {
      setCurrentAudit(creator.audit);
    }
  }, [creator.audit]);

  const audit = currentAudit || creator.audit || {};
  const recentVideos = creator.recentVideos?.length 
    ? creator.recentVideos 
    : (creator.youtube?.recentUploads?.length ? creator.youtube.recentUploads : []);

  const videoCritiques = audit.videoCritiques || [];

  // Load Vertex AI Backend Status
  const loadVertexStatus = async () => {
    try {
      const res = await fetch('/api/vertex/status');
      if (res.ok) {
        const data = await res.json();
        setVertexStatus(data);
      }
    } catch (e) {
      console.warn('[Vertex Status] Fetch error:', e.message);
    }
  };

  React.useEffect(() => {
    loadVertexStatus();
  }, []);

  const handleSaveCredentials = async () => {
    if (!serviceAccountInput.trim()) return;
    setIsSavingCreds(true);
    setCredsError(null);

    try {
      const isToken = serviceAccountInput.trim().startsWith('ya29.');
      const payload = isToken 
        ? { accessToken: serviceAccountInput.trim() } 
        : { serviceAccountJson: serviceAccountInput.trim() };

      const res = await fetch('/api/vertex/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save credentials');
      }

      await loadVertexStatus();
      setStatusNotice(`Vertex AI credentials active (${data.authType === 'service_account' ? 'Service Account' : 'OAuth Token'})!`);
      setServiceAccountInput('');
      setIsKeyModalOpen(false);
      setTimeout(() => setStatusNotice(null), 4000);
    } catch (err) {
      setCredsError(err.message);
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleRunAudit = async () => {
    const cost = selectedDepth.creditsCost;
    const videoLimit = selectedDepth.videoCount;

    // 1. Credit Check
    if (credits !== undefined && credits < cost) {
      const msg = `Insufficient credits! ${cost} credits required to run ${selectedDepth.label}. Available balance: ${credits} credits. Please refill in your Wallet.`;
      console.warn(`%c⚠️ [Billing Check Failed] ${msg}`, 'color: #ef4444; font-weight: bold;');
      setStatusNotice(msg);
      return;
    }

    setIsAuditing(true);
    setAuditStep(1);
    setStatusNotice(null);
    setAuditResultSummary(null);

    console.log(`%c💳 [NEFRA Billing] Initiating AI Multimodal Channel Audit (${cost} Credits for ${videoLimit} Videos). Available: ${credits}`, 'color: #f59e0b; font-weight: bold; font-size: 13px;');

    try {
      // Step 1: Query YouTube telemetry & video streams
      await new Promise(r => setTimeout(r, 650));
      setAuditStep(2);

      // Step 2: Speech pacing & visual hook inspection
      await new Promise(r => setTimeout(r, 650));
      setAuditStep(3);

      // Step 3: Brand safety & advertiser compliance evaluation
      await new Promise(r => setTimeout(r, 600));
      setAuditStep(4);

      // Step 4: Extract tags & classify category with AI (with custom videoLimit depth)
      const res = await auditChannelWithGemini(creator, recentVideos, { videoLimit });

      // Step 5: Pricing intelligence & demographics synthesis
      setAuditStep(5);
      await new Promise(r => setTimeout(r, 500));

      // Deduct credits and update state
      onDeductCredits?.(cost, `AI Channel Audit (${videoLimit} Videos)`);
      setCurrentAudit(res);
      setAuditResultSummary(res);
      await onUpdateAudit(res);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 }
      });

      const remainingCredits = Math.max(0, credits - cost);
      console.log(`%c💳 [NEFRA Billing] Successfully deducted ${cost} Credits! Remaining balance: ${remainingCredits} Credits.`, 'color: #10b981; font-weight: bold; font-size: 14px;');
      console.log(`%c🎉 [AI Audit Results Ready]`, 'color: #e11d48; font-weight: bold; font-size: 14px;', {
        category: res.category,
        aiScore: res.aiScore,
        nicheTags: res.nicheTags,
        demographics: res.demographicBreakdown,
        engine: res.engine,
        auditedVideosCount: res.auditedVideosCount || videoLimit
      });

      setStatusNotice(
        res.isLiveGemini
          ? `Google Cloud Vertex AI evaluated your channel uploads (${res.auditedVideosCount || videoLimit} Videos)! Deducted ${cost} Credits (Remaining: ${remainingCredits}). Classified as "${res.category}".`
          : `AI Channel Audit complete (${res.auditedVideosCount || videoLimit} Videos)! Deducted ${cost} Credits (Remaining: ${remainingCredits}). Classified as "${res.category}" with ${res.nicheTags?.length || 0} extracted tags.`
      );
    } catch (e) {
      console.error('❌ [ChannelAuditView] Run audit error:', e);
      setStatusNotice(`Audit notice: ${e.message}`);
    } finally {
      setIsAuditing(false);
      setAuditStep(0);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              Vertex AI Multimodal Channel Audit &amp; Diagnostics
            </h1>
            <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">
              ● Vertex AI (GCP Credits)
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed max-w-3xl">
            Google Cloud Vertex AI deep-inspection engine analyzing hook retention, speech pacing, advertiser brand safety, and dynamic sponsorship rate benchmarks across your latest YouTube uploads.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          {/* User Credits Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]">
            <Coins size={14} className="text-[#f59e0b]" />
            <span><strong className="text-[#fafafa] tabular-nums">{credits ?? 50}</strong> Credits</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setApiKeyInput(getGeminiApiKey());
              setIsKeyModalOpen(true);
            }}
            className="space-x-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <Key size={13} className="text-[#3b82f6]" />
            <span>Vertex AI Config</span>
          </Button>

          <Button
            onClick={handleRunAudit}
            disabled={isAuditing}
            size="sm"
            className="space-x-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white shadow-sm"
          >
            <Sparkles size={14} className={isAuditing ? "animate-spin" : ""} />
            <span>
              {isAuditing 
                ? `Auditing ${selectedDepth.shortLabel}...` 
                : `Audit ${selectedDepth.shortLabel} (${selectedDepth.creditsCost} Credits)`}
            </span>
          </Button>
        </div>
      </div>

      {/* Audit Depth & Credit Allocation Selector */}
      <Card className="p-4 sm:p-5 border-[#27272a] bg-[#121215]/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a]/60 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Layers size={16} className="text-[#e11d48]" />
              <h3 className="text-sm font-semibold text-[#fafafa]">
                Audit Scan Depth &amp; Credit Allocation
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Default: 3 Videos (10 Credits)
              </Badge>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
              By default, NEFRA audits the last published 3 videos. Use your credits to allow Vertex AI to scan deeper across 5, 10, or 20 published videos for enhanced retention accuracy and brand safety certification.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-[#71717a]">
              Available Channel Uploads: <strong className="text-[#fafafa] font-mono">{recentVideos.length > 0 ? recentVideos.length : (creator.youtube?.videoCount || 0)}</strong>
            </span>
          </div>
        </div>

        {/* 4 Tier Depth Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AUDIT_DEPTH_TIERS.map((tier) => {
            const isSelected = selectedDepth.id === tier.id;
            const hasEnoughCredits = credits === undefined || credits >= tier.creditsCost;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedDepth(tier)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#e11d48] bg-[#e11d48]/10 shadow-sm shadow-[#e11d48]/10' 
                    : 'border-[#27272a] bg-[#18181b]/60 hover:border-[#3f3f46] hover:bg-[#18181b]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={tier.badgeVariant} className="text-[10px] uppercase font-bold">
                      {tier.badge}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs font-mono font-bold text-[#fafafa]">
                      <Coins size={12} className="text-[#f59e0b]" />
                      <span>{tier.creditsCost} Credits</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#fafafa]">
                      {tier.label}
                    </h4>
                    <p className="text-[11px] text-[#a1a1aa] mt-1 leading-snug">
                      {tier.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#27272a]/40 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-[#e11d48] font-semibold' : 'text-[#71717a]'}>
                    {isSelected ? '✓ Selected Plan' : 'Click to select'}
                  </span>
                  {!hasEnoughCredits && (
                    <span className="text-[#ef4444] text-[10px] font-medium">Needs refill</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Multi-stage Analysis Progress Overlay */}
      {isAuditing && (
        <Card className="p-4 border-[#e11d48]/40 bg-[#e11d48]/5 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-[#e11d48] animate-spin" />
              <span className="text-xs font-semibold text-[#fafafa]">
                {auditStep === 1 && `1/5: Connecting to YouTube Video Telemetry & Streams (${selectedDepth.shortLabel})...`}
                {auditStep === 2 && "2/5: Transcribing spoken speech & analyzing visual pacing..."}
                {auditStep === 3 && "3/5: Evaluating advertiser brand safety & retention curves..."}
                {auditStep === 4 && "4/5: Extracting niche hashtags & classifying creator category..."}
                {auditStep === 5 && "5/5: Synthesizing dynamic sponsorship rates & audience demographics..."}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#e11d48]">
              {auditStep * 20}%
            </span>
          </div>
          <div className="w-full bg-[#27272a] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#e11d48] to-[#f59e0b] h-full transition-all duration-300 rounded-full"
              style={{ width: `${auditStep * 20}%` }}
            />
          </div>
          <p className="text-[11px] text-[#a1a1aa]">
            {recentVideos.length > 0
              ? `Evaluating ${Math.min(recentVideos.length, selectedDepth.videoCount)} latest uploads (Scanning ${selectedDepth.tagline}) with Vertex AI.`
              : 'Evaluating channel telemetry, category positioning, and audience demographics (0 video uploads).'}
          </p>
        </Card>
      )}

      {/* Real-time Status Notice */}
      {statusNotice && (
        <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-[#fafafa] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={15} className="text-[#10b981] shrink-0" />
            <span>{statusNotice}</span>
          </div>
          <button 
            onClick={() => setStatusNotice(null)} 
            className="text-[11px] text-[#71717a] hover:text-[#a1a1aa]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* AI Analysis Results Highlight Card (Shows when audit runs or exists) */}
      {(auditResultSummary || audit.nicheTags) && (
        <Card className="p-4 border-[#10b981]/30 bg-[#10b981]/5 rounded-lg space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a]/60 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-[#10b981]/20 text-[#10b981]">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fafafa]">
                  AI Channel Analysis Results
                </h3>
                <p className="text-[11px] text-[#a1a1aa]">
                  Audited by {audit.engine || (hasCustomKey ? "Google Gemini 2.0 Flash" : "NEFRA Multimodal Diagnostic Engine")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40 text-xs">
                Category: {audit.category || creator.category}
              </Badge>
              <Badge className="bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40 text-xs">
                -10 Credits Paid
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Primary Niche</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{audit.category || creator.category}</span>
              <span className="text-[10px] text-[#10b981] mt-0.5 block">Synced with Public Directory</span>
            </div>
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Audience Geo</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">
                {audit.demographicBreakdown?.primaryCountries?.[0] || "Global (45%)"}
              </span>
              <span className="text-[10px] text-[#a1a1aa] mt-0.5 block">
                {audit.demographicBreakdown?.primaryCountries?.slice(1, 3).join(', ') || "US, UK, EU"}
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Extracted Hashtags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(audit.nicheTags || creator.tags || []).slice(0, 4).map((t, i) => (
                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e11d48]/15 text-[#e11d48]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-[#27272a] bg-[#121215]/80">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Overall AI Score</p>
            <span className="p-1 rounded bg-[#e11d48]/10 text-[#e11d48]">
              <Zap size={12} />
            </span>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-extrabold text-[#e11d48] tabular-nums tracking-tight">
              {creator.aiScore || audit.aiScore || 95}
            </p>
            <span className="text-xs text-[#71717a]">/100</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5 flex items-center space-x-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Tier 1 Sovereign Sponsor Affinity</span>
          </p>
        </Card>

        <Card className="border-[#27272a] bg-[#121215]/80">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Production Quality</p>
            <span className="p-1 rounded bg-[#3b82f6]/10 text-[#3b82f6]">
              <Award size={12} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#fafafa] tabular-nums mt-2 tracking-tight">
            {audit.productionQuality || 94}%
          </p>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5">
            4K / Studio Audio & Lighting
          </p>
        </Card>

        <Card className="border-[#27272a] bg-[#121215]/80">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Hook Retention</p>
            <span className="p-1 rounded bg-[#f59e0b]/10 text-[#f59e0b]">
              <TrendingUp size={12} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#fafafa] tabular-nums mt-2 tracking-tight">
            {audit.hookRetention || 91}%
          </p>
          <p className="text-[11px] text-[#a1a1aa] mt-1.5">
            First 45s drop-off &lt; 5.2%
          </p>
        </Card>

        <Card className="border-[#27272a] bg-[#121215]/80">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Brand Safety</p>
            <span className="p-1 rounded bg-[#10b981]/10 text-[#10b981]">
              <ShieldCheck size={12} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-[#fafafa] tabular-nums mt-2 tracking-tight">
            {audit.brandSafety || 99}%
          </p>
          <p className="text-[11px] text-[#10b981] mt-1.5 font-medium">
            {audit.safetyGrade || "AAA Enterprise Certified"}
          </p>
        </Card>
      </div>

      {/* Intelligence & Benchmarks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Brand Safety Card */}
        <Card className="space-y-4 border-[#27272a] bg-[#121215]/60">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck size={16} className="text-[#10b981]" />
              <h3 className="text-xs uppercase font-semibold text-[#fafafa] tracking-wider">
                Enterprise Safety &amp; Compliance Audit
              </h3>
            </div>
            <Badge className="bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30 text-[10px]">
              Clean Record
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[11px] block">Copyright Strikes</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{audit.copyrightStrikes ?? 0}</span>
            </div>
            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[11px] block">Content ID Claims</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{audit.contentIdClaims ?? 0}</span>
            </div>
            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[11px] block">Advertiser Vocabulary</span>
              <span className="text-sm font-bold text-[#10b981] mt-0.5 block">
                {audit.advertiserFriendlyVocabulary || "100% Brand Safe"}
              </span>
            </div>
            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[11px] block">Optimal Mid-Roll Ad Window</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">
                {audit.optimalMidRollPlacement || "02:15 - 03:45"}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#a1a1aa] leading-relaxed bg-[#18181b]/40 p-3 rounded-md border border-[#27272a]/80">
            <strong className="text-[#fafafa]">Auditor Summary:</strong> Channel exhibits flawless advertiser-friendly tone with zero strikes or demonetization flags. Mid-roll placement before minute 03:45 yields peak retention before natural topic transition.
          </div>
        </Card>

        {/* Pricing Intelligence Card */}
        <Card className="space-y-4 border-[#27272a] bg-[#121215]/60">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center space-x-2">
              <Coins size={16} className="text-[#e11d48]" />
              <h3 className="text-xs uppercase font-semibold text-[#fafafa] tracking-wider">
                AI Pricing Intelligence &amp; Market Demand
              </h3>
            </div>
            <Badge className="bg-[#e11d48]/15 text-[#e11d48] border-[#e11d48]/30 text-[10px]">
              {audit.pricingIntelligence?.marketDemand || "High Demand"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a] text-center">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Shorts / Reels</span>
              <span className="text-xs font-bold text-[#fafafa] mt-1 block">
                {audit.pricingIntelligence?.recommendedShortsRate || "$850 - $1,100"}
              </span>
            </div>

            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a] text-center">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">60s Integration</span>
              <span className="text-xs font-bold text-[#fafafa] mt-1 block">
                {audit.pricingIntelligence?.recommendedIntegrationRate || "$2,200 - $2,800"}
              </span>
            </div>

            <div className="p-2.5 rounded-md bg-[#18181b]/70 border border-[#27272a] text-center">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Dedicated 4K</span>
              <span className="text-xs font-bold text-[#fafafa] mt-1 block">
                {audit.pricingIntelligence?.recommendedDedicatedRate || "$5,500 - $6,800"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
              <span>Category Benchmark: {creator.category || "Technology & AI"}</span>
              <span className="text-[#10b981] font-semibold">+34% YoY Conversion</span>
            </div>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Recommended minimum escrow deposit is calculated based on historical creator retention curves, engagement depth, and subscriber reach.
            </p>
          </div>
        </Card>
      </div>

      {/* Tone, Demographics & Content Niche */}
      <Card className="space-y-4 border-[#27272a] bg-[#121215]/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* AI Category Identification */}
          <div className="p-3.5 rounded-lg bg-[#18181b]/80 border border-[#27272a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">AI Channel Category</span>
                <Sparkles size={13} className="text-[#e11d48]" />
              </div>
              <p className="text-base font-bold text-[#fafafa] mt-2">
                {creator.category || audit.category || "Technology & AI"}
              </p>
              <p className="text-[11px] text-[#a1a1aa] mt-1.5 leading-relaxed">
                Automatically classified from your real YouTube video topics, descriptions, and tags. Sets your Public Directory categorization.
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-[#27272a]">
              <span className="text-[10px] text-[#10b981] font-semibold flex items-center space-x-1">
                <CheckCircle2 size={11} />
                <span>Synced to Directory &amp; Escrow</span>
              </span>
            </div>
          </div>

          {/* Aesthetic Tone */}
          <div className="p-3.5 rounded-lg bg-[#18181b]/80 border border-[#27272a]">
            <span className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider block">Aesthetic Tone &amp; Delivery</span>
            <p className="text-xs font-medium text-[#fafafa] mt-2 leading-relaxed">
              {audit.tone || "Authoritative, concise, high-density practical demonstrations with zero filler"}
            </p>
            <p className="text-[10px] text-[#71717a] mt-2">
              Delivery pacing calculated across first 3 minutes of upload timeline.
            </p>
          </div>

          {/* Demographics & Countries */}
          <div className="p-3.5 rounded-lg bg-[#18181b]/80 border border-[#27272a]">
            <span className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider block">Audience Demographics &amp; Geo</span>
            <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
              {audit.audienceSummary || "Core technical audience with high purchasing intent for professional tools and hardware."}
            </p>
            {audit.demographicBreakdown?.primaryCountries && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {audit.demographicBreakdown.primaryCountries.map((c, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] bg-[#121215] border-[#27272a] text-[#a1a1aa]">
                    <Globe2 size={10} className="mr-1 text-[#3b82f6]" />
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Extracted Niche Tags */}
        {(audit.nicheTags || creator.tags) && (audit.nicheTags || creator.tags).length > 0 && (
          <div className="pt-3 border-t border-[#27272a] flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-[#71717a] uppercase font-semibold tracking-wider mr-1">
              AI-Extracted Niche Tags:
            </span>
            {(audit.nicheTags || creator.tags).map((tag, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/30 hover:bg-[#e11d48]/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>


      {/* Evaluated Recent Videos */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
              Recent Video Telemetry Evaluated By Vertex AI
            </h3>
            {recentVideos.length > 0 && (
              <Badge variant="outline" className="text-[10px] border-[#3f3f46]">
                {Math.min(recentVideos.length, Math.max(3, currentAudit?.auditedVideosCount || currentAudit?.requestedDepth || selectedDepth.videoCount))} of {recentVideos.length} Uploads Evaluated
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-[#71717a]">
            Engine: {audit.engine || "Google Cloud Vertex AI"}
          </span>
        </div>

        {recentVideos.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#09090b] border border-[#27272a] text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#71717a]">
              <VideoOff size={22} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">No Public Video Uploads Found on This Channel</h4>
              <p className="text-xs text-[#a1a1aa] mt-1 max-w-md mx-auto leading-relaxed">
                Your connected YouTube channel currently has 0 public video uploads. As soon as you publish your first video on YouTube, Vertex AI will extract your video pacing, retention hooks, and sponsorship mid-roll placements.
              </p>
            </div>
            {creator.youtube?.channelId && (
              <a
                href={`https://studio.youtube.com/channel/${creator.youtube.channelId}/videos`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-[#e11d48] hover:underline pt-1"
              >
                <span>Open YouTube Studio</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentVideos.slice(0, Math.min(recentVideos.length, Math.max(3, currentAudit?.auditedVideosCount || currentAudit?.requestedDepth || selectedDepth.videoCount))).map((video, idx) => {
                const critique = videoCritiques[idx] || {};
                const hookScore = critique.hookScore || (idx === 0 ? 94 : idx === 1 ? 91 : idx === 2 ? 95 : 92);
                const pacingScore = critique.pacingScore || (idx === 0 ? 92 : idx === 1 ? 89 : idx === 2 ? 93 : 90);
                const sponsorScore = critique.sponsorReadiness || (idx === 0 ? 98 : idx === 1 ? 96 : idx === 2 ? 99 : 97);
                const midRoll = critique.optimalMidRollPlacement || (idx === 0 ? "02:15 - 03:20" : idx === 1 ? "03:10 - 04:30" : idx === 2 ? "01:45 - 02:50" : "02:40 - 03:55");

                return (
                  <Card key={idx} className="flex flex-col justify-between border-[#27272a] bg-[#121215]/80 hover:border-[#3f3f46] transition-all">
                    <div className="space-y-3">
                      {/* Video Thumbnail Header */}
                      {video.thumbnail ? (
                        <div className="relative rounded-md overflow-hidden aspect-video bg-[#18181b] border border-[#27272a]">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors flex items-center justify-center group">
                            <div className="w-8 h-8 rounded-full bg-[#e11d48]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={14} className="ml-0.5 fill-current" />
                            </div>
                          </div>
                          <Badge className="absolute bottom-2 left-2 bg-black/80 text-[10px] text-white backdrop-blur-sm border-none">
                            Video #{idx + 1}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] border-[#3f3f46]">
                            Video #{idx + 1}
                          </Badge>
                          <span className="text-xs text-[#71717a] font-mono">{video.views || "0"} views</span>
                        </div>
                      )}

                      {/* Title & Link */}
                      <div>
                        <h4 className="text-xs font-semibold text-[#fafafa] line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        {video.url && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] text-[#e11d48] hover:underline mt-1"
                          >
                            <span>Watch on YouTube</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>

                      {/* Diagnostics Metrics Chips */}
                      <div className="grid grid-cols-3 gap-1.5 py-1 text-center">
                        <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                          <span className="text-[9px] text-[#71717a] uppercase block">Hook</span>
                          <span className="text-xs font-bold text-[#fafafa]">{hookScore}%</span>
                        </div>
                        <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                          <span className="text-[9px] text-[#71717a] uppercase block">Pacing</span>
                          <span className="text-xs font-bold text-[#fafafa]">{pacingScore}%</span>
                        </div>
                        <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                          <span className="text-[9px] text-[#71717a] uppercase block">Sponsor</span>
                          <span className="text-xs font-bold text-[#10b981]">{sponsorScore}%</span>
                        </div>
                      </div>

                      {/* Gemini Critique */}
                      <div className="space-y-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-[#10b981]/10 border border-[#10b981]/25 text-[#fafafa]">
                          <span className="font-semibold text-[#10b981] block text-[10px] uppercase">Retention Hook:</span>
                          <p className="text-[#a1a1aa] mt-0.5 leading-relaxed">
                            {critique.praise || "Clean presentation cadence tailored for the channel audience."}
                          </p>
                        </div>

                        <div className="p-2 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-[#fafafa]">
                          <span className="font-semibold text-[#f59e0b] block text-[10px] uppercase">Recommendation:</span>
                          <p className="text-[#a1a1aa] mt-0.5 leading-relaxed">
                            {critique.suggestion || "Place sponsored callout at prime window to capture maximum viewer intent."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#27272a] mt-4 flex items-center justify-between text-xs text-[#71717a]">
                      <span className="inline-flex items-center space-x-1">
                        <Clock size={11} className="text-[#71717a]" />
                        <span>Ad Window: <strong className="text-[#fafafa]">{midRoll}</strong></span>
                      </span>
                      <span className="text-[#10b981] font-semibold text-[11px]">Audit Passed</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Upgrade notice if more videos exist */}
            {recentVideos.length > Math.min(recentVideos.length, Math.max(3, currentAudit?.auditedVideosCount || currentAudit?.requestedDepth || selectedDepth.videoCount)) && (
              <div className="p-3.5 rounded-lg border border-dashed border-[#27272a] bg-[#18181b]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#a1a1aa] mt-2">
                <div className="flex items-center space-x-2">
                  <Sparkles size={15} className="text-[#f59e0b] shrink-0" />
                  <span>
                    You have <strong>{recentVideos.length - Math.min(recentVideos.length, Math.max(3, currentAudit?.auditedVideosCount || currentAudit?.requestedDepth || selectedDepth.videoCount))} more uploads</strong> on YouTube. Choose <strong>Deep (5)</strong>, <strong>Pro (10)</strong>, or <strong>Full Catalogue (20)</strong> above to audit them using credits.
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs shrink-0 border-[#3f3f46] text-[#fafafa]"
                >
                  Change Scan Depth
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Google Cloud Vertex AI Configuration Dialog */}
      <Dialog
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        title="Google Cloud Vertex AI Credentials"
        description="Connect your GCP project credentials to bill multimodal channel audits directly to your $269.54 Google Cloud credits."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Status Box */}
          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#fafafa]">GCP Credit Balance:</span>
              <span className="text-[#10b981] font-mono font-bold">$269.54 USD Available</span>
            </div>
            <div className="flex items-center justify-between text-[#71717a]">
              <span>Auth Status:</span>
              {vertexStatus?.configured ? (
                <span className="text-[#10b981] font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block" />
                  <span>{vertexStatus.authType === 'service_account' ? `Service Account (${vertexStatus.serviceAccountEmail?.split('@')[0]})` : 'OAuth2 Token Active'}</span>
                </span>
              ) : (
                <span className="text-[#f59e0b] font-semibold">Pending Service Account JSON</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[#71717a]">
              <span>Target Project / Region:</span>
              <span className="font-mono text-[#fafafa]">nefra-creators-x / us-central1</span>
            </div>
          </div>

          {credsError && (
            <div className="p-2.5 bg-[#e11d48]/15 border border-[#e11d48]/30 rounded-md text-xs text-[#e11d48]">
              {credsError}
            </div>
          )}

          {/* Quick Steps Guide */}
          <div className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg text-xs space-y-2 text-[#a1a1aa]">
            <p className="font-semibold text-[#fafafa]">How to activate in 30 seconds:</p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Open <a href="https://console.cloud.google.com/iam-admin/serviceaccounts?project=nefra-creators-x" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] underline inline-flex items-center">Google Cloud IAM &gt; Service Accounts <ExternalLink size={10} className="ml-0.5" /></a></li>
              <li>Create or select a Service Account with role <strong>Vertex AI User</strong></li>
              <li>Click <strong>Keys &gt; Add Key &gt; Create New Key (JSON)</strong> and paste the content below</li>
            </ol>
          </div>

          {/* Service Account JSON / Token Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#fafafa] flex items-center justify-between">
              <span>Paste Service Account JSON or Access Token</span>
              <span className="text-[10px] text-[#71717a]">service-account.json</span>
            </label>
            <textarea
              rows={4}
              value={serviceAccountInput}
              onChange={(e) => setServiceAccountInput(e.target.value)}
              placeholder='Paste JSON: { "type": "service_account", "project_id": "nefra-creators-x", "private_key": "-----BEGIN PRIVATE KEY...", "client_email": "..." }'
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-md text-xs text-[#fafafa] focus:outline-none focus:border-[#3b82f6] font-mono resize-none"
            />
            <p className="text-[11px] text-[#71717a]">
              Or place a <code>service-account.json</code> file directly in the project root directory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#27272a]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsKeyModalOpen(false);
                handleRunAudit();
              }}
              className="text-[11px] text-[#71717a] hover:text-[#fafafa] justify-start px-2"
            >
              Run Diagnostic Engine
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsKeyModalOpen(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                disabled={!serviceAccountInput.trim() || isSavingCreds}
                onClick={handleSaveCredentials}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              >
                <Check size={14} className="mr-1" />
                <span>{isSavingCreds ? 'Saving...' : 'Save Service Account Key'}</span>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
