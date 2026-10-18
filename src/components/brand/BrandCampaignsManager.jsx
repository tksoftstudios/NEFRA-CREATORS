import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { formatCents } from '../../lib/utils';
import { AICreatorMatchModal } from './AICreatorMatchModal';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Globe2, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign,
  FileText,
  Search,
  MessageSquare,
  MessageCircle,
  MapPin,
  Layers
} from 'lucide-react';

export function BrandCampaignsManager({
  campaigns = [],
  bids = [],
  creators = [],
  rateCards = [],
  onNavigate,
  onAcceptBid,
  onOpenChat,
  onSelectCreator,
  onHirePackage
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [reviewingCampaign, setReviewingCampaign] = useState(null);
  const [acceptedBidId, setAcceptedBidId] = useState(null);
  const [aiMatchCampaign, setAiMatchCampaign] = useState(null);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(camp => {
    if (activeTab === 'recruiting') return camp.status === 'open';
    if (activeTab === 'in_progress') return camp.status === 'in_progress' || camp.status === 'active';
    if (activeTab === 'completed') return camp.status === 'completed';
    return true;
  });

  // Total budget committed
  const totalBudgetCents = campaigns.reduce((acc, c) => acc + (c.budgetCents || 0), 0);
  const totalBidsCount = bids.length;

  // Bids for the campaign currently being reviewed
  const currentProposals = reviewingCampaign
    ? bids.filter(b => b.campaignId === reviewingCampaign.id)
    : [];

  const handleAcceptProposal = (bid) => {
    setAcceptedBidId(bid.id);
    setTimeout(() => {
      if (onAcceptBid) {
        onAcceptBid(bid, reviewingCampaign);
      }
      setReviewingCampaign(null);
      setAcceptedBidId(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              My marketing campaigns
            </h1>
            <Badge className="bg-[#e11d48]/15 text-[#e11d48] border-[#e11d48]/30 text-[10px]">
              Business Portal
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Manage your brand campaigns, review incoming creator proposals, and fund 100% pre-funded escrow milestones.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => onNavigate && onNavigate('new-campaign')}
          className="space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>Create new campaign (AI)</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Active Campaigns</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-bold text-[#fafafa]">{campaigns.length}</span>
            <span className="text-[11px] text-[#10b981]">running</span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Committed Escrow</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-bold text-[#fafafa]">{formatCents(totalBudgetCents)}</span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Proposals Received</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-bold text-[#3b82f6]">{totalBidsCount}</span>
            <span className="text-[11px] text-[#71717a]">creator bids</span>
          </div>
        </Card>

        <Card className="p-3.5 flex flex-col justify-between">
          <span className="text-[11px] text-[#71717a] font-medium uppercase tracking-wider">Escrow Protection</span>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-2xl font-bold text-[#10b981]">100%</span>
            <span className="text-[11px] text-[#71717a]">pre-funded</span>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#27272a] pb-3">
        {[
          { id: 'all', label: `All Campaigns (${campaigns.length})` },
          { id: 'recruiting', label: `Recruiting (${campaigns.filter(c => c.status === 'open').length})` },
          { id: 'in_progress', label: `In Production (${campaigns.filter(c => c.status === 'in_progress' || c.status === 'active').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#18181b] text-[#fafafa] border border-[#3f3f46]'
                : 'text-[#71717a] hover:text-[#fafafa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map(camp => {
          const campBids = bids.filter(b => b.campaignId === camp.id);
          const hasBids = campBids.length > 0;

          return (
            <Card key={camp.id} className="p-5 hover:border-[#3f3f46] transition-all space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#e11d48] uppercase tracking-wider">
                      {camp.brandName || "My Brand"}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-[#18181b] border-[#27272a] text-[#a1a1aa]">
                      {camp.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-[#18181b] border-[#27272a] text-[#a1a1aa] flex items-center gap-1">
                      {camp.modality === 'physical' ? (
                        <>
                          <MapPin size={11} className="text-[#a1a1aa]" />
                          <span>Physical on-site</span>
                        </>
                      ) : camp.modality === 'hybrid' ? (
                        <>
                          <Layers size={11} className="text-[#a1a1aa]" />
                          <span>Hybrid</span>
                        </>
                      ) : (
                        <>
                          <Globe2 size={11} className="text-[#a1a1aa]" />
                          <span>Online</span>
                        </>
                      )}
                    </Badge>
                    <Badge className="bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30 text-[10px] flex items-center space-x-1">
                      <ShieldCheck size={11} className="mr-0.5" />
                      <span>100% Escrow Guaranteed</span>
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#fafafa] tracking-tight">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-3xl">
                    {camp.description}
                  </p>
                </div>

                {/* Budget Column */}
                <div className="text-left md:text-right shrink-0 bg-[#18181b] p-3 rounded-xl border border-[#27272a] md:bg-transparent md:p-0 md:border-none">
                  <div className="text-[10px] text-[#71717a] uppercase font-semibold">Total Campaign Budget</div>
                  <div className="text-xl font-bold text-[#fafafa] tracking-tight mt-0.5">
                    {formatCents(camp.budgetCents)}
                  </div>
                  <div className="text-[10px] text-[#10b981] mt-0.5">Pre-funded Escrow Vault</div>
                </div>
              </div>

              {/* Campaign Telemetry & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#27272a] text-xs text-[#a1a1aa]">
                <div className="flex items-center space-x-2">
                  <Clock size={13} className="text-[#71717a]" />
                  <span>Deadline: <strong className="text-[#fafafa]">{camp.deadline}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText size={13} className="text-[#71717a]" />
                  <span>Deliverable: <strong className="text-[#fafafa]">{camp.deliverableType || "Dedicated Video"}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe2 size={13} className="text-[#71717a]" />
                  <span>Target: <strong className="text-[#fafafa]">{(camp.targetCountries || []).join(', ') || 'Global'}</strong></span>
                </div>
              </div>

              {/* Proposals Banner & Brand Actions */}
              <div className="pt-3 border-t border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${hasBids ? 'bg-[#3b82f6] animate-pulse' : 'bg-[#71717a]'}`} />
                  <span className="text-xs font-semibold text-[#fafafa]">
                    {campBids.length} {campBids.length === 1 ? 'Creator Proposal' : 'Creator Proposals'} Received
                  </span>
                  {hasBids && (
                    <span className="text-[11px] text-[#71717a]">
                      • Ready for your review and contract lock
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setReviewingCampaign(camp)}
                    className="space-x-1.5 cursor-pointer bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                  >
                    <Users size={13} />
                    <span>Review Proposals ({campBids.length})</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAiMatchCampaign(camp)}
                    className="border-[#27272a] text-xs text-[#fafafa] hover:border-[#e11d48] hover:bg-[#e11d48]/10 cursor-pointer space-x-1.5"
                    title="Run NEFRA Matchmaker for this gig"
                  >
                    <Sparkles size={13} className="text-[#e11d48]" />
                    <span>AI Creator Match</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredCampaigns.length === 0 && (
          <Card className="p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center mx-auto text-[#71717a]">
              <Briefcase size={18} />
            </div>
            <h4 className="text-sm font-semibold text-[#fafafa]">No campaigns in this category</h4>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto">
              Ready to launch your influencer campaign? Use our AI Campaign Builder to auto-structure deliverables and find talent.
            </p>
            <Button
              size="sm"
              onClick={() => onNavigate && onNavigate('new-campaign')}
              className="mt-2 space-x-1"
            >
              <PlusCircle size={14} />
              <span>Create Campaign</span>
            </Button>
          </Card>
        )}
      </div>

      {/* Proposal Review Modal */}
      {reviewingCampaign && (
        <Dialog
          isOpen={Boolean(reviewingCampaign)}
          onClose={() => setReviewingCampaign(null)}
          title={`Review Proposals: ${reviewingCampaign.title}`}
          description={`Budget Cap: ${formatCents(reviewingCampaign.budgetCents)} • Deliverable: ${reviewingCampaign.deliverableType || 'Video Review'}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {currentProposals.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {currentProposals.map(bid => (
                  <div
                    key={bid.id}
                    className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 hover:border-[#3b82f6]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={bid.creatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                          alt={bid.creatorName}
                          className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-[#fafafa]">{bid.creatorName}</span>
                            <Badge className="bg-[#10b981]/15 text-[#10b981] border-none text-[9px] px-1.5 py-0">
                              AI {bid.creatorAiScore || 92}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-[#71717a]">{bid.creatorHandle}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#fafafa]">
                          {formatCents(bid.amountCents)}
                        </div>
                        <span className="text-[10px] text-[#71717a]">
                          {bid.turnaroundDays ? `${bid.turnaroundDays}-day delivery` : '7-day delivery'}
                        </span>
                      </div>
                    </div>

                    {/* Creative Pitch submitted by Creator */}
                    <div className="p-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#a1a1aa] leading-relaxed">
                      <div className="text-[10px] uppercase font-semibold text-[#71717a] mb-1">
                        Creator Pitch & Creative Concept
                      </div>
                      <p className="whitespace-pre-line text-[#d4d4d8] text-[11px]">
                        {bid.pitch || "I will deliver an authentic, high-impact review integrating your product directly into my regular developer workflow."}
                      </p>
                    </div>

                    {/* Accept & Chat Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] text-[#10b981] flex items-center space-x-1">
                        <ShieldCheck size={12} />
                        <span>10% platform fee handled automatically in escrow</span>
                      </span>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const creatorMatch = creators.find(c => c.id === bid.creatorId) || {
                              id: bid.creatorId,
                              name: bid.creatorName,
                              avatar: bid.creatorAvatar,
                              handle: bid.creatorHandle || '@creator'
                            };
                            if (onOpenChat) {
                              onOpenChat(creatorMatch, `Hi ${bid.creatorName}! I saw your proposal for "${reviewingCampaign?.title}". Let's discuss the scope and custom gig details.`);
                            }
                            setReviewingCampaign(null);
                          }}
                          className="border-[#27272a] text-xs space-x-1 cursor-pointer hover:border-[#3b82f6]"
                        >
                          <MessageCircle size={13} className="text-[#3b82f6]" />
                          <span>Chat & Scope</span>
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleAcceptProposal(bid)}
                          disabled={acceptedBidId === bid.id}
                          className="space-x-1 bg-[#10b981] hover:bg-[#059669] text-white cursor-pointer"
                        >
                          {acceptedBidId === bid.id ? (
                            <span>Locking Escrow...</span>
                          ) : (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Accept & Fund Escrow</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 bg-[#18181b] rounded-xl border border-[#27272a]">
                <Users size={24} className="mx-auto text-[#71717a]" />
                <h4 className="text-xs font-semibold text-[#fafafa]">No creator proposals submitted yet</h4>
                <p className="text-[11px] text-[#71717a] max-w-sm mx-auto">
                  This campaign is active in the directory. You can invite verified creators directly or run NefraSense Advisor to scout candidate matches.
                </p>
                <div className="pt-2 flex justify-center space-x-2 flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const c = reviewingCampaign;
                      setReviewingCampaign(null);
                      setAiMatchCampaign(c);
                    }}
                    className="bg-[#e11d48] hover:bg-[#be123c] text-white text-xs cursor-pointer space-x-1"
                  >
                    <Sparkles size={13} />
                    <span>AI Creator Match</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReviewingCampaign(null);
                      if (onNavigate) onNavigate('creators');
                    }}
                    className="border-[#27272a] text-xs cursor-pointer"
                  >
                    <Search size={13} className="mr-1" />
                    <span>Browse Creators</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReviewingCampaign(null);
                      if (onNavigate) onNavigate('advisor');
                    }}
                    className="border-[#27272a] text-xs cursor-pointer"
                  >
                    <MessageSquare size={13} className="mr-1" />
                    <span>NefraSense Strategy</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}

      {/* AI Creator Match Modal for Specific Gig */}
      {aiMatchCampaign && (
        <AICreatorMatchModal
          campaign={aiMatchCampaign}
          creators={creators}
          rateCards={rateCards}
          isOpen={Boolean(aiMatchCampaign)}
          onClose={() => setAiMatchCampaign(null)}
          onOpenChat={onOpenChat}
          onSelectCreator={onSelectCreator}
          onHirePackage={onHirePackage}
        />
      )}
    </div>
  );
}
