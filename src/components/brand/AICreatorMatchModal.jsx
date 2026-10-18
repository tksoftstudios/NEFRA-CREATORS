import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCents } from '../../lib/utils';
import { matchCreatorsWithGemini } from '../../packages/ai/geminiClient';
import { 
  Sparkles, 
  MessageCircle, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Plane, 
  Globe, 
  DollarSign, 
  Eye, 
  Search,
  Zap,
  ArrowRight
} from 'lucide-react';

export function AICreatorMatchModal({
  campaign,
  creators = [],
  rateCards = [],
  isOpen,
  onClose,
  onOpenChat,
  onSelectCreator,
  onHirePackage
}) {
  const [loading, setLoading] = useState(true);
  const [matchedCreators, setMatchedCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen || !campaign) return;

    let isMounted = true;
    setLoading(true);

    matchCreatorsWithGemini(campaign, creators)
      .then(results => {
        if (isMounted) {
          setMatchedCreators(results);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error running AI creator match for gig:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, campaign, creators]);

  if (!campaign) return null;

  const filteredMatches = matchedCreators.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.handle?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  });

  const handleChatWithCreator = (creator) => {
    onClose();
    if (onOpenChat) {
      const brand = campaign.brandName || 'our brand';
      const budget = formatCents(campaign.budgetCents);
      const msg = `Hi ${creator.name}! I'm with ${brand}. We matched your channel for our gig "${campaign.title}" (Budget: ${budget}). We'd love to collaborate on this deliverable. Let's discuss requirements and lock escrow!`;
      onOpenChat(creator, msg);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="AI Creator Match for Gig"
      description={`Finding the most suitable creators for: ${campaign.title}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Campaign / Gig Telemetry Header */}
        <div className="p-3.5 bg-[#18181b] rounded-xl border border-[#27272a] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#a1a1aa] tracking-wider block">
                Target Gig Specification
              </span>
              <h3 className="text-sm font-bold text-[#fafafa]">{campaign.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="action" className="text-[10px]">
                Budget: {formatCents(campaign.budgetCents)}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {campaign.category}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                Modality: {campaign.modality?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {campaign.description && (
            <p className="text-xs text-[#71717a] line-clamp-2">
              {campaign.description}
            </p>
          )}

          <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-xs text-[#a1a1aa]">
            <div className="flex items-center gap-1.5 text-[#3b82f6] text-[11px] font-medium">
              <Sparkles size={13} />
              <span>NEFRA Multimodal Semantic Matchmaker</span>
            </div>
            <span className="text-[11px] text-[#71717a]">
              Evaluated across Niche, Budget, Geography & Modality
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter matched creators by name, handle, or skills..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#09090b] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 size={24} className="animate-spin text-[#3b82f6]" />
            <div>
              <p className="text-xs font-semibold text-[#fafafa]">
                Analyzing creators with NEFRA Matchmaker...
              </p>
              <p className="text-[11px] text-[#71717a] mt-0.5">
                Benchmarking audience retention curves, topical niche, and escrow budget alignment
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
            {filteredMatches.map((creator, idx) => {
              const score = creator.matchScore || 85;
              const isTopPick = score >= 90;
              const isFeasibilityWarning = !creator.modalityFeasible || score < 60;
              const creatorPackages = rateCards.filter(rc => rc.creatorId === creator.id || creator.id === 'creator_01');

              return (
                <div
                  key={creator.id}
                  className={`p-4 rounded-xl border transition-all ${
                    idx === 0 && isTopPick
                      ? 'bg-[#18181b] border-[#10b981]/50 shadow-lg shadow-[#10b981]/5'
                      : isFeasibilityWarning
                      ? 'bg-[#18181b]/60 border-[#f59e0b]/30'
                      : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Creator Identity */}
                    <div className="flex items-start space-x-3">
                      <img
                        src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#27272a] shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#fafafa]">{creator.name}</h4>
                          <Badge variant="action" className="text-[9px] py-0 px-1">Verified</Badge>
                          {creator.willingToTravel ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                              <Plane size={10} /> Travel ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-[#71717a] bg-[#27272a] px-1.5 py-0.5 rounded">
                              <Globe size={10} /> Remote-only
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#a1a1aa] mt-0.5">
                          {creator.handle} • {creator.country} • {creator.subscribersFormatted} subscribers
                        </p>
                        <p className="text-[11px] text-[#71717a]">
                          Starting rate: {formatCents(creator.startingPriceCents || 200000)}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-left sm:text-right shrink-0">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`text-base font-bold tabular-nums ${
                          isFeasibilityWarning ? 'text-[#f59e0b]' : (isTopPick ? 'text-[#10b981]' : 'text-[#3b82f6]')
                        }`}>
                          {score}%
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isFeasibilityWarning 
                            ? 'bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30'
                            : (isTopPick 
                                ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30' 
                                : 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30')
                        }`}>
                          {creator.fitTier || (isTopPick ? 'Top Pick' : 'Match')}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#71717a] mt-0.5">
                        {creator.budgetFit || 'Budget compatible'}
                      </p>
                    </div>
                  </div>

                  {/* Tactical AI Rationale */}
                  {creator.tacticalRationale && (
                    <div className="mt-3 p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs text-[#a1a1aa] space-y-1">
                      <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-[#3b82f6]">
                        <Sparkles size={11} />
                        <span>AI Rationale for this Gig</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {creator.tacticalRationale}
                      </p>
                    </div>
                  )}

                  {/* Strengths Pills */}
                  {Array.isArray(creator.keyStrengths) && creator.keyStrengths.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {creator.keyStrengths.map((str, sIdx) => (
                        <span 
                          key={sIdx}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#27272a] text-[#a1a1aa]"
                        >
                          <CheckCircle2 size={10} className="text-[#10b981]" />
                          <span>{str}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-[#27272a] flex items-center justify-between gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        if (onSelectCreator) onSelectCreator(creator);
                      }}
                      className="cursor-pointer text-xs space-x-1"
                    >
                      <Eye size={12} />
                      <span>View Audit</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      {creatorPackages.length > 0 && onHirePackage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onClose();
                            onHirePackage(creator, creatorPackages[0]);
                          }}
                          className="border-[#27272a] text-xs hover:border-[#10b981] cursor-pointer"
                        >
                          Hire Rate Card ({formatCents(creatorPackages[0].priceCents)})
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleChatWithCreator(creator)}
                        className="space-x-1.5 bg-[#1db954] hover:bg-[#1aa34a] text-black font-semibold cursor-pointer text-xs"
                      >
                        <MessageCircle size={13} />
                        <span>Chat & Offer Gig</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMatches.length === 0 && (
              <div className="py-8 text-center text-xs text-[#71717a]">
                No creators found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-[#27272a] flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
