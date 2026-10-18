import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className = '' }) {
  return (
    <div className={cn(
      "bg-[#09090b] border border-[#27272a] rounded-lg p-5 text-[#fafafa]",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn("mb-4 flex flex-col space-y-1", className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={cn("text-base font-semibold text-[#fafafa] tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={cn("text-xs text-[#a1a1aa]", className)}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={cn("mt-4 pt-4 border-t border-[#27272a] flex items-center justify-between", className)}>{children}</div>;
}
