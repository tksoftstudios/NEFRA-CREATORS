import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { formatCents } from '../../lib/utils';
import { Search, ShieldCheck, ArrowRight, Play } from 'lucide-react';

export function PublicDirectory({
  creators = [],
  onSelectCreator
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const standardCategories = [
    { id: 'all', label: 'All categories' },
    { id: 'Technology & AI', label: 'Tech & AI' },
    { id: 'Gaming & Esports', label: 'Gaming & Esports' },
    { id: 'Acoustic & Music', label: 'Acoustic & Music' },
    { id: 'Finance & Web3', label: 'Finance & Web3' },
    { id: 'Design & Creative', label: 'Design & Creative' },
    { id: 'Education & Science', label: 'Education' },
    { id: 'Lifestyle & Travel', label: 'Lifestyle' }
  ];

  const categories = standardCategories.filter(cat => 
    cat.id === 'all' || 
    creators.some(c => c.category === cat.id) ||
    ['Technology & AI', 'Gaming & Esports', 'Acoustic & Music'].includes(cat.id)
  );


  const filteredCreators = creators.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Directory Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Verified YouTube creator directory
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Top ranked creators evaluated by Gemini 3-video multimodal analysis. Pre-funded escrow protection on every deal.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search creator, niche, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] text-xs focus:outline-none focus:border-[#e11d48]"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Creator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreators.map((creator, idx) => (
          <Card
            key={creator.id}
            className="hover:border-[#3f3f46] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header: Avatar & Rank */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#27272a]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#e11d48] flex items-center justify-center text-[9px] text-white font-bold">
                      #{idx + 1}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="text-sm font-semibold text-[#fafafa] leading-tight">
                        {creator.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#a1a1aa]">{creator.handle}</p>
                    <span className="text-[10px] text-[#71717a]">{creator.country}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#e11d48] tabular-nums">
                    {creator.aiScore}/100
                  </span>
                  <p className="text-[9px] text-[#71717a] uppercase">AI score</p>
                </div>
              </div>

              {/* Bio & Niche Tags */}
              <p className="text-xs text-[#a1a1aa] mt-3 line-clamp-2">
                {creator.bio}
              </p>

              <div className="flex flex-wrap gap-1 mt-3">
                {(creator.tags || []).slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Modality & Sub Stats */}
              <div className="flex items-center justify-between text-xs text-[#71717a] pt-4 mt-4 border-t border-[#27272a]">
                <div>
                  <span className="font-semibold text-[#fafafa]">{creator.subscribersFormatted}</span>
                  <span className="block text-[10px]">Subscribers</span>
                </div>
                <div>
                  <span className="font-semibold text-[#fafafa]">{creator.avgViewsFormatted}</span>
                  <span className="block text-[10px]">Avg Views</span>
                </div>
                <div>
                  <span className="font-semibold text-[#fafafa]">{formatCents(creator.startingPriceCents)}</span>
                  <span className="block text-[10px]">From</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-4 pt-3">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onSelectCreator(creator)}
              >
                <span>View rate cards & audit</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
