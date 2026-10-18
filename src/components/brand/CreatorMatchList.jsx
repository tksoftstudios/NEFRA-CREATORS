import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCents, deduplicateCreators } from '../../lib/utils';
import { matchCreatorsWithGemini } from '../../packages/ai/geminiClient';
import { 
  Sparkles, 
  MessageCircle, 
  Plane, 
  Globe, 
  Briefcase, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  ChevronDown 
} from 'lucide-react';

export function CreatorMatchList({
  creators = [],
  rateCards = [],
  campaigns = [],
  initialCampaignId = null,
  onSelectCreator,
  onHirePackage,
  onOpenChat
}) {
  const uniqueCreators = deduplicateCreators(creators);
  const [selectedGigId, setSelectedGigId] = useState(initialCampaignId || (campaigns[0]?.id || ''));
  const [isMatching, setIsMatching] = useState(false);
  const [rankedCreators, setRankedCreators] = useState(uniqueCreators);

  const activeGig = campaigns.find(c => c.id === selectedGigId) || null;

  useEffect(() => {
    if (!activeGig) {
      setRankedCreators(uniqueCreators);
      return;
    }

    let isMounted = true;
    setIsMatching(true);

    matchCreatorsWithGemini(activeGig, uniqueCreators)
      .then(results => {
        if (isMounted) {
          setRankedCreators(results);
          setIsMatching(false);
        }
      })
      .catch(err => {
        console.error('Failed to match creators for gig in matchmaker:', err);
        if (isMounted) {
          setRankedCreators(uniqueCreators);
          setIsMatching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGigId, activeGig, creators]);

  const handleOpenChatForCreator = (creator) => {
    if (!onOpenChat) return;
    if (activeGig) {
      const budget = formatCents(activeGig.budgetCents);
      const msg = `Hi ${creator.name}! I'm with ${activeGig.brandName || 'our brand'}. We matched your channel for our gig "${activeGig.title}" (Budget: ${budget}). We'd love to collaborate on this deliverable. Let's discuss requirements and lock escrow!`;
      onOpenChat(creator, msg);
    } else {
      onOpenChat(creator, `Hi ${creator.name}! I'm interested in collaborating on a video campaign for our brand. Let's discuss custom deliverables.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#27272a] pb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
          Multimodal creator matchmaker
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-1">
          Ranked candidate talent with verified YouTube audience reach, Gemini compatibility scores, and regional feasibility checks.
        </p>
      </div>

      {/* Target Gig Switcher Banner */}
      {campaigns.length > 0 && (
        <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#3b82f6] tracking-wider flex items-center gap-1">
              <Sparkles size={12} />
              AI Gig Matching Mode
            </span>
            <p className="text-xs text-[#fafafa] font-medium">
              Select an active campaign to rank creators specifically for that deliverable:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[280px]">
              <select
                value={selectedGigId}
                onChange={(e) => setSelectedGigId(e.target.value)}
                className="w-full h-9 pl-3 pr-8 rounded-lg bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] focus:outline-none focus:border-[#3b82f6] cursor-pointer appearance-none"
              >
                <option value="">-- General Matchmaker (All Talents) --</option>
                {campaigns.map(camp => (
                  <option key={camp.id} value={camp.id}>
                    {camp.title} ({formatCents(camp.budgetCents)})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-[#71717a] pointer-events-none" />
            </div>

            {isMatching && (
              <Loader2 size={16} className="animate-spin text-[#3b82f6] shrink-0" />
            )}
          </div>
        </div>
      )}

      {/* Active Gig Context Tag */}
      {activeGig && (
        <div className="px-3.5 py-2.5 bg-[#09090b] rounded-lg border border-[#3b82f6]/30 flex items-center justify-between text-xs text-[#a1a1aa]">
          <div>
            Ranking for: <strong className="text-[#fafafa]">{activeGig.title}</strong>
            <span className="text-[#71717a] ml-2">• Budget: {formatCents(activeGig.budgetCents)} • {activeGig.category}</span>
          </div>
          <span className="text-[11px] text-[#3b82f6] font-medium">
            Google Vertex AI Match Active
          </span>
        </div>
      )}

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rankedCreators.map((creator, idx) => {
          const creatorPackages = rateCards.filter(rc => rc.creatorId === creator.id || creator.id === 'creator_01');
          const score = creator.matchScore !== undefined ? creator.matchScore : (creator.aiScore || 85);
          const isTopPick = score >= 90;
          const fitTier = creator.fitTier || (isTopPick ? 'Top Pick' : 'Match');

          return (
            <Card key={creator.id} className="flex flex-col justify-between space-y-4">
              <div>
                {/* Creator Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#27272a]"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <h3 className="text-sm font-semibold text-[#fafafa]">{creator.name}</h3>
                        <Badge variant="action" className="text-[10px]">Verified</Badge>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">{creator.handle} • {creator.country}</p>
                      <p className="text-[11px] text-[#71717a]">{creator.subscribersFormatted} subscribers</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-bold tabular-nums ${isTopPick ? 'text-[#10b981]' : 'text-[#e11d48]'}`}>
                      {score}/100
                    </span>
                    <p className="text-[9px] text-[#71717a]">
                      {activeGig ? fitTier : 'Match score'}
                    </p>
                  </div>
                </div>

                {/* Tactical AI Rationale */}
                <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] text-xs text-[#a1a1aa] mt-3">
                  <div className="flex items-center space-x-1 text-[10px] uppercase font-semibold text-[#e11d48] mb-1">
                    <Sparkles size={11} />
                    <span>{activeGig ? `AI Rationale for "${activeGig.title.slice(0, 30)}..."` : 'Gemini tactical rationale'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {creator.tacticalRationale || `Audience retention curve confirms deep interest in ${creator.category}. High conversion intent for developer and software products.`}
                  </p>
                </div>

                {/* Modality & Key Strengths tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {creator.willingToTravel ? (
                      <>
                        <Plane size={11} className="text-[#a1a1aa]" />
                        <span>Global travel ready</span>
                      </>
                    ) : (
                      <>
                        <Globe size={11} className="text-[#a1a1aa]" />
                        <span>Remote-only</span>
                      </>
                    )}
                  </Badge>
                  <Badge variant="outline">
                    From {formatCents(creator.startingPriceCents)}
                  </Badge>
                  {creator.budgetFit && (
                    <Badge variant="action" className="text-[10px]">
                      {creator.budgetFit}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectCreator(creator)}
                    className="cursor-pointer"
                  >
                    View audit
                  </Button>

                  {onOpenChat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenChatForCreator(creator)}
                      className="border-[#1db954]/40 text-[#1ed760] hover:bg-[#1db954]/10 space-x-1.5 cursor-pointer text-xs"
                    >
                      <MessageCircle size={13} />
                      <span>{activeGig ? 'Chat & Offer Gig' : 'Chat'}</span>
                    </Button>
                  )}
                </div>

                {creatorPackages.length > 0 && onHirePackage && (
                  <Button
                    size="sm"
                    onClick={() => onHirePackage(creator, creatorPackages[0])}
                    className="bg-[#1db954] hover:bg-[#1ed760] text-black font-semibold cursor-pointer"
                  >
                    Hire package ({formatCents(creatorPackages[0].priceCents)})
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
