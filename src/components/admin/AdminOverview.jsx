import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCents } from '../../lib/utils';
import { ShieldCheck, TrendingUp, AlertTriangle, Users, Sliders, ArrowRight } from 'lucide-react';

export function AdminOverview({
  contracts = [],
  creators = [],
  feePercent = 10,
  onNavigate
}) {
  const totalGMVCents = contracts.reduce((sum, c) => sum + (c.amountCents || 0), 0);
  const releasedContracts = contracts.filter(c => c.state === 'released');
  const feeRevenueCents = releasedContracts.reduce((sum, c) => sum + (c.platformFeeCents || 0), 0);
  const activeContracts = contracts.filter(c => c.state !== 'released' && c.state !== 'refunded');
  const escrowHeldCents = activeContracts.reduce((sum, c) => sum + (c.amountCents || 0), 0);
  const disputedContracts = contracts.filter(c => c.state === 'disputed');

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Platform operations & financial control room
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Real-time Gross Merchandise Value (GMV), platform fee revenue, escrow custody, and dispute resolution.
          </p>
        </div>
        <Badge variant="action">Admin Root</Badge>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Gross Merchandise Value (GMV)</p>
          <p className="text-2xl font-bold text-[#fafafa] tabular-nums mt-1">{formatCents(totalGMVCents)}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Total escrow transaction volume</p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Platform net fee revenue</p>
          <p className="text-2xl font-bold text-[#e11d48] tabular-nums mt-1">{formatCents(feeRevenueCents)}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">At {feePercent}% take-rate on released deals</p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Active escrow in custody</p>
          <p className="text-2xl font-bold text-[#fafafa] tabular-nums mt-1">{formatCents(escrowHeldCents)}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">{activeContracts.length} deals in production</p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] tracking-wider">Open disputes</p>
          <p className="text-2xl font-bold text-[#fafafa] tabular-nums mt-1">{disputedContracts.length}</p>
          <p className="text-xs text-[#a1a1aa] mt-1">Requires admin arbitration</p>
        </Card>
      </div>

      {/* Control Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <Users size={16} />
              <h3 className="text-sm font-semibold text-[#fafafa]">Creator Verification Queue</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Review incoming YouTube creator registrations, inspect Gemini 3-video audits, and approve directory listings.
            </p>
          </div>
          <div className="pt-3 border-t border-[#27272a] mt-4">
            <Button size="sm" variant="outline" className="w-full justify-between" onClick={() => onNavigate('creators')}>
              <span>Open review queue</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <AlertTriangle size={16} />
              <h3 className="text-sm font-semibold text-[#fafafa]">Dispute Arbitration Center</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Review contract timelines and written statements. Arbitrate full payouts, full refunds, or percentage splits.
            </p>
          </div>
          <div className="pt-3 border-t border-[#27272a] mt-4">
            <Button size="sm" variant="outline" className="w-full justify-between" onClick={() => onNavigate('disputes')}>
              <span>Inspect disputes</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#e11d48]">
              <Sliders size={16} />
              <h3 className="text-sm font-semibold text-[#fafafa]">Platform Economic Settings</h3>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-2">
              Configure marketplace take-rate percentage, starting creator credit grants, and AI proposal consumption costs.
            </p>
          </div>
          <div className="pt-3 border-t border-[#27272a] mt-4">
            <Button size="sm" variant="outline" className="w-full justify-between" onClick={() => onNavigate('config')}>
              <span>Configure rules</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
