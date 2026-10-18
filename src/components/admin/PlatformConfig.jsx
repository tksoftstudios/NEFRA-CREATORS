import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PlatformConfig({
  config,
  onUpdateConfig
}) {
  const [feePercent, setFeePercent] = useState(config.feePercent.toString());
  const [startingCredits, setStartingCredits] = useState(config.startingCredits.toString());
  const [proposalCost, setProposalCost] = useState(config.proposalCostCredits.toString());
  const [minSubscribers, setMinSubscribers] = useState(config.minSubscribers.toString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateConfig({
      feePercent: Math.min(15, Math.max(10, parseInt(feePercent, 10) || 10)),
      startingCredits: parseInt(startingCredits, 10) || 50,
      proposalCostCredits: parseInt(proposalCost, 10) || 5,
      minSubscribers: parseInt(minSubscribers, 10) || 1000
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Platform economic configuration
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Configure marketplace commission rates, starting allowances, and creator eligibility rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Card className="space-y-4">
          <Input
            label="Platform Take-Rate Percentage (10% to 15%)"
            type="number"
            min="10"
            max="15"
            value={feePercent}
            onChange={(e) => setFeePercent(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Starting Creator Credits Allowance"
              type="number"
              min="10"
              value={startingCredits}
              onChange={(e) => setStartingCredits(e.target.value)}
              required
            />
            <Input
              label="Credits Per AI Proposal Bid"
              type="number"
              min="1"
              value={proposalCost}
              onChange={(e) => setProposalCost(e.target.value)}
              required
            />
          </div>

          <Input
            label="Minimum YouTube Subscribers for Directory Approval"
            type="number"
            min="100"
            value={minSubscribers}
            onChange={(e) => setMinSubscribers(e.target.value)}
            required
          />

          <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
            {isSaved ? (
              <span className="text-xs text-[#fafafa] flex items-center gap-1 font-semibold">
                <CheckCircle2 size={14} className="text-[#e11d48]" /> Configuration saved & logged to audit ledger
              </span>
            ) : (
              <span className="text-xs text-[#71717a]">
                New rates apply immediately to newly initialized contracts.
              </span>
            )}

            <Button type="submit" size="sm" className="space-x-1.5">
              <Save size={14} />
              <span>Save settings</span>
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
