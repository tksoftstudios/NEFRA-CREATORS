import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CREDIT_PACKAGES, topupCreditsWithStripe } from '../../services/stripeService';
import { 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function StripeTopupModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]); // Pro by default
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardholderName, setCardholderName] = useState('Kaveen Creator');

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    const totalCredits = selectedPackage.credits + (selectedPackage.bonusCredits || 0);

    try {
      const result = await topupCreditsWithStripe({
        amountCents: selectedPackage.amountCents,
        credits: totalCredits,
        paymentMethod: 'pm_card_visa'
      });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4 }
      });

      setSuccessReceipt(result);
      if (onSuccess) {
        onSuccess(totalCredits, result);
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    } catch (e) {
      console.error('[Stripe Modal] Top-up error:', e);
      setErrorMsg(e.message || 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessReceipt(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Top-Up Creator Credits with Stripe"
      description="Purchase credits instantly using the official Stripe Sandbox gateway."
      maxWidth="max-w-xl"
    >
      {successReceipt ? (
        <div className="space-y-4 text-center py-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30">
            <CheckCircle2 size={24} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#fafafa]">
              Payment Succeeded!
            </h3>
            <p className="text-xs text-[#a1a1aa]">
              Added <strong className="text-[#fafafa]">+{successReceipt.creditsAdded} Credits</strong> to your creator wallet.
            </p>
          </div>

          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-[#71717a]">
              <span>Payment Intent:</span>
              <span className="text-[#fafafa]">{successReceipt.paymentIntentId}</span>
            </div>
            <div className="flex justify-between text-[#71717a]">
              <span>Amount Paid:</span>
              <span className="text-[#10b981]">${(successReceipt.amountCents / 100).toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-[#71717a]">
              <span>Gateway:</span>
              <span className="text-[#fafafa]">Stripe Sandbox (Testmode)</span>
            </div>
            <div className="flex justify-between text-[#71717a]">
              <span>Status:</span>
              <span className="text-[#10b981] uppercase font-bold">SUCCEEDED</span>
            </div>
          </div>

          <Button
            onClick={handleResetAndClose}
            className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white"
          >
            Done &amp; Return to Wallet
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Stripe Sandbox Indicator */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="font-semibold text-[#fafafa]">Stripe Sandbox Testmode</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-[#a1a1aa] border-[#3f3f46]">
              acct_1URWsCPaczSuhiYB
            </Badge>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#e11d48]/15 border border-[#e11d48]/30 rounded-lg text-xs text-[#e11d48]">
              {errorMsg}
            </div>
          )}

          {/* Package Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#fafafa] block">
              1. Select Credit Package
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CREDIT_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                const totalCredits = pkg.credits + (pkg.bonusCredits || 0);

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`cursor-pointer p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#e11d48] bg-[#e11d48]/10'
                        : 'border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#e11d48] text-white">
                        POPULAR
                      </span>
                    )}

                    <div>
                      <span className="text-[11px] font-medium text-[#a1a1aa] block">
                        {pkg.name}
                      </span>
                      <div className="flex items-baseline space-x-1 mt-1">
                        <span className="text-xl font-extrabold text-[#fafafa] tabular-nums">
                          {totalCredits}
                        </span>
                        <span className="text-[11px] text-[#a1a1aa]">Credits</span>
                      </div>
                      {pkg.bonusCredits > 0 && (
                        <span className="text-[10px] text-[#10b981] font-semibold block mt-0.5">
                          +{pkg.bonusCredits} Bonus Free
                        </span>
                      )}
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#fafafa]">
                        ${pkg.amountDollars}.00
                      </span>
                      <span className="text-[10px] text-[#71717a]">
                        USD
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mock Stripe Elements Card Form */}
          <div className="space-y-3 pt-2 border-t border-[#27272a]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#fafafa] flex items-center space-x-1.5">
                <CreditCard size={14} className="text-[#a1a1aa]" />
                <span>2. Stripe Payment Details</span>
              </label>
              <span className="text-[10px] text-[#71717a] flex items-center space-x-1">
                <Lock size={10} />
                <span>256-bit SSL Encrypted</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-[#71717a] block mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-md text-xs text-[#fafafa] focus:outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#71717a] block mb-1">Card Number (Stripe Sandbox Universal Card)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    readOnly
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-md text-xs text-[#fafafa] font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-bold text-[#10b981] bg-[#10b981]/15 px-1.5 py-0.5 rounded">
                    TEST VISA
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#71717a] block mb-1">Expires</label>
                  <input
                    type="text"
                    value={expDate}
                    readOnly
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-md text-xs text-[#fafafa] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#71717a] block mb-1">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    readOnly
                    className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] rounded-md text-xs text-[#fafafa] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-[#635bff] hover:bg-[#534be7] text-white flex items-center justify-center space-x-2 py-2.5 font-semibold text-xs shadow-md cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Contacting Stripe Sandbox...</span>
                </>
              ) : (
                <>
                  <Lock size={13} />
                  <span>
                    Pay ${(selectedPackage.amountDollars).toFixed(2)} USD with Stripe Sandbox (+{selectedPackage.credits + (selectedPackage.bonusCredits || 0)} Credits)
                  </span>
                </>
              )}
            </Button>
            <p className="text-[10px] text-[#71717a] text-center mt-2">
              Powered by Stripe Connect Sandbox. Verified test mode transaction.
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
