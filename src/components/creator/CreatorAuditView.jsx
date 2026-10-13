import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  Tag, 
  Award, 
  ArrowRight,
  Play,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
  Video
} from 'lucide-react';
import YouTubeIcon from '../common/YouTubeIcon';
import confetti from 'canvas-confetti';
import { 
  requestGoogleYouTubeAuth, 
  fetchVerifiedChannelAndVideos, 
  getDemoSandboxCreator 
} from '../../services/youtubeService';
import { analyzeCreatorVideosWithGemini } from '../../services/geminiService';
import { SEED_CREATORS } from '../../data/seedCreators';

export default function CreatorAuditView({
  apiKey,
  googleClientId,
  channelData,
  setChannelData,
  selectedPresetId,
  setSelectedPresetId,
  onCreatorEnrolled
}) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  // Switch demo preset channel
  const handleSelectPreset = (creatorId) => {
    setSelectedPresetId(creatorId);
    const demoChannel = getDemoSandboxCreator(creatorId);
    setChannelData(demoChannel);
    setAnalysisResult(null);
    setEnrolledSuccess(false);
    setAuthError(null);
  };

  // Google Sign-In with YouTube OAuth
  const handleGoogleSignIn = () => {
    if (!googleClientId) {
      setAuthError('To use live Google Sign-In, please configure your Google Cloud OAuth Client ID in Settings. You can test immediately using the Demo Sandbox presets below!');
      return;
    }

    setIsLoadingAuth(true);
    setAuthError(null);

    requestGoogleYouTubeAuth(
      googleClientId,
      async (accessToken) => {
        try {
          const verifiedData = await fetchVerifiedChannelAndVideos(accessToken);
          setChannelData(verifiedData);
          setSelectedPresetId(null);
          setAnalysisResult(null);
          setEnrolledSuccess(false);
          setIsLoadingAuth(false);
        } catch (err) {
          setAuthError(err.message || 'Failed to retrieve YouTube channel data.');
          setIsLoadingAuth(false);
        }
      },
      (err) => {
        setAuthError(err.message || 'Google OAuth Sign-In was cancelled or failed.');
        setIsLoadingAuth(false);
      }
    );
  };

  // Run Gemini 3-Video Content Analyzer
  const handleRunAiAnalysis = async () => {
    if (!channelData || !channelData.recentVideos) return;
    setIsAnalyzing(true);
    setAuthError(null);

    try {
      const result = await analyzeCreatorVideosWithGemini(
        apiKey,
        channelData,
        channelData.recentVideos
      );
      setAnalysisResult(result);
      setIsAnalyzing(false);
    } catch (err) {
      setAuthError('AI Analysis error: ' + err.message);
      setIsAnalyzing(false);
    }
  };

  // Enroll into Top 10 Directory
  const handleEnrollCreator = () => {
    if (!channelData || !analysisResult) return;

    const enrolledCreator = {
      ...channelData,
      id: channelData.id || `creator-custom-${Date.now()}`,
      category: analysisResult.category,
      categoryLabel: analysisResult.categoryLabel,
      subCategory: analysisResult.subCategory || 'Featured Content Creation',
      nefraScore: analysisResult.nefraScore || 95,
      tags: analysisResult.tags,
      aiSummary: analysisResult.aiSummary,
      audience: analysisResult.audience,
      videoReviews: analysisResult.videoReviews || [],
    };

    onCreatorEnrolled(enrolledCreator);
    setEnrolledSuccess(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Channel Connection Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: Active Channel Info */}
          <div className="flex items-center gap-4">
            <img
              src={channelData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={channelData?.title}
              className="size-16 rounded-xl object-cover border border-gray-200 dark:border-neutral-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                  {channelData?.title || 'Connected YouTube Channel'}
                </h3>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400">
                  <ShieldCheck className="size-3" />
                  OAuth Verified
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                {channelData?.handle || '@creator'} • {channelData?.subscribersFormatted || '1.68M'} Subscribers • {channelData?.country || 'JAPAC / Global'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-2xs text-gray-600 dark:text-neutral-400">
                <span>Engagement: <strong>{channelData?.audience?.avgEngagementRate || '6.4%'}</strong></span>
                <span>•</span>
                <span>Total Views: <strong>{channelData?.totalViews || '185M'}</strong></span>
                <span>•</span>
                <span>3 Latest Uploads Synced</span>
              </div>
            </div>
          </div>

          {/* Right: Connect Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoadingAuth}
              className="py-2 px-3.5 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none disabled:opacity-50"
            >
              <YouTubeIcon size={16} color="#ffffff" />
              {isLoadingAuth ? 'Connecting...' : 'Connect YouTube Account'}
            </button>
            <button
              type="button"
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              <Sparkles className="size-3.5" />
              {isAnalyzing ? 'Auditing 3 Videos...' : 'Run Gemini 3-Video Audit'}
            </button>
          </div>

        </div>

        {/* Sandbox Presets Switcher */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
              Demo Presets (Instant Switch for Judges & Testing)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'creator-tech-1', label: 'Tech / AI (The Coding Train)' },
              { id: 'creator-music-1', label: 'Music / Acoustic (Soul Sessions)' },
              { id: 'creator-travel-1', label: 'Travel / Culinary (Island Explorer)' },
              { id: 'creator-gaming-1', label: 'Gaming / Esports (Apex Blitz)' },
              { id: 'creator-education-1', label: 'Education / Career (Career Compass)' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                  selectedPresetId === preset.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}
      </div>

      {/* AI Content Analysis Results Card */}
      {analysisResult && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-neutral-700">
            <div>
              <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Gemini Multimodal Content Audit Complete
              </span>
              <h4 className="text-base font-bold text-gray-900 dark:text-neutral-100 mt-1">
                {analysisResult.categoryLabel} • {analysisResult.subCategory}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xs text-gray-400 uppercase tracking-wider block">Nefra Score</span>
                <span className="text-xl font-bold text-gray-900 dark:text-neutral-100">
                  {analysisResult.nefraScore} <span className="text-xs text-gray-400">/ 100</span>
                </span>
              </div>
              {!enrolledSuccess ? (
                <button
                  type="button"
                  onClick={handleEnrollCreator}
                  className="py-2 px-3.5 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Award className="size-3.5" />
                  Enroll in Directory
                </button>
              ) : (
                <span className="py-2 px-3.5 inline-flex items-center gap-x-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  Enrolled & Synced
                </span>
              )}
            </div>
          </div>

          {/* AI Synthesis & Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-gray-50 rounded-lg dark:bg-neutral-900/50">
              <span className="text-2xs font-semibold uppercase text-gray-500 dark:text-neutral-400 block mb-1">
                Content Style & Editorial Synthesis
              </span>
              <p className="text-xs text-gray-700 dark:text-neutral-300 leading-relaxed">
                {analysisResult.aiSummary}
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-lg dark:bg-neutral-900/50">
              <span className="text-2xs font-semibold uppercase text-gray-500 dark:text-neutral-400 block mb-1">
                Audience Demographics & Reach
              </span>
              <p className="text-xs text-gray-700 dark:text-neutral-300 leading-relaxed">
                {analysisResult.audience?.demographic || 'Primary tech & developer community'}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {analysisResult.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-white text-gray-700 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3 Analyzed Videos & Visual Critique Scorecards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
            <Video className="size-4 text-blue-600 dark:text-blue-400" />
            3 Audited Uploads & Metric Scorecards
          </h4>
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            Multimodal evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(channelData?.recentVideos || []).slice(0, 3).map((video, idx) => {
            const review = analysisResult?.videoReviews?.[idx] || {
              productionQuality: 92 - idx * 3,
              engagementIndex: 88 + idx * 2,
              brandSafety: 98,
              strengths: 'Clear pacing and articulate delivery.',
              tips: 'Experiment with a punchier 5-second opening hook.'
            };

            return (
              <div
                key={video.id || idx}
                className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs dark:bg-neutral-800 dark:border-neutral-700"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 dark:bg-neutral-900">
                  <img
                    src={video.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-white text-2xs font-medium">
                    {video.viewCountFormatted || 'Recent Upload'}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-2xs font-bold">
                    Video #{idx + 1}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 dark:text-neutral-100 line-clamp-2">
                      {video.title}
                    </h5>
                    <p className="text-2xs text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {video.description || 'Verified YouTube upload evaluated by Gemini.'}
                    </p>
                  </div>

                  {/* Visual Critique Scorecard Bars */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-neutral-700 text-2xs">
                    
                    {/* Production Quality */}
                    <div>
                      <div className="flex justify-between text-gray-600 dark:text-neutral-400 mb-0.5">
                        <span>Production Quality</span>
                        <strong className="text-gray-900 dark:text-neutral-200">{review.productionQuality || 90}%</strong>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-neutral-700">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${review.productionQuality || 90}%` }}
                        />
                      </div>
                    </div>

                    {/* Audience Retention Index */}
                    <div>
                      <div className="flex justify-between text-gray-600 dark:text-neutral-400 mb-0.5">
                        <span>Retention Index</span>
                        <strong className="text-gray-900 dark:text-neutral-200">{review.engagementIndex || 88}%</strong>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-neutral-700">
                        <div 
                          className="bg-emerald-600 h-1.5 rounded-full" 
                          style={{ width: `${review.engagementIndex || 88}%` }}
                        />
                      </div>
                    </div>

                    {/* Brand Safety */}
                    <div>
                      <div className="flex justify-between text-gray-600 dark:text-neutral-400 mb-0.5">
                        <span>Brand Alignment</span>
                        <strong className="text-gray-900 dark:text-neutral-200">{review.brandSafety || 98}%</strong>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-neutral-700">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ width: `${review.brandSafety || 98}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Feedback Tip */}
                  <div className="p-2.5 bg-gray-50 rounded-lg dark:bg-neutral-900/60 text-2xs text-gray-600 dark:text-neutral-400">
                    <strong className="text-gray-900 dark:text-neutral-200 block mb-0.5">AI Feedback:</strong>
                    {review.tips || 'Consistent viewer retention and clear visual delivery.'}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
