import React from 'react';
import { cn } from '../../lib/utils';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div className={cn("flex items-center space-x-1 border-b border-[#27272a] overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap -mb-[1px] cursor-pointer",
              isActive
                ? "border-[#e11d48] text-[#fafafa]"
                : "border-transparent text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.2 rounded-full text-[10px]",
                isActive ? "bg-[#e11d48]/20 text-[#e11d48]" : "bg-[#18181b] text-[#71717a]"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
