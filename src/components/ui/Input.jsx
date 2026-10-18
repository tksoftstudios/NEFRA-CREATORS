import React from 'react';
import { cn } from '../../lib/utils';

export function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-[#a1a1aa]">{label}</label>}
      <input
        className={cn(
          "w-full h-9 px-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] text-sm focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-colors",
          error && "border-[#e11d48]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#e11d48]">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  rows = 3,
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-[#a1a1aa]">{label}</label>}
      <textarea
        rows={rows}
        className={cn(
          "w-full p-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] text-sm focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-colors resize-none",
          error && "border-[#e11d48]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#e11d48]">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  options = [],
  value,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-[#a1a1aa]">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "w-full h-9 px-3 rounded-lg bg-[#09090b] border border-[#27272a] text-[#fafafa] text-sm focus:outline-none focus:border-[#e11d48] focus:ring-1 focus:ring-[#e11d48] transition-colors",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#09090b] text-[#fafafa]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
