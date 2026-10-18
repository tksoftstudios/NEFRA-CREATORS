import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Textarea } from '../ui/Input';
import { formatCents } from '../../lib/utils';
import { formatFileSize } from '../../services/storageService';
import { 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  FileVideo, 
  Image as ImageIcon, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function BrandContracts({
  contracts = [],
  onTransitionContract,
  onOpenDispute
}) {
  const [revisionContract, setRevisionContract] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [expandedModerationIds, setExpandedModerationIds] = useState({});

  const toggleModeration = (contractId) => {
    setExpandedModerationIds(prev => ({
      ...prev,
      [contractId]: !prev[contractId]
    }));
  };

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
          Review uploaded drafts from Firebase Storage, inspect Google Content Moderation safety scores, sign off on completed deliverables, or request revisions.
        </p>
      </div>

      <div className="space-y-6">
        {contracts.map(contract => {
          const isDisputed = contract.state === 'disputed';
          const isReviewReady = contract.state === 'draft_review';
          const isModerationExpanded = Boolean(expandedModerationIds[contract.id]);
          const moderation = contract.moderationDetails;
          const score = contract.moderationScore;

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
              <div className="p-4 bg-[#18181b] rounded-lg border border-[#27272a] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#fafafa]">Submitted Deliverables</p>
                      
                      {/* Google Content Moderation Score Badge */}
                      {score !== undefined && score !== null && (
                        <button
                          type="button"
                          onClick={() => toggleModeration(contract.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-semibold text-[11px] hover:bg-[#10b981]/25 transition-all"
                          title="Click to view full Google Content Moderation breakdown"
                        >
                          <ShieldCheck size={13} className="text-[#10b981]" />
                          <span>Google Safety: {score}/100</span>
                          <span className="text-[#6ee7b7] text-[10px] font-normal">({moderation?.safetyGrade || 'Brand Safe'})</span>
                          {isModerationExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      )}
                    </div>

                    {/* Unlisted Video URL / Review Link */}
                    {contract.deliverableUrl && !contract.deliverableUrl.startsWith('blob:') && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-[#a1a1aa]">Video Link:</span>
                        <a
                          href={contract.deliverableUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#e11d48] hover:underline font-medium inline-flex items-center gap-1 truncate max-w-sm"
                        >
                          <Play size={12} /> {contract.deliverableUrl}
                        </a>
                      </div>
                    )}

                    {/* Multiple Uploaded Files from Firebase Storage */}
                    {contract.deliverableFiles && contract.deliverableFiles.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-[#71717a] block">
                          Firebase Storage Deliverables ({contract.deliverableFiles.length} file{contract.deliverableFiles.length > 1 ? 's' : ''}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {contract.deliverableFiles.map((file, idx) => {
                            const isVideo = file.type?.includes('video') || file.name?.match(/\.(mp4|mov|webm)$/i);
                            return (
                              <a
                                key={file.id || idx}
                                href={file.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#27272a]/70 hover:bg-[#27272a] border border-[#3f3f46]/60 text-xs text-[#fafafa] transition-colors"
                              >
                                {isVideo ? (
                                  <FileVideo size={14} className="text-[#e11d48] shrink-0" />
                                ) : (
                                  <ImageIcon size={14} className="text-[#3b82f6] shrink-0" />
                                )}
                                <div className="truncate max-w-[160px]">
                                  <span className="font-medium text-[11px] block truncate">{file.name}</span>
                                  <span className="text-[10px] text-[#71717a]">{formatFileSize(file.size)}</span>
                                </div>
                                <ExternalLink size={12} className="text-[#71717a] ml-1 shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      !contract.deliverableUrl && (
                        <p className="text-xs text-[#71717a] mt-0.5">Creator is currently filming content.</p>
                      )
                    )}

                    {/* Timestamp Notes */}
                    {contract.timestampNotes && (
                      <div className="mt-2 text-[11px] text-[#a1a1aa] bg-[#27272a]/40 p-2.5 rounded border border-[#27272a]">
                        <strong className="text-[#fafafa]">Creator Timestamp Notes:</strong> {contract.timestampNotes}
                      </div>
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

                {/* Expanded Google Content Moderation Breakdown Drawer */}
                {isModerationExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#27272a] space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#fafafa]">
                        <ShieldCheck size={14} className="text-[#10b981]" />
                        <span>Google Cloud Vertex AI Content Moderation & Brand Safety Audit</span>
                      </div>
                      <Badge variant="action" className="text-[10px] font-mono">
                        {moderation?.provider || 'Google Vertex AI Safety Engine'}
                      </Badge>
                    </div>

                    {moderation?.summary && (
                      <p className="text-xs text-[#a1a1aa] bg-[#09090b] p-2.5 rounded border border-[#27272a] leading-relaxed">
                        {moderation.summary}
                      </p>
                    )}

                    {/* Category Risk Grid */}
                    {Array.isArray(moderation?.categories) && moderation.categories.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {moderation.categories.map((cat) => (
                          <div 
                            key={cat.id || cat.name} 
                            className="p-2.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-[#fafafa] text-[11px] truncate">{cat.name}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                cat.severity === 'NEGLIGIBLE' 
                                  ? 'bg-[#10b981]/15 text-[#10b981]' 
                                  : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                              }`}>
                                {cat.severity || 'SAFE'} ({cat.score}/100)
                              </span>
                            </div>
                            <p className="text-[10px] text-[#71717a] leading-tight line-clamp-2">
                              {cat.rationale || 'Evaluated against Google Brand Safety policies.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Highlights / Strengths */}
                    {Array.isArray(moderation?.strengths) && moderation.strengths.length > 0 && (
                      <div className="space-y-1 text-xs">
                        <span className="text-[11px] font-medium text-[#fafafa] flex items-center gap-1">
                          <Check size={12} className="text-[#10b981]" /> Google Safety Key Strengths:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#a1a1aa]">
                          {moderation.strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
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
