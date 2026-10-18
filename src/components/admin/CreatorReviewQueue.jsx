import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

export function CreatorReviewQueue({
  creators = [],
  onApproveCreator,
  onRejectCreator
}) {
  const pendingCreators = creators.filter(c => c.status === 'pending_review' || c.status === 'review');

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Creator verification queue
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Review newly connected YouTube creators, verify audience authenticity, and approve public directory listing.
          </p>
        </div>
        <Badge variant={pendingCreators.length > 0 ? "action" : "outline"}>
          {pendingCreators.length} pending approval
        </Badge>
      </div>

      {pendingCreators.length === 0 ? (
        <Card className="text-center py-12 text-[#71717a] text-xs">
          <CheckCircle2 size={28} className="mx-auto text-[#71717a] mb-2" />
          <p className="text-sm font-semibold text-[#fafafa]">Review queue is clear</p>
          <p className="mt-1">All registered creators have been audited and approved to the directory.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingCreators.map(creator => (
            <Card key={creator.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                <div className="flex items-center space-x-3">
                  <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#fafafa]">{creator.name}</h3>
                    <p className="text-xs text-[#a1a1aa]">{creator.handle} • {creator.category} • {creator.country}</p>
                    <p className="text-[11px] text-[#71717a]">{creator.subscribersFormatted} subscribers on YouTube</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#e11d48]">{creator.aiScore}/100</span>
                  <p className="text-[10px] text-[#71717a]">Audit score</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#71717a]">
                  3 latest videos analyzed: 90%+ audience retention confirmed.
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRejectCreator(creator.id, "Channel does not meet minimum technical requirement")}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onApproveCreator(creator.id)}
                  >
                    Approve creator & grant welcome bonus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
