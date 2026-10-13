import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, Coins, Send, ArrowRight } from 'lucide-react';
import { generateCreatorPitchWithGemini } from '../../services/geminiService';
import { deductApplicationCredits, submitApplication } from '../../services/marketplaceService';
import confetti from 'canvas-confetti';

export default function ApplyProposalModal({
  isOpen,
  onClose,
  campaign,
  creator,
  apiKey,
  wallet,
  onApplicationSubmitted,
  onWalletUpdated
}) {
  const [pitchText, setPitchText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen || !campaign) return null;

  const currentBalance = wallet?.balance ?? 50;
  const hasEnoughCredits = currentBalance >= 5;

  // Auto-generate customized pitch using Gemini
  const handleGeneratePitch = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const generated = await generateCreatorPitchWithGemini(apiKey, creator, campaign);
      setPitchText(generated);
    } catch (err) {
      setErrorMsg('Failed to generate proposal: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitchText.trim()) {
      setErrorMsg('Please write or generate a proposal pitch before submitting.');
      return;
    }

    if (!hasEnoughCredits) {
      setErrorMsg('You do not have enough credits (5 required). Please refill your credits in the wallet tab.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // 1. Deduct credits
    const deductRes = deductApplicationCredits(campaign.title);
    if (!deductRes.success) {
      setErrorMsg(deductRes.message);
      setIsSubmitting(false);
      return;
    }

    if (onWalletUpdated) {
      onWalletUpdated();
    }

    // 2. Submit application to Firestore and local state
    try {
      const newApp = await submitApplication({
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        brandName: campaign.brandName,
        brandLogo: campaign.brandLogo,
        creatorId: creator.id || creator.channelId,
        creatorName: creator.title,
        creatorAvatar: creator.avatar,
        creatorCategory: creator.categoryLabel || creator.category,
        budgetFormatted: campaign.budgetFormatted,
        deliverable: campaign.deliverable,
        pitchText: pitchText.trim(),
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSuccessMsg('Proposal submitted successfully! 5 credits deducted.');
      if (onApplicationSubmitted) {
        onApplicationSubmitted(newApp);
      }

      setTimeout(() => {
        setSuccessMsg(null);
        setPitchText('');
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg('Error submitting application: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center py-3.5 px-5 border-b border-gray-200 dark:border-neutral-700">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
              Apply to Campaign
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Submit your tailored pitch to {campaign.brandName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center items-center size-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Campaign Summary Card */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-neutral-900/50 dark:border-neutral-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-x-1.5 py-0.5 px-2 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {campaign.targetCategoryLabel || campaign.targetCategory}
                </span>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mt-1">
                  {campaign.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  Brand: <span className="font-medium text-gray-700 dark:text-neutral-300">{campaign.brandName}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-gray-900 dark:text-neutral-100">
                  {campaign.budgetFormatted}
                </span>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  {campaign.deliverable}
                </p>
              </div>
            </div>
          </div>

          {/* Credit Cost Notice Banner */}
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-900/50">
            <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400">
              <Coins className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Application fee: <strong>5 Credits</strong> per pitch submission.
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
              Your Balance: <span className={hasEnoughCredits ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 font-bold'}>{currentBalance} Credits</span>
            </div>
          </div>

          {/* Proposal Generation Bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                Your Proposal & Creative Pitch
              </label>
              <button
                type="button"
                onClick={handleGeneratePitch}
                disabled={isGenerating}
                className="py-1 px-2.5 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-700 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-50"
              >
                <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                {isGenerating ? 'Drafting with Gemini...' : 'Generate AI Pitch with Gemini'}
              </button>
            </div>
            <textarea
              rows={6}
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              placeholder="Click 'Generate AI Pitch with Gemini' to create a proposal customized to your 3 audited videos, or write your own custom pitch..."
              className="py-3 px-3.5 block w-full border border-gray-200 rounded-lg text-sm text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-500"
            />
            <p className="text-2xs text-gray-500 dark:text-neutral-400 mt-1">
              Tip: The proposal will reference your channel's verified statistics and recent uploaded video style.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-x-2 pt-3 border-t border-gray-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3.5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasEnoughCredits || !pitchText.trim()}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
            >
              <Send className="size-3.5" />
              {isSubmitting ? 'Submitting...' : 'Submit Pitch (5 Credits)'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
