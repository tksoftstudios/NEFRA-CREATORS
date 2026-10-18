import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Textarea } from '../ui/Input';
import { formatCents } from '../../lib/utils';
import { Play, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BrandContracts({
  contracts = [],
  onTransitionContract,
  onOpenDispute
}) {
  const [revisionContract, setRevisionContract] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  const handleApprove = (contractId) => {
    onTransitionContract(contractId, 'approved', {
      actor: 'brand',
      reason: 'Brand client approved video deliverable'
    });

    // Auto-advance to released
    setTimeout(() => {
      onTransitionContract(contractId, 'released', {
        actor: 'system',
        reason: 'Escrow milestone payment released to creator wallet'
      });
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });
    }, 400);
  };

  const handleRequestRevision = (e) => {
    e.preventDefault();
    if (!revisionContract) return;

    onTransitionContract(revisionContract.id, 'revision_requested', {
      actor: 'brand',
      reason: `Revision requested: ${revisionNotes}`
    });

    setRevisionContract(null);
    setRevisionNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
          Escrow vaults & deliverable review
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-1">
          Review unlisted video drafts, sign off on completed deliverables, or request contract revisions.
        </p>
      </div>

      <div className="space-y-6">
        {contracts.map(contract => {
          const isDisputed = contract.state === 'disputed';
          const isReviewReady = contract.state === 'draft_review';

          return (
            <Card key={contract.id} className="space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-[#fafafa]">{contract.campaignTitle}</h3>
                    <Badge variant={contract.state === 'released' ? 'action' : 'outline'}>
                      {contract.state.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1">
                    Creator: <strong>{contract.creatorName}</strong> • {contract.packageType} • Contract ID: {contract.id}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#71717a] block">Escrow hold</span>
                  <span className="text-base font-bold text-[#fafafa] tabular-nums">{formatCents(contract.amountCents)}</span>
                </div>
              </div>

              {/* Deliverable Review Area */}
              <div className="p-4 bg-[#18181b] rounded-lg border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#fafafa]">Submitted Video Draft</p>
                  {contract.deliverableUrl ? (
                    <div className="mt-1 flex items-center space-x-2">
                      <a
                        href={contract.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#e11d48] hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <Play size={12} /> {contract.deliverableUrl}
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-[#71717a] mt-0.5">Creator is currently filming content.</p>
                  )}
                  <p className="text-[11px] text-[#71717a] mt-1">
                    {contract.revisionsLeft} revisions remaining on this contract.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {isReviewReady && (
                    <>
                      {contract.revisionsLeft > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRevisionContract(contract)}
                        >
                          Request revision
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleApprove(contract.id)}
                      >
                        Approve & release payout
                      </Button>
                    </>
                  )}

                  {contract.state === 'released' && (
                    <Badge variant="action" className="text-xs py-1 px-3">
                      <CheckCircle2 size={12} className="mr-1 inline" /> Completed & Released
                    </Badge>
                  )}

                  {!isDisputed && contract.state !== 'released' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#71717a] hover:text-[#e11d48]"
                      onClick={() => onOpenDispute(contract)}
                    >
                      Open dispute
                    </Button>
                  )}
                </div>
              </div>

              {/* Milestones list */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                {(contract.milestones || []).map((m) => (
                  <div key={m.index} className="bg-[#09090b] p-2 rounded border border-[#27272a]">
                    <p className="text-[10px] text-[#71717a]">{m.title}</p>
                    <p className="font-semibold text-[#fafafa] tabular-nums mt-0.5">{formatCents(m.amountCents)}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revision Request Dialog */}
      {revisionContract && (
        <Dialog
          isOpen={Boolean(revisionContract)}
          onClose={() => setRevisionContract(null)}
          title="Request deliverable revision"
          description={`Contract: ${revisionContract.campaignTitle} • ${revisionContract.revisionsLeft} revisions left`}
        >
          <form onSubmit={handleRequestRevision} className="space-y-4">
            <Textarea
              label="Revision Feedback & Timecode Edits"
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g. Please increase volume of background music at 02:30 and verify that the promo code banner is visible for at least 5 seconds..."
              rows={4}
              required
            />
            <div className="flex justify-end space-x-2 pt-2 border-t border-[#27272a]">
              <Button variant="outline" type="button" onClick={() => setRevisionContract(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit revision request
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
