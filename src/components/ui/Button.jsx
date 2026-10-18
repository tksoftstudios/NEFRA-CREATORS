import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  children,
  className = '',
  variant = 'default', // default (red), outline, secondary, ghost, destructive
  size = 'default',    // default, sm, lg, icon
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    default: "bg-[#e11d48] text-white hover:bg-[#be123c] active:bg-[#9f1239]",
    outline: "border border-[#27272a] bg-transparent text-[#fafafa] hover:bg-[#18181b] hover:border-[#3f3f46]",
    secondary: "bg-[#18181b] text-[#f4f4f5] hover:bg-[#27272a] border border-[#27272a]",
    ghost: "bg-transparent text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]",
    destructive: "bg-[#e11d48] text-white hover:bg-[#be123c]"
  };

  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-10 px-5 text-base",
    icon: "h-9 w-9"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
