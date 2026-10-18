import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DeliverableModal } from './DeliverableModal';
import { formatCents, formatDate } from '../../lib/utils';
import { Play, Upload, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export function CreatorContracts({
  contracts = [],
  onTransitionContract,
  onOpenDispute
}) {
  const [selectedContractForUpload, setSelectedContractForUpload] = useState(null);

  const getStepIndex = (state) => {
    switch (state) {
      case 'funded': return 1;
      case 'in_production': return 2;
      case 'draft_review': return 3;
      case 'approved': return 4;
      case 'released': return 5;
      case 'disputed': return -1;
      default: return 0;
    }
  };

  const handleStartProduction = (contractId) => {
    onTransitionContract(contractId, 'in_production', {
      actor: 'creator',
      reason: 'Creator accepted brief and started video production'
    });
  };

  const handleSubmitDeliverable = (contractId, data) => {
    onTransitionContract(contractId, 'draft_review', {
      actor: 'creator',
      deliverableUrl: data.deliverableUrl,
      reason: data.reason
    });
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
          Escrow contracts & milestone tracker
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-1">
          Every deal is 100% pre-funded before work begins. Payments release automatically upon approved deliverables.
        </p>
      </div>

      <div className="space-y-6">
        {contracts.map((contract) => {
          const stepIndex = getStepIndex(contract.state);
          const isDisputed = contract.state === 'disputed';

          return (
            <Card key={contract.id} className="space-y-5">
              {/* Top Row: Info & State Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-[#fafafa]">{contract.campaignTitle}</h3>
                    <Badge variant={isDisputed ? 'action' : (contract.state === 'released' ? 'action' : 'outline')}>
                      {contract.state.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-1">
                    Brand: <strong>{contract.brandName}</strong> • Package: {contract.packageType} • Contract ID: {contract.id}
                  </p>
                </div>

                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <span className="text-xs text-[#71717a] block">Gross escrow</span>
                    <span className="text-sm font-semibold text-[#fafafa] tabular-nums">{formatCents(contract.amountCents)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#71717a] block">Your net payout</span>
                    <span className="text-base font-bold text-[#e11d48] tabular-nums">{formatCents(contract.netCreatorCents)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {[
                  { step: 1, label: "1. Pre-funded", desc: "Deposit locked" },
                  { step: 2, label: "2. Production", desc: "Creating content" },
                  { step: 3, label: "3. Draft review", desc: "Brand inspection" },
                  { step: 4, label: "4. Approved", desc: "Deliverable signed off" },
                  { step: 5, label: "5. Released", desc: "Funds in wallet" }
                ].map((s) => {
                  const isDone = stepIndex >= s.step;
                  const isCurrent = stepIndex === s.step;
                  return (
                    <div
                      key={s.step}
                      className={`p-2 rounded border transition-colors ${
                        isCurrent
                          ? "bg-[#e11d48]/15 border-[#e11d48] text-[#fafafa]"
                          : isDone
                          ? "bg-[#18181b] border-[#27272a] text-[#a1a1aa]"
                          : "bg-transparent border-[#27272a]/50 text-[#52525b]"
                      }`}
                    >
                      <p className="font-semibold text-[11px]">{s.label}</p>
                      <p className="text-[9px] mt-0.5">{s.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Deliverable Status & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  {contract.deliverableUrl ? (
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-[#a1a1aa]">Submitted Draft:</span>
                      <a
                        href={contract.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#e11d48] hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <Play size={12} /> {contract.deliverableUrl}
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-[#71717a]">
                      No deliverable uploaded yet. {contract.revisionsLeft} revisions remaining.
                    </p>
                  )}
                </div>

                {/* Creator Workflow Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {contract.state === 'funded' && (
                    <Button size="sm" onClick={() => handleStartProduction(contract.id)}>
                      Start production
                    </Button>
                  )}

                  {(contract.state === 'in_production' || contract.state === 'revision_requested') && (
                    <Button
                      size="sm"
                      className="space-x-1.5"
                      onClick={() => setSelectedContractForUpload(contract)}
                    >
                      <Upload size={14} />
                      <span>Upload video draft</span>
                    </Button>
                  )}

                  {contract.state === 'draft_review' && (
                    <Badge variant="pending" className="text-xs py-1 px-3">
                      <Clock size={12} className="mr-1 inline" /> Waiting for brand signoff
                    </Badge>
                  )}

                  {contract.state === 'released' && (
                    <Badge variant="action" className="text-xs py-1 px-3">
                      <CheckCircle2 size={12} className="mr-1 inline" /> Payout completed
                    </Badge>
                  )}

                  {!isDisputed && contract.state !== 'released' && contract.state !== 'refunded' && (
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

              {/* Events History Log */}
              {(contract.events || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#18181b] space-y-1">
                  <p className="text-[10px] uppercase font-semibold text-[#52525b]">Audit history</p>
                  {contract.events.slice(-3).map((e, idx) => (
                    <p key={idx} className="text-[11px] text-[#71717a]">
                      • {formatDate(e.timestamp)}: {e.reason || `Transitioned to ${e.to}`}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Deliverable Modal */}
      {selectedContractForUpload && (
        <DeliverableModal
          contract={selectedContractForUpload}
          isOpen={Boolean(selectedContractForUpload)}
          onClose={() => setSelectedContractForUpload(null)}
          onSubmitDeliverable={handleSubmitDeliverable}
        />
      )}
    </div>
  );
}
