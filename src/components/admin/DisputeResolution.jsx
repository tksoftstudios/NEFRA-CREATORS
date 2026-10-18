import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Textarea, Input, Select } from '../ui/Input';
import { formatCents } from '../../lib/utils';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DisputeResolution({
  contracts = [],
  onResolveDispute
}) {
  const disputedContracts = contracts.filter(c => c.state === 'disputed');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [outcome, setOutcome] = useState('release'); // release, refund, split
  const [splitPercentCreator, setSplitPercentCreator] = useState('50');
  const [adminReason, setAdminReason] = useState('');

  const handleOpenArbitration = (contract) => {
    setSelectedDispute(contract);
    setOutcome('release');
    setSplitPercentCreator('50');
    setAdminReason('');
  };

  const handleExecuteArbitration = (e) => {
    e.preventDefault();
    if (!selectedDispute || !adminReason.trim()) return;

    onResolveDispute({
      contractId: selectedDispute.id,
      outcome,
      splitPercentCreator: parseInt(splitPercentCreator, 10) || 50,
      adminReason
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });

    setSelectedDispute(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Dispute queue & arbitration center
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Arbitrate frozen escrow contracts. Admin decisions write immutable ledger records and adjust balances.
          </p>
        </div>
        <Badge variant={disputedContracts.length > 0 ? "action" : "outline"}>
          {disputedContracts.length} open disputes
        </Badge>
      </div>

      {disputedContracts.length === 0 ? (
        <Card className="text-center py-12 text-[#71717a] text-xs">
          <ShieldCheck size={28} className="mx-auto text-[#71717a] mb-2" />
          <p className="text-sm font-semibold text-[#fafafa]">Zero disputes active</p>
          <p className="mt-1">All contracts are progressing smoothly through standard production and review stages.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputedContracts.map(contract => (
            <Card key={contract.id} className="border-[#e11d48]/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-[#e11d48]" />
                  <h3 className="text-sm font-semibold text-[#fafafa]">{contract.campaignTitle}</h3>
                  <Badge variant="action">FROZEN IN DISPUTE</Badge>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#71717a]">Disputed escrow hold:</span>
                  <span className="text-sm font-bold text-[#fafafa] tabular-nums ml-2">{formatCents(contract.amountCents)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a]">
                  <p className="text-[10px] uppercase font-semibold text-[#71717a]">Brand Statement (Acme Corp)</p>
                  <p className="text-[#fafafa] mt-1">
                    "The creator missed the agreed 7-day turnaround deadline and the uploaded unlisted draft omitted the required 10-second CTA segment."
                  </p>
                </div>
                <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a]">
                  <p className="text-[10px] uppercase font-semibold text-[#71717a]">Creator Statement ({contract.creatorName})</p>
                  <p className="text-[#fafafa] mt-1">
                    "I submitted the 4K draft with the CTA included in the first 45 seconds of the video, but the brand requested 4 additional rounds of out-of-scope edits."
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#71717a]">
                  Both parties have submitted evidence. Admin determination required.
                </span>
                <Button size="sm" onClick={() => handleOpenArbitration(contract)}>
                  Arbitrate dispute
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Arbitration Modal */}
      {selectedDispute && (
        <Dialog
          isOpen={Boolean(selectedDispute)}
          onClose={() => setSelectedDispute(null)}
          title="Arbitrate contract dispute"
          description={`Contract: ${selectedDispute.campaignTitle} • Total Escrow: ${formatCents(selectedDispute.amountCents)}`}
        >
          <form onSubmit={handleExecuteArbitration} className="space-y-4">
            <Select
              label="Arbitration Outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              options={[
                { value: 'release', label: 'Release full net payout to creator' },
                { value: 'refund', label: 'Refund full deposit back to brand' },
                { value: 'split', label: 'Split escrow by custom percentage' }
              ]}
            />

            {outcome === 'split' && (
              <Input
                label="Creator Share Percentage (%)"
                type="number"
                min="10"
                max="90"
                value={splitPercentCreator}
                onChange={(e) => setSplitPercentCreator(e.target.value)}
                placeholder="50"
                required
              />
            )}

            <Textarea
              label="Mandatory Written Justification (Logged to immutable audit log)"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder="Explain the factual basis for this determination based on review of footage and messages..."
              rows={4}
              required
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-[#27272a]">
              <Button variant="outline" type="button" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Execute arbitration & update ledger
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
