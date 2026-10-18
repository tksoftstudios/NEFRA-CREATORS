import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  connectYouTubeWithServer, 
  disconnectYouTubeWithServer 
} from '../../services/youtubeOAuthService';
import { AutoAuditModal } from './AutoAuditModal';

function YoutubeIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.044.87.13V9.4a6.33 6.33 0 0 0-.87-.06A6.34 6.34 0 0 0 3.14 15.7a6.34 6.34 0 0 0 9.54 5.48V13.8a8.18 8.18 0 0 0 5.18 1.83v-3.48a4.85 4.85 0 0 1-3.27-1.39V6.69z" />
    </svg>
  );
}

function XIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function ThreadsIcon({ className = "w-5 h-5", size, ...props }) {
  const s = size ? `${size}px` : undefined;
  return (
    <svg 
      className={className} 
      style={s ? { width: s, height: s } : undefined} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      {...props}
    >
      <path d="M12.186 24C5.503 24 0 18.618 0 12.052 0 5.485 5.503.103 12.186.103c6.623 0 11.96 5.253 12.062 11.758h-3.454c-.1-4.577-3.83-8.307-8.608-8.307-4.872 0-8.732 3.86-8.732 8.5 0 4.638 3.86 8.5 8.732 8.5 3.738 0 6.643-2.073 7.82-5.187H12.186v-3.35h11.23c.373 7.873-5.26 13.983-11.23 13.983z" />
    </svg>
  );
}

function FormattedErrorBox({ message }) {
  if (!message) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = message.match(urlRegex);
  const foundUrl = match ? match[0] : null;

  const isApiDisabledError = message.includes('YouTube Data API v3 has not been used') || 
                             message.includes('enable it by visiting') ||
                             message.includes('youtube.googleapis.com');

  if (isApiDisabledError && foundUrl) {
    return (
      <div className="p-4 bg-[#e11d48]/10 border border-[#e11d48]/40 rounded-lg text-xs text-[#fafafa] flex items-start space-x-3 animate-in fade-in">
        <AlertCircle size={18} className="text-[#e11d48] shrink-0 mt-0.5" />
        <div className="space-y-2.5 min-w-0 flex-1">
          <div>
            <span className="font-semibold block text-xs text-[#e11d48]">YouTube Data API v3 Required</span>
            <p className="text-[11px] text-[#a1a1aa] mt-1 leading-relaxed">
              Google Cloud requires turning on the <strong>YouTube Data API v3</strong> for this project before your channel metrics can be fetched.
            </p>
          </div>

          <a
            href={foundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-md bg-[#e11d48] hover:bg-[#be123c] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <span>Enable in Google Cloud Console</span>
            <ExternalLink size={12} />
          </a>

          <p className="text-[10px] text-[#71717a]">
            After clicking <strong>Enable</strong> in Google Cloud Console, wait ~1 minute and click the button below to retry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-[#e11d48]/10 border border-[#e11d48]/40 rounded-lg text-xs text-[#fafafa] flex items-start space-x-2.5 animate-in fade-in">
      <AlertCircle size={16} className="text-[#e11d48] shrink-0 mt-0.5" />
      <div className="space-y-1.5 min-w-0 flex-1">
        <span className="font-semibold block text-xs text-[#e11d48]">Verification Notice</span>
        <p className="text-[11px] leading-relaxed text-[#a1a1aa] break-words [overflow-wrap:anywhere]">
          {message}
        </p>
        {foundUrl && (
          <a
            href={foundUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[#e11d48] hover:underline text-[11px] font-medium pt-1"
          >
            <span>Open Link in New Tab</span>
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

export function CreatorConnectors({
  creator,
  onUpdateCreator,
  onUpdateRateCards,
  preferredCurrency = 'USD'
}) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [autoAuditChannel, setAutoAuditChannel] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Strictly check if genuine YouTube channel data is connected
  const isYouTubeConnected = Boolean(creator.youtubeConnected === true && creator.youtube);
  const ytData = creator.youtube || null;

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      const res = await connectYouTubeWithServer({
        creatorId: creator.id || 'creator_01'
      });

      const channel = res.channel;

      const updated = {
        ...creator,
        name: channel.title,
        handle: channel.handle,
        avatar: channel.avatar || creator.avatar,
        subscribers: channel.subscribers,
        subscribersFormatted: channel.subscribersFormatted,
        verified: true,
        youtubeConnected: true,
        youtubeChannelId: channel.channelId,
        youtube: channel,
        recentVideos: channel.recentUploads?.length ? channel.recentUploads : [],
        googleAccount: res.googleUser,
        serverVerified: true,
        firestoreSaved: true
      };

      onUpdateCreator(updated);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });

      setIsConnectModalOpen(false);

      // Automatically launch Automatic Audit Process!
      setAutoAuditChannel(channel);
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message || "Failed to verify YouTube channel with Google OAuth.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAutoAuditComplete = ({ audit, rateCards }) => {
    onUpdateCreator({
      ...creator,
      audit,
      aiScore: audit.aiScore || creator.aiScore || 92,
      category: audit.category || creator.category,
      tags: (audit.nicheTags && audit.nicheTags.length > 0) ? audit.nicheTags : creator.tags
    });

    if (onUpdateRateCards && rateCards?.length) {
      onUpdateRateCards(rateCards);
    }

    setAutoAuditChannel(null);
    showToast(`Verified: ${creator.name}! Automatic AI Audit complete & rate cards calibrated.`);
  };

  const handleDisconnectYouTube = async () => {
    if (confirm("Disconnect your verified YouTube channel? This removes your channel telemetry from Cloud Firestore and marks your directory listing unverified.")) {
      try {
        await disconnectYouTubeWithServer({ creatorId: creator.id || 'creator_01' });
        onUpdateCreator({
          ...creator,
          youtubeConnected: false,
          youtube: null,
          verified: false
        });
        showToast("YouTube channel disconnected and removed from Cloud Firestore.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const disabledPlatforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: InstagramIcon,
      scope: 'Instagram Graph API (Reels & Story telemetry)',
      description: 'Sync Instagram Reels metrics, engagement rates, and follower demographics.',
      badge: 'Coming in v2.1'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: TikTokIcon,
      scope: 'TikTok for Creators API (Video views & sound reach)',
      description: 'Sync TikTok Creator Marketplace metrics, short-form retention, and hashtag reach.',
      badge: 'Coming in v2.1'
    },
    {
      id: 'x',
      name: 'X (formerly Twitter)',
      icon: XIcon,
      scope: 'X API v2 (Developer impressions & community)',
      description: 'Verify X Premium reach, technical impressions, and developer community presence.',
      badge: 'Coming in v2.2'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FacebookIcon,
      scope: 'Meta Graph API (Page insights & video reach)',
      description: 'Link Facebook video creator pages, crossposting analytics, and Meta insights.',
      badge: 'Coming in v2.2'
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: ThreadsIcon,
      scope: 'Threads API (Conversational engagement)',
      description: 'Sync Threads text discussions, replies, and developer engagement velocity.',
      badge: 'Coming in v2.2'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#18181b] border border-[#e11d48] text-[#fafafa] px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={14} className="text-[#e11d48]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Social channel connectors
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Connect your authentic social channels through official OAuth. Manual handle inputs are disabled to prevent fake claims.
          </p>
        </div>
        <Badge variant="action" className="text-xs shrink-0">
          YouTube Enabled (MVP)
        </Badge>
      </div>

      {/* Active Connector: YouTube */}
      <div className="space-y-3">
        <h2 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
          Active connector (Google YouTube Data API v3)
        </h2>

        <Card className="border-[#e11d48]/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/30 flex items-center justify-center text-[#e11d48] shrink-0">
                <YoutubeIcon size={26} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-semibold text-[#fafafa]">YouTube</h3>
                  {isYouTubeConnected ? (
                    <Badge variant="action" className="text-[10px]">
                      Connected & Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-[#71717a]">
                      Not Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#a1a1aa]">
                  OAuth 2.0 with <code className="text-[#fafafa] bg-[#18181b] px-1.5 py-0.5 rounded text-[11px]">youtube.readonly</code> permission. Channel ownership is verified directly by Google.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {isYouTubeConnected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setErrorMessage(null);
                      setIsConnectModalOpen(true);
                    }}
                    className="space-x-1.5"
                  >
                    <RefreshCw size={12} />
                    <span>Re-verify Channel</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnectYouTube}
                    className="text-[#71717a] hover:text-[#e11d48]"
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setErrorMessage(null);
                    setIsConnectModalOpen(true);
                  }}
                  className="space-x-1.5"
                >
                  <YoutubeIcon size={14} />
                  <span>Connect YouTube Channel</span>
                </Button>
              )}
            </div>
          </div>

          {/* Connected Channel Telemetry Details */}
          {isYouTubeConnected && ytData ? (
            <div className="pt-4 border-t border-[#27272a] space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#18181b]/50 p-3.5 rounded-lg text-xs">
                <div>
                  <span className="text-[#71717a] block text-[10px] uppercase">Channel Name</span>
                  <span className="font-semibold text-[#fafafa]">{ytData.title || creator.name}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block text-[10px] uppercase">Verified Handle</span>
                  <span className="font-semibold text-[#fafafa]">{ytData.handle || creator.handle}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block text-[10px] uppercase">Subscribers</span>
                  <span className="font-bold text-[#e11d48] tabular-nums">{ytData.subscribersFormatted}</span>
                </div>
                <div>
                  <span className="text-[#71717a] block text-[10px] uppercase">Total Views</span>
                  <span className="font-semibold text-[#fafafa] tabular-nums">{ytData.viewsFormatted || ytData.viewCount?.toLocaleString() || 'Verified'}</span>
                </div>
              </div>

              {/* Firestore Persistence Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-[#71717a]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[#fafafa] font-medium">Verified by Google & Saved in Cloud Firestore</span>
                  <span className="text-[#52525b]">|</span>
                  <span className="text-[#a1a1aa]">Channel ID: <code className="text-[#fafafa]">{ytData.channelId}</code></span>
                </div>
                {creator.googleAccount?.email && (
                  <div className="text-[#a1a1aa]">
                    Account: <span className="text-[#fafafa] font-medium">{creator.googleAccount.email}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#27272a]/60 flex items-center justify-between text-xs text-[#71717a]">
              <span>No YouTube channel currently connected. Click connect to authenticate with Google.</span>
              <span className="text-[11px] text-[#52525b]">Anti-spoofing enabled</span>
            </div>
          )}
        </Card>
      </div>

      {/* Disabled Platforms Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-semibold text-[#71717a] tracking-wider">
            Upcoming platforms (Disabled in MVP)
          </h2>
          <span className="text-[11px] text-[#52525b]">OAuth integrations scheduled for upcoming releases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disabledPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card
                key={platform.id}
                className="opacity-55 hover:opacity-65 transition-opacity border-dashed border-[#27272a] bg-[#09090b]/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#71717a]">
                        <Icon size={16} />
                      </div>
                      <h3 className="text-sm font-semibold text-[#fafafa]">{platform.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-[#71717a]">
                      {platform.badge}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#71717a] mt-3">
                    {platform.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#18181b] flex items-center justify-between">
                  <span className="text-[10px] text-[#52525b] flex items-center gap-1">
                    <Lock size={10} /> Disabled for MVP
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={true}
                    className="cursor-not-allowed opacity-50 text-xs h-7 px-3"
                  >
                    Connect {platform.name}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Connect YouTube Modal */}
      <Dialog
        isOpen={isConnectModalOpen}
        onClose={() => {
          if (!isConnecting) {
            setIsConnectModalOpen(false);
            setErrorMessage(null);
          }
        }}
        title="Connect YouTube Channel via Google"
        description="Verify your channel ownership through official Google OAuth 2.0."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Security & Verification Explanation */}
          <div className="p-3.5 bg-[#18181b] rounded-lg border border-[#27272a] space-y-2.5 text-xs text-[#a1a1aa]">
            <div className="flex items-center space-x-1.5 text-[#fafafa] font-semibold text-[11px]">
              <ShieldCheck size={14} className="text-[#e11d48]" />
              <span>Authentic Channel Verification (No Manual Handles)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#a1a1aa]">
              Manual handle entry is disabled to prevent anyone from falsely claiming channels they do not own.
              Signing in with Google authorizes read-only access to your channel metrics (<code className="text-[#fafafa]">youtube.readonly</code>) and verifies your real channel directly via the official YouTube Data API.
            </p>
          </div>

          <FormattedErrorBox message={errorMessage} />

          <div className="flex flex-col gap-2 pt-2 border-t border-[#27272a]">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full space-x-2 py-2.5 justify-center text-xs font-semibold"
            >
              <YoutubeIcon size={16} />
              <span>{isConnecting ? "Authorizing with Google..." : "Sign in with Google & Verify Channel"}</span>
            </Button>

            <Button
              variant="outline"
              type="button"
              disabled={isConnecting}
              onClick={() => {
                setIsConnectModalOpen(false);
                setErrorMessage(null);
              }}
              className="w-full text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      <AutoAuditModal
        isOpen={Boolean(autoAuditChannel)}
        channel={autoAuditChannel}
        creator={creator}
        onComplete={handleAutoAuditComplete}
        preferredCurrency={preferredCurrency}
      />
    </div>
  );
}
