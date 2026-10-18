import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Flame, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Globe2
} from 'lucide-react';

/**
 * Full-screen high-tech portal switching transition
 * Displays a cinematic animated transition when shifting between Creator and Brand portals,
 * dynamically highlighting the theme change (Creator Crimson vs Brand Emerald).
 */
export function PortalSwitchTransition({
  targetPortal,
  fromPortal,
  onComplete
}) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('entering'); // 'entering' | 'switching' | 'exiting'

  const isBrandTarget = targetPortal === 'brand';
  const isCreatorTarget = targetPortal === 'creator';

  useEffect(() => {
    // 1. Progress animation loop
    const startTime = Date.now();
    const duration = 850; // Total duration in ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 50 && stage === 'entering') {
        setStage('switching');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setStage('exiting');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 220);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete, stage]);

  const themeColor = isBrandTarget 
    ? '#1db954' 
    : isCreatorTarget 
      ? '#e11d48' 
      : '#3b82f6';

  const themeLabel = isBrandTarget 
    ? 'Brand Emerald Theme' 
    : isCreatorTarget 
      ? 'Creator Crimson Theme' 
      : 'Admin Blue Theme';

  const portalTitle = isBrandTarget 
    ? 'Brand Workspace' 
    : isCreatorTarget 
      ? 'Creator Portal' 
      : 'Admin Command Center';

  const subtitle = isBrandTarget
    ? 'Activating campaign escrow, AI matchmaker & Neural Studio...'
    : isCreatorTarget
      ? 'Activating channel diagnostics, rate cards & AI Score engine...'
      : 'Loading administrative controls & dispute management...';

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000] select-none transition-all duration-300 ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Ambient Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700 blur-[140px] opacity-80"
        style={{
          background: isBrandTarget
            ? 'radial-gradient(circle at center, rgba(29, 185, 84, 0.45) 0%, rgba(30, 215, 96, 0.18) 35%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(225, 29, 72, 0.45) 0%, rgba(190, 18, 60, 0.18) 35%, transparent 70%)'
        }}
      />

      {/* Cyber Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${themeColor} 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Main Switching Card Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-6">
        {/* Brand Logo & Illuminated Rings */}
        <div className="relative flex items-center justify-center">
          {/* Animated Pulsing Ring */}
          <div 
            className="absolute w-28 h-28 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: themeColor }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full border border-dashed animate-spin"
            style={{ borderColor: themeColor, animationDuration: '6s' }}
          />

          {/* Logo Capsule */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#09090b] border border-[#27272a] shadow-2xl flex items-center justify-center p-2.5">
            <img 
              src="/LOGO.png" 
              alt="NEFRA" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Portal Switching Announcement */}
        <div className="space-y-2">
          {/* Theme Activation Pill */}
          <div 
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg backdrop-blur-md"
            style={{
              backgroundColor: isBrandTarget ? 'rgba(29, 185, 84, 0.15)' : 'rgba(225, 29, 72, 0.15)',
              borderColor: isBrandTarget ? 'rgba(29, 185, 84, 0.4)' : 'rgba(225, 29, 72, 0.4)',
              color: isBrandTarget ? '#1ed760' : '#f43f5e'
            }}
          >
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: themeColor }} 
            />
            <span>{themeLabel} Activated</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Switching to {portalTitle}
          </h2>

          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* High-Tech Progress Loading Track */}
        <div className="w-full space-y-2">
          <div className="h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden border border-[#27272a] p-0.5 relative">
            <div 
              className="h-full rounded-full transition-all duration-75 ease-out shadow-lg"
              style={{ 
                width: `${progress}%`,
                backgroundColor: themeColor,
                boxShadow: `0 0 14px ${themeColor}`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#71717a] font-mono px-0.5">
            <span className="flex items-center gap-1">
              <Zap size={11} style={{ color: themeColor }} />
              {progress < 50 ? 'Unloading current portal' : 'Applying workspace theme'}
            </span>
            <span className="font-bold text-[#fafafa]">{progress}%</span>
          </div>
        </div>

        {/* Features preview pills */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-[#71717a]">
          {isBrandTarget ? (
            <>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] flex items-center gap-1">
                <Briefcase size={10} className="text-[#1ed760]" />
                Campaign Escrow
              </span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] flex items-center gap-1">
                <Sparkles size={10} className="text-[#1ed760]" />
                AI Content Studio
              </span>
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] flex items-center gap-1">
                <Flame size={10} className="text-[#e11d48]" />
                Verified Rate Cards
              </span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] flex items-center gap-1">
                <ShieldCheck size={10} className="text-[#e11d48]" />
                AI Diagnostics
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
