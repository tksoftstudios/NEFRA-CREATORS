import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCents } from '../../lib/utils';
import { ShieldCheck, Play, Award, CheckCircle2 } from 'lucide-react';

export function CreatorDetailModal({
  creator,
  isOpen,
  onClose,
  rateCards = [],
  onHirePackage
}) {
  if (!creator) return null;

  const creatorPackages = rateCards.filter(rc => rc.creatorId === creator.id || creator.id === 'creator_01');

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={creator.name}
      description={`${creator.handle} • ${creator.category} • ${creator.residence || creator.country}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Creator Header Card */}
        <div className="flex items-center space-x-4 bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 rounded-full object-cover border border-[#27272a]"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold text-[#fafafa]">{creator.name}</h4>
              <Badge variant="action" className="text-[10px]">Verified YouTube</Badge>
            </div>
            <p className="text-xs text-[#a1a1aa]">{creator.bio}</p>
            <div className="flex items-center space-x-3 text-xs text-[#71717a] pt-1">
              <span><strong>{creator.subscribersFormatted}</strong> Subscribers</span>
              <span>•</span>
              <span><strong>{creator.avgViewsFormatted}</strong> Avg Views</span>
              <span>•</span>
              <span className="text-[#e11d48] font-semibold">{creator.aiScore}/100 AI Score</span>
            </div>
          </div>
        </div>

        {/* 3-Video Multimodal Audit Scorecard */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
              Gemini 3-Video Multimodal Audit
            </h5>
            <span className="text-[11px] text-[#71717a]">Verified Video Telemetry</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a] text-center">
              <p className="text-[10px] text-[#71717a] uppercase">Production Quality</p>
              <p className="text-lg font-bold text-[#fafafa] tabular-nums mt-0.5">
                {creator.audit?.productionQuality || 92}%
              </p>
            </div>
            <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a] text-center">
              <p className="text-[10px] text-[#71717a] uppercase">Hook Retention</p>
              <p className="text-lg font-bold text-[#fafafa] tabular-nums mt-0.5">
                {creator.audit?.hookRetention || 89}%
              </p>
            </div>
            <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a] text-center">
              <p className="text-[10px] text-[#71717a] uppercase">Brand Safety</p>
              <p className="text-lg font-bold text-[#fafafa] tabular-nums mt-0.5">
                {creator.audit?.brandSafety || 99}%
              </p>
            </div>
          </div>

          {/* Videos Carousel / List */}
          <div className="space-y-2 pt-1">
            {(creator.recentVideos || []).map((video, idx) => (
              <div key={video.id || idx} className="p-3 bg-[#18181b]/50 border border-[#27272a] rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-[#27272a] flex items-center justify-center text-[#e11d48]">
                    <Play size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#fafafa]">{video.title}</p>
                    <p className="text-[10px] text-[#71717a]">{video.views} views • Gemini Verified</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">Audited</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Rate Cards & Instant Booking */}
        <div className="space-y-3 pt-2">
          <h5 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
            Available Rate Cards & Packages
          </h5>

          <div className="space-y-2">
            {creatorPackages.map(pkg => (
              <div
                key={pkg.id}
                className="p-4 bg-[#18181b] border border-[#27272a] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-[#fafafa]">{pkg.title}</span>
                    <Badge variant="outline">{pkg.turnaroundDays} days delivery</Badge>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1">{pkg.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(pkg.deliverables || []).slice(0, 2).map((d, i) => (
                      <span key={i} className="text-[10px] text-[#71717a] flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-[#e11d48]" /> {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#fafafa] tabular-nums">
                      {formatCents(pkg.priceCents)}
                    </span>
                    <p className="text-[10px] text-[#71717a]">100% Escrow</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onHirePackage(creator, pkg);
                      onClose();
                    }}
                  >
                    Order and fund escrow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
