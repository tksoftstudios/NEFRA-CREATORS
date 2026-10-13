import React, { useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  DollarSign, 
  ChevronRight, 
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { updateApplicationStatus } from '../../services/marketplaceService';

export default function CreatorInboxView({ 
  applications = [], 
  onApplicationsChange 
}) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAcceptOffer = async (app) => {
    setIsUpdating(true);
    try {
      const updatedList = await updateApplicationStatus(app.id, 'accepted');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onApplicationsChange) {
        onApplicationsChange(updatedList);
      }
      setSelectedApp((prev) => prev ? { ...prev, status: 'accepted' } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeclineOffer = async (app) => {
    setIsUpdating(true);
    try {
      const updatedList = await updateApplicationStatus(app.id, 'declined');
      if (onApplicationsChange) {
        onApplicationsChange(updatedList);
      }
      setSelectedApp((prev) => prev ? { ...prev, status: 'declined' } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'offer_received':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Brand Offer Received
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Offer Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
            <XCircle className="size-3.5" />
            Declined
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400">
            <Clock className="size-3.5" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
              Applications & Brand Offers
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Review submitted campaign pitches, track sponsor review status, and respond to incoming offers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300">
              {applications.length} Submissions
            </span>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
        {applications.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="size-8 mx-auto text-gray-400 mb-2" />
            <h5 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
              No applications submitted yet
            </h5>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
              Browse the Opportunities tab and apply with your Gemini-generated pitch!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-neutral-700">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="p-5 hover:bg-gray-50/70 transition-colors dark:hover:bg-neutral-700/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Brand info & Campaign */}
                  <div className="flex items-start gap-3.5">
                    {app.brandLogo ? (
                      <img
                        src={app.brandLogo}
                        alt={app.brandName}
                        className="size-11 rounded-lg object-cover border border-gray-200 dark:border-neutral-700 shrink-0"
                      />
                    ) : (
                      <div className="size-11 rounded-lg bg-gray-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                        <Building2 className="size-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-neutral-200">
                          {app.campaignTitle}
                        </h4>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                        Brand: <strong className="text-gray-700 dark:text-neutral-300">{app.brandName}</strong> • Deliverable: {app.deliverable}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-neutral-400">
                        <span className="font-semibold text-gray-900 dark:text-neutral-200">
                          {app.budgetFormatted}
                        </span>
                        <span>•</span>
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {app.status === 'offer_received' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptOffer(app)}
                          disabled={isUpdating}
                          className="py-1.5 px-3.5 inline-flex items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none"
                        >
                          <CheckCircle2 className="size-3.5" />
                          Accept Offer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineOffer(app)}
                          disabled={isUpdating}
                          className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      <FileText className="size-3.5" />
                      View Pitch
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Pitch Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex justify-between items-center py-3.5 px-5 border-b border-gray-200 dark:border-neutral-700">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                  Application Details
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  {selectedApp.campaignTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="size-8 inline-flex justify-center items-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-neutral-900/50 text-xs">
                <div>
                  <span className="text-gray-500 dark:text-neutral-400 block">Brand</span>
                  <strong className="text-gray-800 dark:text-neutral-200">{selectedApp.brandName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-neutral-400 block">Status</span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div>
                  <span className="text-gray-500 dark:text-neutral-400 block">Agreed Budget</span>
                  <strong className="text-gray-800 dark:text-neutral-200">{selectedApp.budgetFormatted}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1.5">
                  Submitted AI Proposal & Creative Angle
                </label>
                <div className="p-4 bg-gray-50/80 border border-gray-200 rounded-lg text-xs text-gray-700 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {selectedApp.pitchText}
                </div>
              </div>

              {selectedApp.status === 'offer_received' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between dark:bg-amber-950/20 dark:border-amber-900/50">
                  <div className="text-xs text-amber-800 dark:text-amber-400">
                    The brand has extended a formal campaign offer of <strong>{selectedApp.budgetFormatted}</strong>!
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAcceptOffer(selectedApp)}
                    className="py-1 px-3 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Accept Offer
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="py-2 px-3.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
