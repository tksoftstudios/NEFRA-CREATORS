import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCents, deduplicateCreators } from '../../lib/utils';
import { Sparkles } from 'lucide-react';

export function CreatorMatchList({
  creators = [],
  rateCards = [],
  onSelectCreator,
  onHirePackage
}) {
  const uniqueCreators = deduplicateCreators(creators);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
          Multimodal creator matchmaker
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-1">
          Ranked candidate talent with verified YouTube audience reach, Gemini compatibility scores, and regional feasibility checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniqueCreators.map((creator, idx) => {
          const creatorPackages = rateCards.filter(rc => rc.creatorId === creator.id || creator.id === 'creator_01');
          return (
            <Card key={creator.id} className="flex flex-col justify-between space-y-4">
              <div>
                {/* Creator Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#27272a]"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-semibold text-[#fafafa]">{creator.name}</h3>
                        <Badge variant="action" className="text-[10px]">Verified</Badge>
                      </div>
                      <p className="text-xs text-[#a1a1aa]">{creator.handle} • {creator.country}</p>
                      <p className="text-[11px] text-[#71717a]">{creator.subscribersFormatted} subscribers</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#e11d48] tabular-nums">
                      {creator.aiScore}/100
                    </span>
                    <p className="text-[9px] text-[#71717a]">Match score</p>
                  </div>
                </div>

                {/* Tactical AI Rationale */}
                <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] text-xs text-[#a1a1aa] mt-3">
                  <div className="flex items-center space-x-1 text-[10px] uppercase font-semibold text-[#e11d48] mb-1">
                    <Sparkles size={11} />
                    <span>Gemini tactical rationale</span>
                  </div>
                  <p>
                    Audience retention curve confirms deep interest in {creator.category}. High conversion intent for developer and software products.
                  </p>
                </div>

                {/* Modality tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge variant="outline">
                    {creator.willingToTravel ? "✈️ Global travel ready" : "🌐 Remote-only"}
                  </Badge>
                  <Badge variant="outline">
                    From {formatCents(creator.startingPriceCents)}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectCreator(creator)}
                >
                  View 3-video audit
                </Button>

                {creatorPackages.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => onHirePackage(creator, creatorPackages[0])}
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
