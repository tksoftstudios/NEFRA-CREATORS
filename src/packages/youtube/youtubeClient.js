/**
 * YouTube Data API Client
 * Google OAuth 2.0 with youtube.readonly scope
 * Fetches real channel telemetry directly from Google's YouTube Data API v3
 */

export async function verifyYouTubeChannel(accessToken) {
  if (!accessToken) {
    throw new Error('Google OAuth access token is required to verify YouTube channel.');
  }

  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const errorBody = await res.text();
    let parsed;
    try { parsed = JSON.parse(errorBody); } catch (e) {}
    const msg = parsed?.error?.message || `YouTube API responded with status ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found associated with this Google account. Please sign in with the account that owns or manages your YouTube channel.');
  }

  const item = data.items[0];
  const uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads;
  let recentUploads = [];

  if (uploadsPlaylistId) {
    try {
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=25`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        }
      );
      if (playlistRes.ok) {
        const playlistData = await playlistRes.json();
        recentUploads = (playlistData.items || []).map(vid => ({
          id: vid.snippet?.resourceId?.videoId || vid.id,
          title: vid.snippet?.title || 'Upload',
          publishedAt: vid.snippet?.publishedAt,
          url: `https://youtube.com/watch?v=${vid.snippet?.resourceId?.videoId || vid.id}`
        }));
      }
    } catch (e) {
      console.warn('[YouTube Client] Could not fetch playlist uploads:', e.message);
    }
  }

  const rawSubs = parseInt(item.statistics?.subscriberCount || '0', 10);
  const rawViews = parseInt(item.statistics?.viewCount || '0', 10);
  const rawVideos = parseInt(item.statistics?.videoCount || '0', 10);

  return {
    verified: true,
    channelId: item.id,
    title: item.snippet?.title || 'YouTube Channel',
    handle: item.snippet?.customUrl || `@${(item.snippet?.title || 'channel').replace(/\s+/g, '').toLowerCase()}`,
    avatar: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    description: item.snippet?.description || '',
    subscribers: rawSubs,
    subscribersFormatted: rawSubs.toLocaleString(),
    videoCount: rawVideos,
    viewCount: rawViews,
    viewsFormatted: rawViews.toLocaleString(),
    recentUploads,
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    verifiedAt: new Date().toISOString()
  };
}
