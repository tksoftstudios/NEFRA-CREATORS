import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { SEED_CAMPAIGNS } from '../../data/seedCampaigns';
import { calculateMatchScore } from '../../services/marketplaceService';

export default function CreatorJobBoard({ 
  creator, 
  onSelectCampaignToApply,
  appliedCampaignIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('all');
  const [selectedDeliverable, setSelectedDeliverable] = useState('all');

  // Compute matched campaigns with dynamic compatibility scores
  const processedCampaigns = useMemo(() => {
    return SEED_CAMPAIGNS.map((camp) => {
      const matchScore = calculateMatchScore(creator, camp);
      const isApplied = appliedCampaignIds.includes(camp.id);
      return {
        ...camp,
        matchScore,
        isApplied
      };
    });
  }, [creator, appliedCampaignIds]);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return processedCampaigns.filter((camp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          camp.title.toLowerCase().includes(q) ||
          camp.brandName.toLowerCase().includes(q) ||
          camp.description.toLowerCase().includes(q) ||
          (camp.requiredTags && camp.requiredTags.some((t) => t.toLowerCase().includes(q)));
        if (!matchesText) return false;
      }

      // Category
      if (selectedCategory !== 'all' && camp.targetCategory !== selectedCategory) {
        return false;
      }

      // Budget Range
      if (selectedBudgetRange !== 'all') {
        if (selectedBudgetRange === 'under1500' && camp.budget >= 1500) return false;
        if (selectedBudgetRange === '1500to3000' && (camp.budget < 1500 || camp.budget > 3000)) return false;
        if (selectedBudgetRange === 'above3000' && camp.budget <= 3000) return false;
      }

      // Deliverable Type
      if (selectedDeliverable !== 'all' && camp.deliverableType !== selectedDeliverable) {
        return false;
      }

      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [processedCampaigns, searchQuery, selectedCategory, selectedBudgetRange, selectedDeliverable]);

  return (
    <div className="space-y-6">
      
      {/* Top Marketplace Intro & Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-neutral-700">
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
              Live Brand Opportunities
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
              Browse brand campaigns and apply directly using your Gemini AI-crafted proposal.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-neutral-400">
              Showing <strong className="text-gray-800 dark:text-neutral-200">{filteredCampaigns.length}</strong> campaigns
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              <Search className="size-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, tag, role..."
              className="py-2 ps-9 pe-3 block w-full border border-gray-200 rounded-lg text-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-neutral-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
            >
              <option value="all">All Categories</option>
              <option value="music">Music & Singing</option>
              <option value="tech">Tech & AI</option>
              <option value="travel">Travel & Culinary</option>
              <option value="gaming">Gaming & Esports</option>
              <option value="education">Education & Careers</option>
            </select>
          </div>

          {/* Budget Range Dropdown */}
          <div>
            <select
              value={selectedBudgetRange}
              onChange={(e) => setSelectedBudgetRange(e.target.value)}
              className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
            >
              <option value="all">All Budgets</option>
              <option value="under1500">Under $1,500</option>
              <option value="1500to3000">$1,500 – $3,000</option>
              <option value="above3000">$3,000+</option>
            </select>
          </div>

          {/* Deliverable Format Dropdown */}
          <div>
            <select
              value={selectedDeliverable}
              onChange={(e) => setSelectedDeliverable(e.target.value)}
              className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-xs text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300"
            >
              <option value="all">All Deliverables</option>
              <option value="dedicated_video">Dedicated Video</option>
              <option value="shorts">YouTube Shorts</option>
              <option value="integration">In-Video Integration</option>
            </select>
          </div>

        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-gray-300 transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600"
          >
            {/* Header: Brand & Compatibility Match */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={camp.brandLogo}
                  alt={camp.brandName}
                  className="size-11 rounded-lg object-cover border border-gray-200 dark:border-neutral-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-900 dark:text-neutral-200">
                      {camp.brandName}
                    </span>
                    {camp.verifiedBrand && (
                      <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" title="Verified Brand" />
                    )}
                  </div>
                  <span className="text-2xs text-gray-500 dark:text-neutral-400">
                    Category: {camp.targetCategoryLabel || camp.targetCategory}
                  </span>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="shrink-0 text-right">
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  camp.matchScore >= 90
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400'
                }`}>
                  <TrendingUp className="size-3" />
                  {camp.matchScore}% Match
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mb-4 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-1.5 line-clamp-1">
                {camp.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                {camp.description}
              </p>
            </div>

            {/* Campaign Meta Pills */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-lg dark:bg-neutral-900/60 mb-4 text-xs">
              <div>
                <span className="text-2xs text-gray-400 dark:text-neutral-500 block">Compensation</span>
                <span className="font-semibold text-gray-900 dark:text-neutral-200">{camp.budgetFormatted}</span>
              </div>
              <div>
                <span className="text-2xs text-gray-400 dark:text-neutral-500 block">Timeline</span>
                <span className="font-medium text-gray-700 dark:text-neutral-300">{camp.timeline}</span>
              </div>
              <div className="col-span-2">
                <span className="text-2xs text-gray-400 dark:text-neutral-500 block">Deliverable Format</span>
                <span className="font-medium text-gray-700 dark:text-neutral-300">{camp.deliverable}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {camp.requiredTags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
              {camp.requiredTags?.length > 3 && (
                <span className="text-2xs text-gray-400 self-center">
                  +{camp.requiredTags.length - 3} more
                </span>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between">
              <span className="text-2xs text-gray-500 dark:text-neutral-400">
                Cost: <strong className="text-gray-700 dark:text-neutral-300">5 Credits</strong>
              </span>

              {camp.isApplied ? (
                <button
                  type="button"
                  disabled
                  className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Applied
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectCampaignToApply(camp)}
                  className="py-1.5 px-3.5 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                >
                  <Sparkles className="size-3.5" />
                  Apply with AI Proposal
                </button>
              )}
            </div>

          </div>
        ))}

        {filteredCampaigns.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-gray-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <Briefcase className="size-8 mx-auto text-gray-400 mb-2" />
            <h5 className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
              No matching campaigns found
            </h5>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
              Try adjusting your category, budget, or keyword search filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
