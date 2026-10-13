import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Video, 
  AlertCircle
} from 'lucide-react';
import YouTubeIcon from '../common/YouTubeIcon';
import { requestGoogleYouTubeAuth, fetchVerifiedChannelAndVideos, getDemoSandboxCreator } from '../../services/youtubeService';
import confetti from 'canvas-confetti';

const DEMO_PROFILES = [
  { id: 'creator-tech-1', name: 'The Coding Train', category: 'Tech & AI', subs: '1.68M' },
  { id: 'creator-music-1', name: 'Soul Sessions', category: 'Music & Singing', subs: '890K' },
  { id: 'creator-travel-1', name: 'Island Explorer', category: 'Travel & Culinary', subs: '620K' },
  { id: 'creator-gaming-1', name: 'Apex Blitz', category: 'Gaming & Esports', subs: '1.2M' },
];

export default function CreatorAuth({ 
  onLoginSuccess, 
  googleClientId 
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelCategory, setChannelCategory] = useState('tech');
  const [channelHandle, setChannelHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegister) {
      if (!channelName.trim()) {
        setErrorMessage('Please enter your channel name.');
        return;
      }

      // Create new registered creator session
      const newCreator = {
        id: `creator-${Date.now()}`,
        channelId: `UC_${Date.now()}`,
        title: channelName.trim(),
        handle: channelHandle.trim() || `@${channelName.toLowerCase().replace(/\s+/g, '')}`,
        category: channelCategory,
        categoryLabel: channelCategory === 'tech' ? 'Tech & AI' : channelCategory === 'music' ? 'Music & Singing' : channelCategory === 'travel' ? 'Travel & Culinary' : 'Gaming & Esports',
        subscriberCount: 250000,
        subscribersFormatted: '250K',
        totalViews: '12.4M',
        verified: true,
        country: 'JAPAC / Global',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        nefraScore: 92,
        tags: ['#Creator', '#Verified', '#OriginalContent'],
        aiSummary: `Authentic creator producing original high-engagement ${channelCategory} content.`,
        audience: {
          demographic: '18-34 Active Engaged Viewers',
          avgEngagementRate: '5.8%'
        },
        recentVideos: [
          {
            id: 'v-new-1',
            title: `${channelName} - Latest Showcase & Highlights`,
            publishedAt: '2026-04-05',
            viewCountFormatted: '45K',
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'
          },
          {
            id: 'v-new-2',
            title: `Behind The Scenes & Production Workflow`,
            publishedAt: '2026-03-28',
            viewCountFormatted: '38K',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500'
          },
          {
            id: 'v-new-3',
            title: `Community Q&A and Upcoming Projects`,
            publishedAt: '2026-03-15',
            viewCountFormatted: '52K',
            thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500'
          }
        ]
      };

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(newCreator);
    } else {
      // Direct sign in (use default preset if email empty or matches)
      const creator = getDemoSandboxCreator('creator-tech-1');
      onLoginSuccess(creator);
    }
  };

  // 1-Click Demo Profile Login
  const handleQuickDemoLogin = (presetId) => {
    const creator = getDemoSandboxCreator(presetId);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onLoginSuccess(creator);
  };

  // Google OAuth YouTube Sign-In
  const handleGoogleSignIn = () => {
    if (!googleClientId) {
      setErrorMessage('Google OAuth Client ID is not configured. You can use the instant 1-click Demo Profiles below!');
      return;
    }

    setIsLoadingAuth(true);
    setErrorMessage(null);

    requestGoogleYouTubeAuth(
      googleClientId,
      async (accessToken) => {
        try {
          const verifiedData = await fetchVerifiedChannelAndVideos(accessToken);
          setIsLoadingAuth(false);
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          onLoginSuccess(verifiedData);
        } catch (err) {
          setErrorMessage(err.message || 'Failed to fetch YouTube channel details.');
          setIsLoadingAuth(false);
        }
      },
      (err) => {
        setErrorMessage(err.message || 'Google OAuth Sign-In was cancelled.');
        setIsLoadingAuth(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-blue-600 text-white shadow-sm mb-3">
          <Sparkles className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Nefra Creator Studio
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to access your YouTube channel audit, credit wallet & brand deals
        </p>
      </div>

      {/* Auth Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          
          {/* Sign In vs Register Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMessage(null); }}
              className={`flex-1 py-2 text-center rounded-md transition-all ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMessage(null); }}
              className={`flex-1 py-2 text-center rounded-md transition-all ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register Channel
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    YouTube Channel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. Acoustic Vibes Studio"
                    className="py-2.5 px-3 block w-full border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={channelCategory}
                      onChange={(e) => setChannelCategory(e.target.value)}
                      className="py-2.5 px-3 block w-full border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="tech">Tech & AI</option>
                      <option value="music">Music & Singing</option>
                      <option value="travel">Travel & Culinary</option>
                      <option value="gaming">Gaming & Esports</option>
                      <option value="education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Handle / URL
                    </label>
                    <input
                      type="text"
                      value={channelHandle}
                      onChange={(e) => setChannelHandle(e.target.value)}
                      placeholder="@handle"
                      className="py-2.5 px-3 block w-full border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@youtube.com"
                className="py-2.5 px-3 block w-full border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-2.5 px-3 block w-full border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-colors shadow-2xs mt-2"
            >
              {isRegister ? 'Register & Open Dashboard' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoadingAuth}
            className="w-full py-2.5 px-4 inline-flex justify-center items-center gap-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <YouTubeIcon size={16} color="#ff0033" />
            {isLoadingAuth ? 'Connecting Google Account...' : 'Continue with Verified YouTube'}
          </button>

          {/* 1-Click Demo Profiles */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick 1-Click Demo Creator Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PROFILES.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(prof.id)}
                  className="p-2.5 text-left border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
                >
                  <strong className="block text-xs text-slate-800 group-hover:text-blue-700 truncate">
                    {prof.name}
                  </strong>
                  <span className="text-2xs text-slate-500 block">
                    {prof.category} • {prof.subs}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
