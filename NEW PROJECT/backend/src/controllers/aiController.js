import { analyzeVideoUrl, getChannelSafetyAudit } from '../services/geminiService.js';
import { store } from '../data/inMemoryStore.js';

export async function auditVideo(req, res) {
  const { videoUrl, videoTitle } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL or YouTube ID is required' });
  }

  const result = await analyzeVideoUrl(videoUrl, videoTitle);

  // Append to store critiques
  store.aiAudit.recentCritiques.unshift({
    videoTitle: result.videoTitle,
    views: '12,500',
    hookScore: result.hookScore,
    pacingScore: result.pacingScore,
    sponsorReadiness: result.sponsorReadiness,
    critiqueText: result.critiqueText
  });

  res.json({
    success: true,
    message: 'Multimodal video audit generated via Gemini 2.5 Flash',
    analysis: result
  });
}

export function getChannelSafety(req, res) {
  const audit = getChannelSafetyAudit();
  res.json({
    success: true,
    audit: {
      ...store.aiAudit,
      ...audit
    }
  });
}
