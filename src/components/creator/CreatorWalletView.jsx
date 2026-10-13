import React from 'react';
import { 
  Coins, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { refillDemoCredits } from '../../services/marketplaceService';
import confetti from 'canvas-confetti';

export default function CreatorWalletView({ 
  wallet, 
  onWalletUpdated 
}) {
  const balance = wallet?.balance ?? 50;
  const history = wallet?.history || [];
  const totalEarned = wallet?.totalEarned ?? 50;
  const totalSpent = wallet?.totalSpent ?? 0;

  const handleRefill = () => {
    const updated = refillDemoCredits();
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 }
    });
    if (onWalletUpdated) {
      onWalletUpdated(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Main Balance Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                Available Credits
              </span>
              <span className="size-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                <Coins className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {balance}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">Credits</span>
            </div>
            <p className="text-2xs text-gray-500 dark:text-neutral-400 mt-1">
              Used to generate AI pitches & submit campaign applications (5 cr / application).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700">
            <button
              type="button"
              onClick={handleRefill}
              className="w-full py-2 px-3 inline-flex justify-center items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
            >
              <PlusCircle className="size-3.5" />
              Claim Demo Refill (+15 Credits)
            </button>
          </div>
        </div>

        {/* Total Earned Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                Lifetime Granted
              </span>
              <span className="size-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                <ArrowDownLeft className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {totalEarned}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">Credits</span>
            </div>
            <p className="text-2xs text-gray-500 dark:text-neutral-400 mt-1">
              Includes 50 signup starter credits and daily claim refills.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> Starter grant active
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                Credits Invested
              </span>
              <span className="size-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {totalSpent}
              </span>
              <span className="text-xs text-gray-500 dark:text-neutral-400">Credits</span>
            </div>
            <p className="text-2xs text-gray-500 dark:text-neutral-400 mt-1">
              Invested in tailored brand pitches and application submissions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700 text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1">
            <Receipt className="size-3.5" /> Rate: 5 cr / submission
          </div>
        </div>

      </div>

      {/* Transaction History Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="py-4 px-5 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
              Credit Transaction History
            </h4>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Transparent ledger of all starter grants, daily refills, and proposal submissions.
            </p>
          </div>
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            {history.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 text-xs text-left">
            <thead className="bg-gray-50 dark:bg-neutral-900/50">
              <tr>
                <th className="px-5 py-3 font-semibold text-gray-500 dark:text-neutral-400">Date & Time</th>
                <th className="px-5 py-3 font-semibold text-gray-500 dark:text-neutral-400">Activity</th>
                <th className="px-5 py-3 font-semibold text-gray-500 dark:text-neutral-400">Details</th>
                <th className="px-5 py-3 font-semibold text-gray-500 dark:text-neutral-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {history.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70 dark:hover:bg-neutral-700/30">
                  <td className="px-5 py-3.5 text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-neutral-200 whitespace-nowrap">
                    {tx.title}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-neutral-400">
                    {tx.note || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap">
                    <span className={tx.delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-neutral-300'}>
                      {tx.delta > 0 ? `+${tx.delta}` : tx.delta} Credits
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
