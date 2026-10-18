import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { BidModal } from './BidModal';
import { formatCents } from '../../lib/utils';
import { ShieldCheck, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OpportunitiesBoard({
  campaigns = [],
  creator,
  credits,
  onDeductCredits,
  onAddNewBid
}) {
  const [selectedModality, setSelectedModality] = useState('all');
  const [activeCampaignForBid, setActiveCampaignForBid] = useState(null);

  const modalities = [
    { id: 'all', label: 'All modalities', count: campaigns.length },
    { id: 'online', label: 'Online / Remote' },
    { id: 'hybrid', label: 'Hybrid / Hardware' },
    { id: 'physical', label: 'Physical On-Site' }
  ];

  const filteredCampaigns = campaigns.filter(c => {
    if (selectedModality === 'all') return true;
    return c.modality === selectedModality;
  });

  const handleBidSubmit = (bidData) => {
    onAddNewBid(bidData);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Brand campaign opportunities
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Browse verified enterprise briefs with 100% pre-funded escrow deposits.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={modalities}
        activeTab={selectedModality}
        onChange={setSelectedModality}
      />

      {/* Campaign Cards List */}
      <div className="space-y-4">
        {filteredCampaigns.map((camp) => {
          // Feasibility logic: Cannot travel to physical shoots
          const cannotTravel = camp.modality === 'physical' && !creator.willingToTravel;
          const matchPercent = cannotTravel ? 45 : (camp.category === creator.category ? 96 : 82);

          return (
            <Card key={camp.id} className="hover:border-[#3f3f46] transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="action">{camp.modality.toUpperCase()}</Badge>
                    <span className="text-xs text-[#71717a] font-medium">{camp.category}</span>
                    <span className="text-xs text-[#71717a]">•</span>
                    <span className="text-xs text-[#a1a1aa]">Brand: <strong>{camp.brandName}</strong></span>
                    {camp.escrowGuaranteed && (
                      <Badge variant="outline" className="text-[10px] space-x-1">
                        <ShieldCheck size={10} className="text-[#e11d48]" />
                        <span>Escrow Guaranteed</span>
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-[#fafafa]">{camp.title}</h3>
                  <p className="text-xs text-[#a1a1aa] max-w-2xl">{camp.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717a] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Deadline: {camp.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> Target: {(camp.targetCountries || []).join(', ')}
                    </span>
                    <span>{camp.deliverableType}</span>
                  </div>

                  {cannotTravel && (
                    <div className="flex items-center space-x-2 p-2 bg-[#e11d48]/10 border border-[#e11d48]/20 rounded text-xs text-[#e11d48] mt-2">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>This campaign requires on-site presence. Your profile indicates you are remote-only or unable to travel internationally.</span>
                    </div>
                  )}
                </div>

                {/* Right Side: Budget, Match Score, Bid Action */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between shrink-0 gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#27272a]">
                  <div className="text-left lg:text-right">
                    <p className="text-lg font-bold text-[#fafafa] tabular-nums">
                      {formatCents(camp.budgetCents)}
                    </p>
                    <p className="text-[10px] text-[#71717a]">Escrow budget</p>
                    <div className="flex items-center space-x-1 mt-1 justify-start lg:justify-end">
                      <span className="text-xs font-semibold text-[#e11d48]">{matchPercent}%</span>
                      <span className="text-[10px] text-[#71717a]">compatibility</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={cannotTravel}
                    onClick={() => setActiveCampaignForBid(camp)}
                  >
                    {cannotTravel ? "Cannot travel" : "Apply & submit bid"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bid Modal */}
      {activeCampaignForBid && (
        <BidModal
          campaign={activeCampaignForBid}
          creator={creator}
          isOpen={Boolean(activeCampaignForBid)}
          onClose={() => setActiveCampaignForBid(null)}
          credits={credits}
          onDeductCredits={onDeductCredits}
          onSubmitBid={handleBidSubmit}
        />
      )}
    </div>
  );
}
