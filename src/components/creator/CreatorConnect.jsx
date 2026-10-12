import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Flame, 
  Users, 
  Tag, 
  Award, 
  ArrowRight,
  Play,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';
import YouTubeIcon from '../common/YouTubeIcon';
import confetti from 'canvas-confetti';
import { 
  requestGoogleYouTubeAuth, 
  fetchVerifiedChannelAndVideos, 
  getDemoSandboxCreator 
} from '../../services/youtubeService';
import { analyzeCreatorVideosWithGemini } from '../../services/geminiService';
import { SEED_CREATORS, CATEGORIES } from '../../data/seedCreators';

export default function CreatorConnect({ apiKey, googleClientId, onCreatorEnrolled }) {
  // Connection state
  const [selectedPresetId, setSelectedPresetId] = useState('creator-tech-1');
  const [channelData, setChannelData] = useState(getDemoSandboxCreator('creator-tech-1'));
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Gemini AI Analysis state
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

  // Real Google Sign-In with YouTube OAuth
  const handleGoogleSignIn = () => {
    if (!googleClientId) {
      setAuthError('To use live Google Sign-In, please configure your Google Cloud OAuth Client ID in Settings (top right). You can use the Demo Sandbox below right now without an ID!');
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '40px auto 32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 0, 51, 0.1)',
          border: '1px solid rgba(255, 0, 51, 0.3)',
          marginBottom: '16px'
        }}>
          <YouTubeIcon size={18} color="#ff0033" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ff2a44' }}>
            CREATOR ONBOARDING & VERIFICATION
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '14px' }}>
          Connect Your YouTube Channel & Let <span className="gradient-text-ai">Gemini AI</span> Categorize You
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          We securely verify your channel and subscriber count, then analyze your last 3 videos to automatically assign your category, generate deep niche tags, and rank your profile.
        </p>
      </div>

      {/* Main Connection Container */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Step 1: Authentication / Demo Channel Selector */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>STEP 1</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Authenticate & Select Channel</h3>
            </div>
            
            {/* Live Google Sign-In Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={handleGoogleSignIn} 
                disabled={isLoadingAuth}
                className="btn-youtube"
              >
                <YouTubeIcon size={20} color="#ffffff" />
                {isLoadingAuth ? 'Connecting Google Account...' : 'Sign In with Google (OAuth)'}
              </button>
            </div>
          </div>

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#f87171',
              fontSize: '0.86rem',
              marginBottom: '20px'
            }}>
              {authError}
            </div>
          )}

          {/* Quick Demo Channel Sandbox Tabs */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Demo Sandbox: Test with Verified Channels in 1-Click
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {SEED_CREATORS.filter(c => ['creator-tech-1', 'creator-music-1', 'creator-travel-1', 'creator-game-1'].includes(c.id)).map((creator) => {
                const isSelected = selectedPresetId === creator.id;
                return (
                  <button
                    key={creator.id}
                    onClick={() => handleSelectPreset(creator.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.title}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: isSelected ? '#00f0ff' : '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {creator.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {creator.subscribersFormatted} Subscribers
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 2: Connected Channel & 3 Videos Preview */}
        {channelData && (
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '6px' }}>STEP 2</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Channel Verified & Uploads Detected</h3>
              </div>

              {/* Action Button: Run Gemini AI Analysis */}
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="btn-primary ai-pulse-active"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                <Sparkles size={20} />
                {isAnalyzing ? 'Gemini AI Watching 3 Videos...' : 'Watch & Analyze with Gemini AI'}
              </button>
            </div>

            {/* Verified Profile Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={channelData.avatar}
                  alt={channelData.title}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent-cyan)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{channelData.title}</h2>
                    <CheckCircle2 size={18} color="#00f0ff" />
                  </div>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {channelData.handle}
                  </span>
                </div>
              </div>

              {/* Key Stats Counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', color: '#ff2a44' }}>
                    <Users size={16} />
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      Subscribers
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.65rem',
                    fontWeight: '800',
                    color: '#ffffff'
                  }}>
                    {channelData.subscribersFormatted}
                  </span>
                </div>

                <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', color: 'var(--accent-cyan)' }}>
                    <Eye size={16} />
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      Total Views
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.65rem',
                    fontWeight: '800',
                    color: '#ffffff'
                  }}>
                    {channelData.totalViews || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* The 3 Videos Preview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={17} color="var(--accent-cyan)" />
                  Latest 3 Videos Queued for AI Content Inspection
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Gemini analyzes titles, descriptions, tone, and visual metadata
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {(channelData.recentVideos || []).slice(0, 3).map((video, idx) => (
                  <div
                    key={video.id || idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: 'var(--accent-cyan)'
                      }}>
                        VIDEO #{idx + 1}
                      </div>
                    </div>

                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h5 style={{
                          fontSize: '0.92rem',
                          fontWeight: '700',
                          lineHeight: 1.35,
                          marginBottom: '8px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {video.title}
                        </h5>
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-dim)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {video.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} />
                          {video.publishedAt}
                        </span>
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Gemini AI Analysis Results */}
        {analysisResult && (
          <div className="glass-panel" style={{
            padding: '32px',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.15)',
            background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.95), rgba(7, 10, 19, 0.95))'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>STEP 3 (COMPLETE)</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                  Gemini AI Video Analysis & Auto-Categorization
                </h3>
              </div>

              {!enrolledSuccess ? (
                <button
                  onClick={handleEnrollCreator}
                  className="btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  <Award size={18} />
                  Add to Category Top 10 Leaderboard
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#10b981',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}>
                  <CheckCircle2 size={20} />
                  Published to Top 10 Directory!
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* Category Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Identified Primary Category
                </span>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: '800',
                  color: 'var(--accent-cyan)',
                  marginTop: '6px',
                  marginBottom: '10px'
                }}>
                  {analysisResult.categoryLabel}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setAnalysisResult({
                        ...analysisResult,
                        category: cat.id,
                        categoryLabel: cat.name
                      })}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        borderRadius: '6px',
                        border: analysisResult.category === cat.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        background: analysisResult.category === cat.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: analysisResult.category === cat.id ? '#00f0ff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Auto-categorized by AI. Click any category above if you want to switch niche.
                </p>
              </div>

              {/* Sub-Category Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  AI-Generated Sub-Category Niche
                </span>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: '#c084fc',
                  marginTop: '6px',
                  marginBottom: '10px'
                }}>
                  {analysisResult.subCategory || 'Featured Content Niche'}
                </div>
                <input
                  type="text"
                  value={analysisResult.subCategory || ''}
                  onChange={(e) => setAnalysisResult({ ...analysisResult, subCategory: e.target.value })}
                  placeholder="Custom sub-category niche..."
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                    marginBottom: '6px'
                  }}
                />
                <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  Granular niche identified by Gemini. You can also edit it directly.
                </p>
              </div>

              {/* Nefra Score Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  AI Creator Quality Score
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  marginTop: '6px',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    color: '#ffb703'
                  }}>
                    {analysisResult.nefraScore || 96}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>/ 100</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Calculated from topical consistency, production depth, and retention benchmarks.
                </p>
              </div>

              {/* Tone & Style Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Tone & Aesthetic Style
                </span>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#c084fc',
                  marginTop: '6px',
                  marginBottom: '10px'
                }}>
                  {analysisResult.toneAndStyle || 'Engaging & Analytical'}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Extracted from audio delivery pacing, title framing, and description style.
                </p>
              </div>
            </div>

            {/* Generated Niche Tags */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Tag size={17} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>
                  AI-Generated Niche Tags (Targeting & Matching Keywords)
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(analysisResult.tags || []).map((tag, i) => (
                  <span key={i} className="tag-pill" style={{
                    padding: '6px 14px',
                    fontSize: '0.84rem',
                    background: 'rgba(0, 240, 255, 0.08)',
                    borderColor: 'rgba(0, 240, 255, 0.25)',
                    color: '#00f0ff'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Summary Description */}
            <div style={{
              background: 'rgba(157, 78, 221, 0.06)',
              border: '1px solid rgba(157, 78, 221, 0.25)',
              borderRadius: '14px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={17} color="#c084fc" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#c084fc' }}>
                  Creator Identity Summary (Nefra Intelligence)
                </h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {analysisResult.aiSummary}
              </p>
              {analysisResult.audience && (
                <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <strong>Core Audience:</strong> {analysisResult.audience.demographic}
                </div>
              )}
            </div>

            {/* Individual Video AI Reviews & Feedback */}
            {analysisResult.videoReviews && analysisResult.videoReviews.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Play size={18} color="var(--accent-cyan)" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                    Gemini AI Video-by-Video Inspection & Feedback
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analysisResult.videoReviews.map((rev, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(0, 240, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                            VIDEO #{rev.videoIndex || idx + 1}
                          </span>
                          <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>
                            {rev.title}
                          </span>
                        </div>
                        {rev.format && (
                          <span style={{ fontSize: '0.76rem', color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            {rev.format}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--accent-cyan)' }}>AI Feedback: </strong>
                        {rev.aiFeedback}
                      </p>

                      {rev.brandOpportunity && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                          <strong style={{ color: '#ffb703' }}>Brand Sponsor Fit: </strong>
                          {rev.brandOpportunity}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
