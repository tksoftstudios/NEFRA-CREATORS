import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { formatCents } from '../../lib/utils';
import { 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Briefcase, 
  MessageSquare, 
  ArrowRight, 
  Wand2, 
  MessageCircle, 
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AICreatorMatchModal } from './AICreatorMatchModal';

export function BrandDashboard({
  campaigns = [],
  contracts = [],
  bids = [],
  creators = [],
  rateCards = [],
  brandCredits = 250,
  onNavigate,
  onOpenChat,
  onSelectCreator,
  onHirePackage
}) {
  const [isCreatorPickerOpen, setIsCreatorPickerOpen] = useState(false);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [aiMatchCampaign, setAiMatchCampaign] = useState(null);

  const activeContracts = contracts.filter(c => c.state !== 'released' && c.state !== 'refunded');
  const totalEscrowHeldCents = activeContracts.reduce((sum, c) => sum + (c.amountCents || 0), 0);

  // Determine the most relevant creator to chat with:
  // 1. Creator who sent the latest proposal/bid
  // 2. Or creator from the latest active contract
  // 3. Or first available creator in the vetted directory
  const relevantCreator = useMemo(() => {
    if (bids.length > 0) {
      const found = creators.find(c => c.id === bids[0].creatorId);
      if (found) return found;
    }
    if (contracts.length > 0) {
      const found = creators.find(c => c.id === contracts[0].creatorId);
      if (found) return found;
    }
    return creators[0] || null;
  }, [bids, contracts, creators]);

  const handleStartChat = (targetCreator) => {
    setIsCreatorPickerOpen(false);
    const creatorToChat = targetCreator || relevantCreator;
    if (creatorToChat && onOpenChat) {
      onOpenChat(creatorToChat);
    } else if (onNavigate) {
      onNavigate('messages');
    }
  };

  const filteredCreators = useMemo(() => {
    if (!creatorSearchQuery.trim()) return creators;
    const q = creatorSearchQuery.toLowerCase();
    return creators.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.handle?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  }, [creators, creatorSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-[#fafafa]">Acme Enterprise Corp</h1>
            <Badge variant="action" className="text-[10px]">Verified brand</Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Enterprise Client Workspace • Developer Infrastructure & Cloud Tools</p>
          <p className="text-xs text-[#71717a] mt-1">Hire vetted YouTube creators with 100% pre-funded escrow milestones.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs">
            <span className="font-bold text-amber-400 tabular-nums">{brandCredits}</span>
            <span className="text-[#a1a1aa]">Credits Remaining</span>
          </div>

          {/* Quick Chat with Relevant Creator Button */}
          <div className="inline-flex rounded-lg shadow-sm">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleStartChat(relevantCreator)} 
              className="border-[#1db954]/40 text-[#1ed760] hover:bg-[#1db954]/10 space-x-1.5 cursor-pointer rounded-r-none"
              title={relevantCreator ? `Chat with ${relevantCreator.name}` : 'Open creator chat'}
            >
              <MessageCircle size={13} />
              <span>Creator Chat{relevantCreator ? ` (${relevantCreator.name.split(' ')[0]})` : ''}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCreatorPickerOpen(true)} 
              className="border-[#1db954]/40 text-[#1ed760] hover:bg-[#1db954]/10 px-2 cursor-pointer rounded-l-none border-l-0"
              title="Select specific creator to chat with"
            >
              <ChevronDown size={13} />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={() => onNavigate('content-creator')} className="border-[#e11d48]/40 text-[#e11d48] hover:bg-[#e11d48]/10 space-x-1 cursor-pointer">
            <Wand2 size={13} />
            <span>AI Content Creator</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('creators')}>
            Find creators
          </Button>
          <Button size="sm" onClick={() => onNavigate('new-campaign')}>
            New campaign (AI)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Active campaigns</p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">{campaigns.length}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Accepting creator bids</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Total escrow in vault</p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">{formatCents(totalEscrowHeldCents)}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Pre-funded & locked</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Incoming proposals</p>
          <p className="text-xl font-bold text-[#e11d48] tabular-nums mt-1">{bids.length} bids</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Ready for review</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Deals in production</p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">{activeContracts.length}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Drafts being filmed</p>
        </Card>
      </div>

      {/* Quick Launch & Advisor Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <PlusCircle size={18} />
              <h3 className="text-sm font-semibold text-[#fafafa]">AI Campaign Job Card Builder</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Transform natural language requirements into structured campaign briefs with budget and deliverables in seconds using NEFRA AI.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#27272a]">
            <Button size="sm" className="w-full justify-between" onClick={() => onNavigate('new-campaign')}>
              <span>Build campaign with AI (15 credits • {brandCredits} remaining)</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <img src="/nefrasense.png" alt="NefraSense Logo" className="w-5 h-5 object-contain" />
              <h3 className="text-sm font-semibold text-[#fafafa]">NefraSense Strategic Advisor</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Ask your conversational AI strategist how to optimize budget splits (Shorts vs Dedicated), benchmark creator pricing, or compare candidates.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#27272a]">
            <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => onNavigate('advisor')}>
              <span>Open NefraSense chat (10 credits • {brandCredits} remaining)</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Incoming Creator Proposals & Direct Chat */}
      {bids.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
                Incoming Creator Proposals
              </h2>
              <Badge className="bg-[#e11d48]/15 text-[#e11d48] border-[#e11d48]/30 text-[10px]">
                {bids.length} Awaiting Chat
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('campaigns')}>
              Manage all
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bids.slice(0, 2).map((bid) => {
              const creator = creators.find(c => c.id === bid.creatorId) || {
                id: bid.creatorId,
                name: bid.creatorName || 'Creator',
                handle: bid.creatorHandle || '@creator',
                avatar: bid.creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              };

              return (
                <div key={bid.id} className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={creator.avatar} 
                        alt={creator.name} 
                        className="w-10 h-10 rounded-full object-cover border border-[#27272a]"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-[#fafafa]">{creator.name}</h4>
                        <p className="text-xs text-[#71717a]">{creator.handle}</p>
                      </div>
                    </div>
                    <Badge className="bg-[#10b981]/15 text-[#10b981] border-none text-[10px]">
                      {bid.amountCents ? formatCents(bid.amountCents) : 'Proposal'}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#a1a1aa] line-clamp-2">
                    {bid.pitch || bid.description || `Submitted proposal for your active campaign. Ready to discuss video deliverables.`}
                  </p>

                  <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                    <span className="text-[11px] text-[#71717a]">Turnaround: {bid.turnaroundDays || 7} days</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleStartChat(creator)}
                      className="space-x-1.5 bg-[#1db954] hover:bg-[#1aa34a] text-black font-semibold cursor-pointer"
                    >
                      <MessageCircle size={13} />
                      <span>Chat & Offer Gig</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campaigns Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase font-semibold text-[#a1a1aa] tracking-wider">
            Your posted campaigns
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('campaigns')}>
            View all
          </Button>
        </div>

        <div className="space-y-3">
          {campaigns.slice(0, 3).map(camp => (
            <div key={camp.id} className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-[#fafafa]">{camp.title}</h4>
                  <Badge variant="outline">{camp.modality.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-0.5">{camp.category} • Budget: {formatCents(camp.budgetCents)}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#71717a] hidden sm:inline">{camp.bidsCount || 0} bids received</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setAiMatchCampaign(camp)}
                  className="border-[#27272a] text-xs text-[#fafafa] hover:border-[#e11d48] hover:bg-[#e11d48]/10 cursor-pointer space-x-1"
                  title="Run NEFRA Matchmaker for this gig"
                >
                  <Sparkles size={12} className="text-[#e11d48]" />
                  <span>AI Match</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNavigate('campaigns')}>
                  Review proposals
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Select Creator to Chat Dialog */}
      {isCreatorPickerOpen && (
        <Dialog
          isOpen={isCreatorPickerOpen}
          onClose={() => setIsCreatorPickerOpen(false)}
          title="Start Conversation with Creator"
          description="Choose a vetted creator to start an instant negotiation thread, submit custom gig briefs, and lock escrow."
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[#71717a]" />
              <input
                type="text"
                value={creatorSearchQuery}
                onChange={(e) => setCreatorSearchQuery(e.target.value)}
                placeholder="Search by name, handle, or category..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#1db954]"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#27272a] pr-1">
              {filteredCreators.map(creator => {
                const isTopMatch = relevantCreator && creator.id === relevantCreator.id;
                return (
                  <div 
                    key={creator.id}
                    onClick={() => handleStartChat(creator)}
                    className="py-3 px-2 flex items-center justify-between hover:bg-[#18181b] rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img 
                        src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"} 
                        alt={creator.name} 
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#27272a]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <p className="text-xs font-semibold text-[#fafafa] truncate">{creator.name}</p>
                          {isTopMatch && (
                            <Badge className="bg-[#1db954]/20 text-[#1ed760] text-[9px] py-0 px-1 border-none">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-[#71717a] truncate">{creator.handle} • {creator.category}</p>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" className="text-xs text-[#1ed760] hover:text-white hover:bg-[#1db954]/20 shrink-0">
                      Chat <ArrowRight size={12} className="ml-1 inline" />
                    </Button>
                  </div>
                );
              })}

              {filteredCreators.length === 0 && (
                <div className="py-6 text-center text-xs text-[#71717a]">
                  No creators found matching &quot;{creatorSearchQuery}&quot;
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#27272a] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setIsCreatorPickerOpen(false)}>
                Cancel
              </Button>
            </div>
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

