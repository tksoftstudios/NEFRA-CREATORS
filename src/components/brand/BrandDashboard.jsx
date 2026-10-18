import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCents } from '../../lib/utils';
import { PlusCircle, Search, ShieldCheck, Briefcase, MessageSquare, ArrowRight, Wand2 } from 'lucide-react';

export function BrandDashboard({
  campaigns = [],
  contracts = [],
  bids = [],
  onNavigate
}) {
  const activeContracts = contracts.filter(c => c.state !== 'released' && c.state !== 'refunded');
  const totalEscrowHeldCents = activeContracts.reduce((sum, c) => sum + (c.amountCents || 0), 0);

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
              Transform natural language requirements into structured campaign briefs with budget and deliverables in seconds using Gemini Flash.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#27272a]">
            <Button size="sm" className="w-full justify-between" onClick={() => onNavigate('new-campaign')}>
              <span>Build campaign with Gemini</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <MessageSquare size={18} />
              <h3 className="text-sm font-semibold text-[#fafafa]">NefraSense Strategic Advisor</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Ask your conversational AI strategist how to optimize budget splits (Shorts vs Dedicated), benchmark creator pricing, or compare candidates.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-[#27272a]">
            <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => onNavigate('advisor')}>
              <span>Open NefraSense chat</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

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

              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#71717a]">{camp.bidsCount || 0} bids received</span>
                <Button variant="outline" size="sm" onClick={() => onNavigate('campaigns')}>
                  Review proposals
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
