import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { formatCents } from '../../lib/utils';
import { calculateContractFees, calculateMilestones } from '../../packages/escrow/feeCalculator';
import { draftProposalWithGemini } from '../../packages/ai/geminiClient';
import { Sparkles } from 'lucide-react';

export function BidModal({
  campaign,
  creator,
  isOpen,
  onClose,
  credits,
  onDeductCredits,
  onSubmitBid
}) {
  const [bidDollars, setBidDollars] = useState('2500');
  const [turnaroundDays, setTurnaroundDays] = useState('7');
  const [pitch, setPitch] = useState('');
  const [isDraftingAI, setIsDraftingAI] = useState(false);

  useEffect(() => {
    if (campaign?.budgetCents) {
      setBidDollars((campaign.budgetCents / 100).toString());
    }
  }, [campaign]);

  if (!campaign) return null;

  const currentBidCents = Math.round((parseFloat(bidDollars) || 0) * 100);
  const fees = calculateContractFees(currentBidCents, 10);
  const milestones = calculateMilestones(currentBidCents);

  const handleDraftWithAI = async () => {
    if (credits < 5) {
      alert(`Insufficient credits (${credits} remaining). You need 5 credits for AI proposal drafting. Please refill your wallet.`);
      return;
    }

    setIsDraftingAI(true);
    try {
      const proposal = await draftProposalWithGemini(creator, campaign);
      const generatedPitch = `${proposal.hook}\n\nCreative Angle:\n${proposal.concept}\n\nTurnaround Commitment:\n${proposal.deliveryCommitment}`;
      setPitch(generatedPitch);
      onDeductCredits(5);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDraftingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitBid({
      campaignId: campaign.id,
      creatorId: creator.id,
      creatorName: creator.name,
      proposedAmountCents: currentBidCents,
      turnaroundDays: parseInt(turnaroundDays, 10) || 7,
      pitch,
      milestones,
      status: 'pending_brand_review',
      submittedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit proposal: ${campaign.title}`}
      description={`Brand: ${campaign.brandName} • Budget Cap: ${formatCents(campaign.budgetCents)} • Balance: ${credits} credits remaining`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Your Proposed Price (USD $)"
            type="number"
            min="50"
            value={bidDollars}
            onChange={(e) => setBidDollars(e.target.value)}
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
        </div>

        {/* Milestone Split */}
        <div className="bg-[#18181b] p-3 rounded-lg border border-[#27272a] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Escrow Milestone Payout Split (30 / 50 / 20)
            </span>
            <span className="text-[#fafafa] font-bold tabular-nums">
              Net: {formatCents(fees.netCreatorCents)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {milestones.map((m) => (
              <div key={m.index} className="bg-[#09090b] p-2 rounded border border-[#27272a]">
                <p className="text-[10px] text-[#71717a]">{m.title}</p>
                <p className="font-bold text-[#fafafa] tabular-nums mt-0.5">{formatCents(m.amountCents)}</p>
                <span className="text-[9px] text-[#a1a1aa]">{m.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal / Pitch with Gemini Trigger */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#a1a1aa]">Custom Pitch & Video Concept</label>
            <button
              type="button"
              onClick={handleDraftWithAI}
              disabled={isDraftingAI}
              className="text-xs text-[#3b82f6] hover:text-[#2563eb] font-medium flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              title={`Draft proposal with AI (5 credits • ${credits} remaining)`}
            >
              <Sparkles size={12} />
              <span>{isDraftingAI ? "Drafting with AI..." : `Draft with AI (5 credits • ${credits} remaining)`}</span>
            </button>
          </div>

          <Textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={5}
            placeholder="Explain why your audience fits this brief, your creative video hook, and your delivery commitment..."
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#27272a]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Submit proposal
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
