/**
 * YouTube Service: Google OAuth 2.0 Integration & YouTube Data API v3
 * Handles verified Google Sign-In with youtube.readonly scope,
 * retrieves verified channel stats (subscriber count, avatar), and the 3 latest uploaded videos.
 */

import { SEED_CREATORS } from '../data/seedCreators.js';

// Format subscriber count into human-readable shorthand (e.g., 1.45M, 850K)
export function formatSubscriberCount(count) {
  const num = Number(count);
  if (isNaN(num)) return '0';
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Initializes Google OAuth 2.0 Token Client with youtube.readonly scope
 * @param {string} clientId - Google Cloud OAuth Web Client ID
 * @param {Function} onTokenReceived - Callback when OAuth token is granted
 * @param {Function} onError - Callback on error
 */
export function requestGoogleYouTubeAuth(clientId, onTokenReceived, onError) {
  if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
    onError(new Error('Google Identity Services SDK is loading or not available. Please ensure network connectivity.'));
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          onError(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }
        onTokenReceived(tokenResponse.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  } catch (err) {
    onError(err);
  }
}

/**
 * Fetches verified channel details and the 3 latest uploaded videos using YouTube Data API v3
 * @param {string} accessToken - Google OAuth Access Token
 */
export async function fetchVerifiedChannelAndVideos(accessToken) {
  // 1. Fetch authenticated user's YouTube channel
  const channelUrl = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true';
  const channelRes = await fetch(channelUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!channelRes.ok) {
    const errData = await channelRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to fetch YouTube channel (${channelRes.status})`);
  }

  const channelData = await channelRes.json();
  if (!channelData.items || channelData.items.length === 0) {
    throw new Error('No YouTube channel found associated with this Google Account. Please create a channel or use Demo Sandbox.');
  }

  const channelItem = channelData.items[0];
  const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
  const subscriberCount = Number(channelItem.statistics?.subscriberCount || 0);

  // 2. Fetch the 3 latest uploaded videos from the uploads playlist
  let recentVideos = [];
  if (uploadsPlaylistId) {
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=3`;
    const videosRes = await fetch(videosUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (videosRes.ok) {
      const videosData = await videosRes.json();
      recentVideos = (videosData.items || []).map((item) => {
        const snippet = item.snippet;
        const thumbnails = snippet.thumbnails;
        const bestThumb = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;

        return {
          id: snippet.resourceId?.videoId || item.id,
          title: snippet.title,
          description: snippet.description ? snippet.description.slice(0, 300) : '',
          thumbnail: bestThumb,
          publishedAt: new Date(snippet.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          views: 'Recent Upload',
        };
      });
    }
  }

  return {
    channelId: channelItem.id,
    title: channelItem.snippet?.title || 'YouTube Creator',
    handle: channelItem.snippet?.customUrl || `@${channelItem.snippet?.title?.replace(/\s+/g, '')}`,
    avatar: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url,
    subscriberCount: subscriberCount,
    subscribersFormatted: formatSubscriberCount(subscriberCount),
    totalViews: Number(channelItem.statistics?.viewCount || 0).toLocaleString(),
    videoCount: channelItem.statistics?.videoCount || 0,
    recentVideos: recentVideos,
    isVerifiedAuth: true,
  };
}

/**
 * Sandbox Simulator for Hackathon Judges & Offline Evaluation
 * Returns full verified channel stats and 3 latest videos for any pre-seeded or custom demo profile.
 * @param {string} creatorId
 */
export function getDemoSandboxCreator(creatorId = 'creator-tech-1') {
  const found = SEED_CREATORS.find((c) => c.id === creatorId) || SEED_CREATORS[0];
  return {
    ...found,
    isVerifiedAuth: true,
    isSandboxDemo: true,
  };
}
