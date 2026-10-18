import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Input, Textarea, Select } from '../ui/Input';
import { formatCurrency } from '../../services/currencyService';
import { calculateDynamicRateCards } from '../../packages/pricing/rateCardEngine';
import { AIScoreJustificationModal } from './AIScoreJustificationModal';
import { calculateContractFees } from '../../packages/escrow/feeCalculator';
import { Plus, CheckCircle2, Trash2, Sparkles, Coins, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RateCardsManager({
  rateCards = [],
  setRateCards,
  feePercent = 10,
  creator = {},
  preferredCurrency = 'USD'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [aiNotice, setAiNotice] = useState(null);
  const [isJustificationOpen, setIsJustificationOpen] = useState(false);

  const pricing = creator?.audit?.pricingIntelligence;

  const handleApplyAiPackages = () => {
    const dynamicPackages = calculateDynamicRateCards(creator);
    setRateCards(dynamicPackages);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 }
    });
    setAiNotice(`Dynamic rate cards calibrated to your genuine reach (${creator.subscribersFormatted || '0'} subscribers) and ${creator.aiScore || 92}/100 AI Score!`);
    setTimeout(() => setAiNotice(null), 6000);
  };

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('integration');
  const [priceDollars, setPriceDollars] = useState('2400');
  const [turnaroundDays, setTurnaroundDays] = useState('7');
  const [revisions, setRevisions] = useState('2');
  const [modality, setModality] = useState('online');
  const [description, setDescription] = useState('');
  const [deliverablesText, setDeliverablesText] = useState('');

  const currentPriceCents = Math.round((parseFloat(priceDollars) || 0) * 100);
  const feeCalc = calculateContractFees(currentPriceCents, feePercent);

  const handleOpenAdd = () => {
    setEditingCard(null);
    setTitle('');
    setType('integration');
    setPriceDollars('1500');
    setTurnaroundDays('7');
    setRevisions('2');
    setModality('online');
    setDescription('Sponsored content package with high-retention production.');
    setDeliverablesText('1x 60s Integration\nPinned link in description\nSocial mentions');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const deliverables = deliverablesText.split('\n').filter(d => d.trim().length > 0);

    const newPackage = {
      id: editingCard?.id || `pkg_${Date.now()}`,
      creatorId: 'creator_01',
      title,
      type,
      priceCents: currentPriceCents,
      turnaroundDays: parseInt(turnaroundDays, 10) || 7,
      revisions: parseInt(revisions, 10) || 2,
      modality,
      badge: 'Active Package',
      description,
      deliverables,
      status: 'active'
    };

    if (editingCard) {
      setRateCards(rateCards.map(c => c.id === editingCard.id ? newPackage : c));
    } else {
      setRateCards([...rateCards, newPackage]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setRateCards(rateCards.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Creator rate cards & digital gig packages
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Configure standardized digital packages with fixed deliverables and turnaround times. Brands can order directly into escrow.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="space-x-1.5 shrink-0">
          <Plus size={14} />
          <span>Add package</span>
        </Button>
      </div>

      {/* AI Notice */}
      {aiNotice && (
        <div className="p-3 bg-[#10b981]/15 border border-[#10b981]/30 rounded-lg text-xs text-[#10b981] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} />
            <span>{aiNotice}</span>
          </div>
          <button onClick={() => setAiNotice(null)} className="text-[11px] text-[#71717a] hover:text-[#a1a1aa]">Dismiss</button>
        </div>
      )}

      {/* AI Pricing Intelligence Card */}
      {pricing && (
        <Card className="p-4 border-[#e11d48]/30 bg-[#e11d48]/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-[#e11d48]/15 text-[#e11d48]">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fafafa]">
                  NEFRA AI Pricing Benchmark Intelligence
                </h3>
                <p className="text-[11px] text-[#a1a1aa]">
                  Calculated from your channel retention curve, niche ({creator.category || 'Education & Science'}), and market demand.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsJustificationOpen(true)}
                className="text-xs text-[#a1a1aa] hover:text-white flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#27272a] hover:bg-[#18181b] transition-colors cursor-pointer"
              >
                <HelpCircle size={13} className="text-[#3b82f6]" />
                <span>Explain AI Score & Pricing</span>
              </button>

              <Button
                onClick={handleApplyAiPackages}
                size="sm"
                className="bg-[#e11d48] hover:bg-[#be123c] text-white space-x-1.5 text-xs shrink-0 shadow-sm cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Auto-Apply AI Packages</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">60s Integration</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{pricing.recommendedIntegrationRate || '$2,200 - $2,800'}</span>
              <span className="text-[10px] text-[#10b981] mt-0.5 block">Recommended Anchor</span>
            </div>
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Shorts / Reels</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{pricing.recommendedShortsRate || '$850 - $1,100'}</span>
              <span className="text-[10px] text-[#a1a1aa] mt-0.5 block">High Viral Conversion</span>
            </div>
            <div className="p-2.5 rounded bg-[#18181b]/70 border border-[#27272a]">
              <span className="text-[#71717a] text-[10px] uppercase font-semibold block">Dedicated 4K</span>
              <span className="text-sm font-bold text-[#fafafa] mt-0.5 block">{pricing.recommendedDedicatedRate || '$5,500 - $6,800'}</span>
              <span className="text-[10px] text-[#f59e0b] mt-0.5 block">{pricing.marketDemand || 'Very High Demand'}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rateCards.map((pkg) => {
          const fees = calculateContractFees(pkg.priceCents, feePercent);
          return (
            <Card key={pkg.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="action">{pkg.type.toUpperCase()}</Badge>
                  <span className="text-xs text-[#71717a]">{pkg.turnaroundDays} days delivery</span>
                </div>

                <h3 className="text-base font-semibold text-[#fafafa] mt-3">{pkg.title}</h3>
                {pkg.reachBasis && (
                  <p className="text-[11px] text-[#3b82f6] font-medium mt-0.5">
                    {pkg.reachBasis}
                  </p>
                )}
                <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">{pkg.description}</p>

                {/* Checklist */}
                <div className="space-y-1.5 mt-4 pt-3 border-t border-[#27272a]">
                  <p className="text-[10px] uppercase font-semibold text-[#71717a]">Deliverables</p>
                  {(pkg.deliverables || []).map((d, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-[#a1a1aa]">
                      <CheckCircle2 size={12} className="text-[#e11d48] shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Fee Breakdown */}
              <div className="mt-5 pt-3 border-t border-[#27272a] space-y-2">
                <div className="flex justify-between items-baseline text-xs text-[#71717a]">
                  <span>Brand client price:</span>
                  <span className="font-semibold text-[#fafafa] tabular-nums">{formatCurrency(pkg.priceCents, preferredCurrency)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-[#71717a]">
                  <span>Platform escrow fee ({feePercent}%):</span>
                  <span className="text-[#a1a1aa] tabular-nums">-{formatCurrency(fees.platformFeeCents, preferredCurrency)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-[#e11d48] font-bold pt-1 border-t border-[#18181b]">
                  <span>Your net payout:</span>
                  <span className="text-sm tabular-nums">{formatCurrency(fees.netCreatorCents, preferredCurrency)}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="text-xs text-[#71717a] hover:text-[#e11d48] transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Package Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCard ? "Edit rate card package" : "Create new rate card package"}
        description="Configure deliverable specifications, turnaround days, and pricing."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Package Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Sponsored 60s Mid-Roll Integration"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Format"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'shorts', label: 'YouTube Shorts (60s)' },
                { value: 'integration', label: 'Mid-Roll Integration' },
                { value: 'dedicated', label: 'Dedicated Showcase' },
                { value: 'custom', label: 'Custom Deliverable' }
              ]}
            />
            <Select
              label="Work Modality"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              options={[
                { value: 'online', label: 'Online / Remote' },
                { value: 'hybrid', label: 'Hybrid / Hardware' },
                { value: 'physical', label: 'Physical On-Site' }
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Brand Price (USD $)"
              type="number"
              min="50"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              required
            />
            <Input
              label="Turnaround (Days)"
              type="number"
              min="1"
              value={turnaroundDays}
              onChange={(e) => setTurnaroundDays(e.target.value)}
              required
            />
            <Input
              label="Revisions Included"
              type="number"
              min="0"
              value={revisions}
              onChange={(e) => setRevisions(e.target.value)}
              required
            />
          </div>

          {/* Live Fee Calculator Preview */}
          <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] space-y-1 text-xs">
            <div className="flex justify-between text-[#a1a1aa]">
              <span>Brand Price:</span>
              <span className="font-semibold text-[#fafafa] tabular-nums">{formatCurrency(currentPriceCents, preferredCurrency)}</span>
            </div>
            <div className="flex justify-between text-[#71717a]">
              <span>Platform Take-Rate ({feePercent}%):</span>
              <span className="tabular-nums">-{formatCurrency(feeCalc.platformFeeCents, preferredCurrency)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#fafafa] pt-1 border-t border-[#27272a]">
              <span>Net Creator Payout:</span>
              <span className="text-[#e11d48] tabular-nums">{formatCurrency(feeCalc.netCreatorCents, preferredCurrency)}</span>
            </div>
          </div>

          <Textarea
            label="Package Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <Textarea
            label="Deliverable Checklist (One item per line)"
            value={deliverablesText}
            onChange={(e) => setDeliverablesText(e.target.value)}
            rows={3}
            placeholder="1x 60s Integration&#10;Pinned comment with link&#10;2 rounds of script alignment"
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-[#27272a]">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save and publish
            </Button>
          </div>
        </form>
      </Dialog>

      <AIScoreJustificationModal
        isOpen={isJustificationOpen}
        onClose={() => setIsJustificationOpen(false)}
        creator={creator}
        audit={creator.audit}
      />
    </div>
  );
}
