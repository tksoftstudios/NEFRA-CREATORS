import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';

export function DeliverableModal({
  contract,
  isOpen,
  onClose,
  onSubmitDeliverable
}) {
  const [videoUrl, setVideoUrl] = useState('');
  const [timestampNotes, setTimestampNotes] = useState('');

  if (!contract) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitDeliverable(contract.id, {
      deliverableUrl: videoUrl,
      reason: `Uploaded unlisted video draft: ${videoUrl}`,
      timestampNotes
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Submit unlisted video deliverable"
      description={`Contract: ${contract.campaignTitle} • Brand: ${contract.brandName}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Unlisted YouTube Video URL or Review Link"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=unlisted_id"
          required
        />

        <Textarea
          label="Review Notes & Sponsor Timestamp Markers"
          value={timestampNotes}
          onChange={(e) => setTimestampNotes(e.target.value)}
          placeholder="e.g. 02:15 - 03:45 Sponsored Integration segment; tracking link tested."
          rows={3}
        />

        <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] text-xs text-[#a1a1aa]">
          Submitting moves the contract status to <span className="text-[#fafafa] font-semibold">Draft review</span>. The brand will be notified to review the draft against the contract specifications.
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-[#27272a]">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Submit for brand review
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
