import { verifyYouTubeAccessToken } from '../services/youtubeService.js';
import { store } from '../data/inMemoryStore.js';

export async function verifyYouTube(req, res) {
  try {
    const { accessToken, email } = req.body;
    const channelData = await verifyYouTubeAccessToken(accessToken || 'mock_token');

    // Update in-memory creator store
    if (store.creators.length > 0) {
      store.creators[0].googleVerified = true;
      if (email) store.creators[0].email = email;
      store.creators[0].youtube = {
        ...store.creators[0].youtube,
        channelId: channelData.channelId,
        title: channelData.title,
        subscribers: channelData.statistics.subscribers,
        totalViews: channelData.statistics.views,
        videoCount: channelData.statistics.videoCount
      };
    }

    res.json({
      success: true,
      message: 'YouTube account verified with view-only permissions',
      channel: channelData
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}
