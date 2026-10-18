import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  variant = 'outline', // outline (neutral), action (solid red), pending (grey)
  className = ''
}) {
  const variants = {
    outline: "border border-[#27272a] text-[#a1a1aa] bg-transparent",
    action: "bg-[#e11d48] text-white font-medium border border-[#be123c]",
    pending: "bg-[#18181b] text-[#a1a1aa] border border-[#27272a]"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-normal tracking-wide",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
