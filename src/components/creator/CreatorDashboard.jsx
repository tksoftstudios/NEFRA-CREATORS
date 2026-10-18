import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCents } from '../../lib/utils';
import { ShieldCheck, Coins, Briefcase, Tag, TrendingUp, Play, ArrowRight } from 'lucide-react';

export function CreatorDashboard({
  creator,
  contracts = [],
  rateCards = [],
  campaigns = [],
  credits,
  onNavigate
}) {
  const activeContracts = contracts.filter(c => c.state !== 'released' && c.state !== 'refunded');
  const totalLockedCents = activeContracts.reduce((sum, c) => sum + (c.amountCents || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-14 h-14 rounded-full object-cover border border-[#27272a]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-[#fafafa]">{creator.name}</h1>
              <Badge variant="action" className="text-[10px]">Active</Badge>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-0.5">{creator.handle} • {creator.category} • {creator.residence}</p>
            <p className="text-xs text-[#71717a] mt-1">
              {creator.youtubeConnected && creator.youtube
                ? `${creator.subscribersFormatted || creator.youtube.subscribersFormatted} verified subscribers on YouTube`
                : 'No YouTube channel connected (Verify via Connectors tab)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => onNavigate('connectors')}>
            Connectors
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('rate-cards')}>
            Manage rate cards
          </Button>
          <Button size="sm" onClick={() => onNavigate('opportunities')}>
            Browse campaigns
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">
            Escrow locked in vault
          </p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">
            {formatCents(totalLockedCents)}
          </p>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Across {activeContracts.length} active deals
          </p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">
            Active rate cards
          </p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">
            {rateCards.length} packages
          </p>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Published to public directory
          </p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">
            AI creator score
          </p>
          <p className="text-xl font-bold text-[#e11d48] tabular-nums mt-1">
            {creator.aiScore}/100
          </p>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Multimodal 3-video audit rating
          </p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">
            AI credits balance
          </p>
          <p className="text-xl font-bold text-[#fafafa] tabular-nums mt-1">
            {credits} credits
          </p>
          <p className="text-xs text-[#a1a1aa] mt-1">
            For 1-click AI proposal pitches
          </p>
        </Card>
      </div>

      {/* Active Escrow Contracts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
            Active escrow contracts in production
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('contracts')}>
            View all contracts
          </Button>
        </div>

        {activeContracts.length === 0 ? (
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-8 text-center text-[#71717a] text-xs">
            No active contracts currently in progress. Apply for campaigns to secure pre-funded deals.
          </div>
        ) : (
          <div className="space-y-3">
            {activeContracts.map(contract => (
              <div
                key={contract.id}
                className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-[#fafafa]">{contract.campaignTitle}</h3>
                    <Badge variant={contract.state === 'draft_review' ? 'action' : 'outline'}>
                      {contract.state.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    Brand: <strong>{contract.brandName}</strong> • {contract.packageType}
                  </p>
                  <p className="text-[11px] text-[#71717a] mt-1">
                    Deadline: {contract.deadline} • {contract.revisionsLeft} revisions left
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#fafafa] tabular-nums">
                      {formatCents(contract.netCreatorCents)}
                    </p>
                    <p className="text-[10px] text-[#71717a]">Net creator payout</p>
                  </div>
                  <Button size="sm" onClick={() => onNavigate('contracts')}>
                    Manage deliverable
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
