import React, { useState, useEffect, useRef } from 'react';
import { askNefraSense, askCreatorTrendsAdvisor } from '@/packages/ai/geminiClient';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { 
  saveNefraSenseHistoryToFirestore,
  fetchNefraSenseHistoryFromFirestore,
  subscribeToNefraSenseHistoryFromFirestore,
  deleteNefraSenseHistoryItemFromFirestore
} from '@/services/nefraSenseHistoryService';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Zap, 
  Flame, 
  CornerDownLeft, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Search,
  Bot,
  History,
  Clock,
  Trash2,
  Database,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  GripVertical,
  Minus,
  Maximize2,
  Clapperboard,
  DollarSign,
  Target,
  Scale,
  Lock
} from 'lucide-react';

/* ───────────────────────────── 3D Dotted Canvas Orb ───────────────────────────── */
const RINGS = 16, TAU = Math.PI * 2, CANVAS = 220, ORB_R = 66;

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DOT_LIST = (() => {
  const rand = mulberry32(7);
  const out = [];
  for (let k = 0; k < RINGS; k++) {
    const y = 1 - ((k + 0.5) / RINGS) * 2;
    const r = Math.sqrt(1 - y * y);
    const m = Math.max(4, Math.round(30 * r));
    for (let j = 0; j < m; j++) {
      const a = (j / m) * TAU + k * 0.35;
      out.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, u: (1 - y) / 2, seed: rand() * 6.283 });
    }
  }
  return out;
})();

const N = DOT_LIST.length;
const DX = Float32Array.from(DOT_LIST, (d) => d.x);
const DY = Float32Array.from(DOT_LIST, (d) => d.y);
const DZ = Float32Array.from(DOT_LIST, (d) => d.z);
const DU = Float32Array.from(DOT_LIST, (d) => d.u);
const DS = Float32Array.from(DOT_LIST, (d) => d.seed);

const lerp = (a, b, t) => a + (b - a) * t;

function buildPalette(theme = 'green') {
  const G_STEPS = 24, A_STEPS = 48;
  const out = [];
  for (let gi = 0; gi <= G_STEPS; gi++) {
    const g = gi / G_STEPS;
    let r = 235, gg = 235, b = 235;
    if (theme === 'red') {
      r = Math.round(lerp(255, 225, g));
      gg = Math.round(lerp(220, 29, g));
      b = Math.round(lerp(230, 72, g));
    } else {
      r = Math.round(lerp(230, 29, g));
      gg = Math.round(lerp(255, 185, g));
      b = Math.round(lerp(230, 84, g));
    }
    for (let ai = 0; ai <= A_STEPS; ai++) {
      out.push(`rgba(${r},${gg},${b},${(ai / A_STEPS).toFixed(3)})`);
    }
  }
  return out;
}

function ThinkingOrbCanvas({ themeColor = 'green' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(CANVAS * dpr);
    canvas.height = Math.round(CANVAS * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = buildPalette(themeColor);
    const CP = Math.cos(0.35), SP = Math.sin(0.35), C0 = CANVAS / 2;
    let time = 0, raf = 0, last = performance.now();

    const draw = (dt) => {
      ctx.clearRect(0, 0, CANVAS, CANVAS);
      time += dt;
      const yaw = time * 0.9, cyw = Math.cos(yaw), syw = Math.sin(yaw);

      const SX = new Float32Array(N), SY = new Float32Array(N), SR = new Float32Array(N), SD = new Float32Array(N);
      const SC = new Int16Array(N);

      for (let n = 0; n < N; n++) {
        const dx = DX[n], dy = DY[n], dz = DZ[n], u = DU[n];
        const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
        const y2 = dy * CP - z1 * SP, z2 = dy * SP + z1 * CP;
        const f = 2.8 / (2.8 - z2), depth = (z2 + 1) / 2;
        const ox = x1 * ORB_R * f, oy = -y2 * ORB_R * f;

        const pulse = 0.5 + 0.5 * Math.sin(time * 3 + u * 4);
        let a = 0.2 + 0.5 * depth + 0.3 * pulse;
        if (a > 1) a = 1;

        SX[n] = C0 + ox;
        SY[n] = C0 + oy;
        SD[n] = depth;
        SR[n] = (1.2 * (0.5 + 0.75 * depth) * f) * (0.8 + 0.2 * pulse);

        const ai = Math.round(a * 48), gi = Math.round(depth * 24);
        SC[n] = ai <= 0 ? -1 : gi * 49 + ai;
      }

      for (let pass = 0; pass < 2; pass++) {
        for (let n = 0; n < N; n++) {
          const c = SC[n];
          if (c < 0) continue;
          if ((SD[n] >= 0.5) !== (pass === 1)) continue;
          ctx.fillStyle = colors[c] || `rgba(255,255,255,0.7)`;
          ctx.beginPath();
          ctx.arc(SX[n], SY[n], SR[n], 0, TAU);
          ctx.fill();
        }
      }
    };

    const frame = (now) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [themeColor]);

  return (
    <div className="relative w-[220px] h-[220px] flex items-center justify-center">
      <div 
        className={`absolute inset-4 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none ${
          themeColor === 'red' ? 'bg-rose-500' : 'bg-[#1db954]'
        }`} 
      />
      <canvas ref={canvasRef} className="w-[220px] h-[220px] relative z-10" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <img 
          src="/nefrasense.png" 
          alt="NefraSense Logo" 
          className="w-12 h-12 object-contain opacity-90 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] animate-pulse" 
        />
      </div>
    </div>
  );
}

/* ───────────────────────────── NefraSense Full-Screen Advisor ───────────────────────────── */
export function NefraSenseFloatingAdvisor({
  activePortal = 'creator',
  activeRoute = 'directory',
  creators = [],
  campaigns = [],
  activeCreator = null,
  activeCampaign = null,
  currentUser = null,
  creatorCredits = 50,
  brandCredits = 250,
  onDeductCredits = null,
  onDeductBrandCredits = null,
  onOpenTopup = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'thinking' | 'answered'
  const [thinkingLabel, setThinkingLabel] = useState('Searching live web & trends...');
  const [answer, setAnswer] = useState('');
  const [copied, setCopied] = useState(false);

  // Firestore History State (strictly Firestore - zero localStorage or RAM caching)
  const [historySessions, setHistorySessions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'creator' | 'brand'

  // Dragging & Minimize State - Prevents blocking normal UI and input actions
  const [position, setPosition] = useState(null); // { x: number, y: number } in px from viewport top-left
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => activeRoute === 'messages');
  const dragRef = useRef({ startX: 0, startY: 0, initialPosX: 0, initialPosY: 0, hasMoved: false });
  const asideRef = useRef(null);

  // Auto-minimize when on full-screen input views like 'messages' (chat)
  useEffect(() => {
    if (activeRoute === 'messages') {
      setIsMinimized(true);
    }
  }, [activeRoute]);

  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isCreator = activePortal === 'creator';
  const themeColor = isCreator ? 'red' : 'green';
  const currentCredits = isCreator ? creatorCredits : brandCredits;

  const handleDragStart = (e) => {
    // Only drag with left mouse button or touch
    if (e.button !== undefined && e.button !== 0) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const el = asideRef.current;
    const rect = el ? el.getBoundingClientRect() : { left: window.innerWidth - 200, top: window.innerHeight - 80 };

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: position ? position.x : rect.left,
      initialPosY: position ? position.y : rect.top,
      hasMoved: false
    };

    setIsDragging(true);

    const onMove = (moveEvt) => {
      const curX = moveEvt.type.includes('touch') ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const curY = moveEvt.type.includes('touch') ? moveEvt.touches[0].clientY : moveEvt.clientY;
      const dx = curX - dragRef.current.startX;
      const dy = curY - dragRef.current.startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragRef.current.hasMoved = true;
      }

      const nextX = Math.min(Math.max(12, dragRef.current.initialPosX + dx), window.innerWidth - (isMinimized ? 60 : 180));
      const nextY = Math.min(Math.max(12, dragRef.current.initialPosY + dy), window.innerHeight - 60);

      setPosition({ x: nextX, y: nextY });
    };

    const onEnd = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
  };

  const handleFabClick = () => {
    if (dragRef.current.hasMoved) {
      dragRef.current.hasMoved = false;
      return;
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };


  // Real-time live Firestore subscription (Strictly cloud-fetched, no localStorage or RAM cache)
  useEffect(() => {
    setIsLoadingHistory(true);
    const unsubscribe = subscribeToNefraSenseHistoryFromFirestore(
      (items) => {
        setHistorySessions(items || []);
        setIsLoadingHistory(false);
      },
      {
        userId: currentUser?.uid || null,
        limitCount: 50
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser]);

  // Auto-scroll answer container to top on new answer
  useEffect(() => {
    if (status === 'answered' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [status]);

  // Auto-focus input whenever advisor is opened or reset to idle
  useEffect(() => {
    if (isOpen && status === 'idle' && !showHistoryView) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, status, showHistoryView]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K to toggle, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape' && isOpen) {
        if (showHistoryView) {
          setShowHistoryView(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showHistoryView]);

  // Dynamic suggested queries with icons
  const creatorSuggestions = [
    { text: "Surging YouTube tags and topics in Tech this week", icon: Flame, color: "text-orange-400" },
    { text: "How to fix first 5-second retention drop-off", icon: Zap, color: "text-amber-400" },
    { text: "3 high-converting Shorts-to-Longform bridge concepts", icon: Clapperboard, color: "text-purple-400" },
    { text: "Current sponsor CPM benchmarks for dedicated videos", icon: DollarSign, color: "text-emerald-400" }
  ];

  const brandSuggestions = [
    { text: "Which creators give the highest ROI for $2,500 budget?", icon: Target, color: "text-emerald-400" },
    { text: "Compare top 2 tech creators with brand safety > 95%", icon: Scale, color: "text-cyan-400" },
    { text: "How to structure milestones for 3 sponsored videos", icon: ShieldCheck, color: "text-rose-400" },
    { text: "Recommended budget split between Shorts & Dedicated", icon: TrendingUp, color: "text-blue-400" }
  ];

  const activeSuggestions = isCreator ? creatorSuggestions : brandSuggestions;

  // Thinking label cycler
  useEffect(() => {
    if (status !== 'thinking') return;
    const labels = isCreator
      ? [
          "Searching live web & algorithmic trends...",
          "Analyzing viewer hook retention heuristics...",
          "Grounding with Google Cloud Vertex AI...",
          "Composing actionable creator strategy..."
        ]
      : [
          "Querying live Cloud Firestore creator telemetry...",
          "Evaluating creator ROI & audience reach models...",
          "Grounding with Google Cloud Vertex AI...",
          "Formulating verified campaign recommendations..."
        ];

    let i = 0;
    setThinkingLabel(labels[0]);
    const interval = setInterval(() => {
      i = (i + 1) % labels.length;
      setThinkingLabel(labels[i]);
    }, 1200);

    return () => clearInterval(interval);
  }, [status, isCreator]);

  const handleExecuteSearch = async (textToSubmit) => {
    const q = (textToSubmit || query).trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }

    if (currentCredits < 2) {
      alert(`Insufficient credits (${currentCredits} remaining). NefraSense queries cost 2 credits. Please top up your wallet.`);
      if (onOpenTopup) onOpenTopup();
      return;
    }

    setShowHistoryView(false);
    setQuery(q);
    setStatus('thinking');
    setAnswer('');

    // Deduct 2 credits via Firestore
    if (isCreator && onDeductCredits) {
      onDeductCredits(2, 'NefraSense AI Trend Analysis');
    } else if (!isCreator && onDeductBrandCredits) {
      onDeductBrandCredits(2, 'NefraSense AI Strategic Consultation');
    }

    try {
      let result = '';
      if (isCreator) {
        result = await askCreatorTrendsAdvisor(
          q,
          activeCreator || {
            name: 'Alex Rivera',
            category: 'Technology & AI',
            subscribersFormatted: '420K',
            bio: 'Deep-dive AI workflows and developer engineering channel'
          },
          { channelStats: activeCreator?.youtube || {} }
        );
      } else {
        const currentCampaign = activeCampaign || campaigns[0] || {
          title: 'Q2 Tech Product Launch',
          budgetCents: 250000,
          category: 'Tech'
        };
        result = await askNefraSense(q, currentCampaign, { creators });
      }

      setAnswer(result);
      setStatus('answered');

      // Persist directly to Cloud Firestore (zero localStorage or RAM caching)
      if (result && !result.includes('Unable to complete request')) {
        saveNefraSenseHistoryToFirestore({
          query: q,
          answer: result,
          portal: activePortal,
          userId: currentUser?.uid || activeCreator?.id || 'anonymous',
          userEmail: currentUser?.email || null
        }).catch((err) => {
          console.warn('[NefraSense History] Firestore save notice:', err);
        });
      }
    } catch (err) {
      console.error('[NefraSense] Search error:', err);
      setAnswer('Unable to complete request. Please try again or verify your connection.');
      setStatus('answered');
    }
  };

  const handleReset = () => {
    setQuery('');
    setAnswer('');
    setStatus('idle');
    setShowHistoryView(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCopy = () => {
    if (!answer) return;
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectHistorySession = (session) => {
    setQuery(session.query || '');
    setAnswer(session.answer || '');
    setStatus('answered');
    setShowHistoryView(false);
  };

  const handleDeleteHistorySession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteNefraSenseHistoryItemFromFirestore(sessionId);
    } catch (err) {
      console.error('[NefraSense History] Failed to delete session document:', err);
    }
  };

  const handleManualHistoryRefresh = async () => {
    setIsLoadingHistory(true);
    try {
      const items = await fetchNefraSenseHistoryFromFirestore({
        userId: currentUser?.uid || null,
        limitCount: 50
      });
      setHistorySessions(items);
    } catch (err) {
      console.error('[NefraSense History] Manual Firestore fetch error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const formatRelativeTime = (timestamp, createdAt) => {
    const t = timestamp || (createdAt ? new Date(createdAt).getTime() : null);
    if (!t) return 'Recent';
    const diff = Math.max(0, Date.now() - t);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const filteredHistorySessions = historySessions.filter(s => {
    if (historyFilter === 'creator') return s.portal === 'creator';
    if (historyFilter === 'brand') return s.portal === 'brand';
    return true;
  });

  return (
    <>
      {/* ── FULL-SCREEN SEARCH / CHAT OVERLAY (NO FRAME, NEUTRAL BACKGROUND, COLORED BORDER ONLY) ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-black/85 transition-all duration-200 select-none animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="NefraSense Search & Advisor"
        >
          {/* Main Search & Chat Card */}
          <div 
            className={`w-full max-w-5xl sm:w-[94vw] lg:w-[88vw] xl:max-w-6xl rounded-2xl bg-[#09090b]/95 backdrop-blur-3xl border-2 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative ${
              isCreator 
                ? 'border-rose-500/80 shadow-[0_0_60px_rgba(225,29,72,0.3)]' 
                : 'border-[#1db954]/80 shadow-[0_0_60px_rgba(29,185,84,0.3)]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Small Subtle Watermark Logo in Dialog Background */}
            <div 
              className="absolute right-6 bottom-12 pointer-events-none select-none z-0 opacity-[0.07] transition-opacity duration-300"
              aria-hidden="true"
            >
              <img 
                src="/nefrasense.png" 
                alt="" 
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain" 
              />
            </div>

            {/* Top Indicator Header (No frame/window bar - just clean portal badge and close icon) */}
            <div className="px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  <img 
                    src="/nefrasense.png" 
                    alt="NefraSense Logo" 
                    className="w-5 h-5 object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" 
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isCreator ? 'NefraSense AI • YouTube Trends & Retention Advisor' : 'NefraSense AI • Influencer Strategic RAG Advisor'}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isCreator ? 'border border-rose-500/40 text-rose-300 bg-transparent' : 'border border-[#1db954]/40 text-[#1ed760] bg-transparent'
                }`}>
                  {isCreator ? 'Live Google Search' : 'Firestore RAG'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Remaining Credit Amount Badge */}
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                  isCreator
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-[#1db954]/10 border-[#1db954]/30 text-[#1ed760]'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{currentCredits} Credits Remaining</span>
                </div>

                {/* Direct Firestore History Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowHistoryView(!showHistoryView)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    showHistoryView
                      ? isCreator 
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(225,29,72,0.3)]' 
                        : 'bg-[#1db954]/25 text-[#1ed760] border border-[#1db954]/50 shadow-[0_0_12px_rgba(29,185,84,0.3)]'
                      : 'text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-white/[0.04]'
                  }`}
                  title="View Cloud Firestore Session History"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                  {historySessions.length > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isCreator ? 'bg-rose-500/40 text-rose-200' : 'bg-[#1db954]/40 text-emerald-100'
                    }`}>
                      {historySessions.length}
                    </span>
                  )}
                </button>

                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  ESC to close
                </kbd>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close advisor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── CONDITIONAL BODY: FIRESTORE HISTORY PANEL OR CHAT/SEARCH ── */}
            {showHistoryView ? (
              /* DEDICATED CLOUD FIRESTORE HISTORY VIEW (Zero localStorage / Zero RAM mock) */
              <div className="p-6 sm:p-7 min-h-[360px] max-h-[72vh] overflow-y-auto space-y-4 relative z-10">
                {/* History Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-xl flex items-center justify-center shrink-0 ${
                      isCreator ? 'bg-rose-950/40 border border-rose-500/30' : 'bg-emerald-950/40 border border-[#1db954]/30'
                    }`}>
                      <img src="/nefrasense.png" alt="NefraSense" className="w-5 h-5 object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          NefraSense Cloud History
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/40 text-emerald-300 bg-emerald-950/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Firestore Stream
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Sessions queried and synchronized directly from Cloud Firestore (no local storage cache)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleManualHistoryRefresh}
                      disabled={isLoadingHistory}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 transition-colors cursor-pointer"
                      title="Refresh directly from Firestore"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin text-zinc-300' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowHistoryView(false)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCreator ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-[#1db954] text-black hover:bg-[#1ed760]'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Advisor</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      historyFilter === 'all'
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    All Sessions ({historySessions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('creator')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      historyFilter === 'creator'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    Creator ({historySessions.filter(s => s.portal === 'creator').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('brand')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      historyFilter === 'brand'
                        ? 'bg-[#1db954]/20 text-[#1ed760] border border-[#1db954]/40'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    Brand ({historySessions.filter(s => s.portal === 'brand').length})
                  </button>
                </div>

                {/* Sessions List */}
                {isLoadingHistory && historySessions.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-zinc-500" />
                    <p className="text-xs text-zinc-400">Streaming history straight from Cloud Firestore...</p>
                  </div>
                ) : filteredHistorySessions.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">No Firestore Sessions Found</h4>
                      <p className="text-xs text-zinc-400 max-w-sm">
                        Ask any question in the advisor to generate actionable strategies. Every session is automatically stored in your Cloud Firestore ledger.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredHistorySessions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistorySession(item)}
                        className={`p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-200 cursor-pointer group flex flex-col gap-2 ${
                          item.portal === 'creator'
                            ? 'hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(225,29,72,0.12)]'
                            : 'hover:border-[#1db954]/60 hover:shadow-[0_0_20px_rgba(29,185,84,0.12)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              item.portal === 'creator'
                                ? 'border border-rose-500/40 text-rose-300 bg-rose-950/30'
                                : 'border border-[#1db954]/40 text-[#1ed760] bg-emerald-950/30'
                            }`}>
                              {item.portal === 'creator' ? 'Creator Strategy' : 'Brand RAG Match'}
                            </span>
                            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(item.timestamp, item.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteHistorySession(e, item.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="Delete session from Firestore"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="p-1 text-zinc-500 group-hover:text-white transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-white group-hover:text-zinc-100 leading-snug">
                          "{item.query}"
                        </h4>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {item.answer ? item.answer.replace(/[#*`_]/g, '') : 'No assessment snippet available.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Input Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteSearch();
                  }}
                  className="p-4 sm:p-5 flex items-center gap-3 border-b border-white/[0.06] shrink-0 relative z-10"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isCreator ? 'text-rose-400' : 'text-[#1ed760]'
                  }`}>
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isCreator ? "Ask anything about YouTube trends, tags, or retention hooks…" : "Ask anything about creator ROI, budget splits, or escrow…"}
                    disabled={status === 'thinking'}
                    className="w-full bg-transparent text-white placeholder:text-zinc-500 text-sm sm:text-base font-medium outline-none border-none focus:ring-0"
                  />

                  {query.trim().length > 0 && status !== 'thinking' && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        inputRef.current?.focus();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0"
                      title="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <span className="text-[11px] font-medium text-zinc-400 hidden sm:inline-block shrink-0">
                    Costs 2 credits • <span className={currentCredits < 2 ? 'text-amber-400 font-bold' : 'text-zinc-200 font-semibold'}>{currentCredits} remaining</span>
                  </span>

                  <button
                    type="submit"
                    disabled={!query.trim() || status === 'thinking'}
                    className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      query.trim() && status !== 'thinking'
                        ? isCreator
                          ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-900/40'
                          : 'bg-[#1db954] text-black hover:bg-[#1ed760] shadow-md shadow-[#1db954]/30'
                        : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                    }`}
                    title={`Send query (Costs 2 credits • ${currentCredits} remaining)`}
                    aria-label={`Send query (Costs 2 credits • ${currentCredits} remaining)`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* State Area: Thinking, Answered, or Idle Suggestions */}
                {/* Note: Do NOT use justify-center on this scrollable container because flex centering clips overflowing top content into negative scroll space! */}
                <div 
                  ref={scrollContainerRef}
                  className="p-6 sm:p-7 min-h-[260px] max-h-[70vh] overflow-y-auto relative z-10"
                >
                  {/* 1. THINKING STATE: Animated 3D Dotted Canvas Orb + Cycling Status */}
                  {status === 'thinking' && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] py-10 space-y-5 text-center animate-in fade-in">
                      <ThinkingOrbCanvas themeColor={themeColor} />
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                          isCreator ? 'bg-rose-500' : 'bg-[#1db954]'
                        }`} />
                        <span className="text-sm font-medium text-zinc-300">
                          {thinkingLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. ANSWERED STATE: Markdown Renderer with Crystal-Clear Formatting */}
                  {status === 'answered' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="sticky -top-6 bg-[#09090b]/95 backdrop-blur-md z-10 flex items-center justify-between pb-3 pt-1 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          <img src="/nefrasense.png" alt="NefraSense" className="w-4 h-4 object-contain inline-block" />
                          <span>Strategic Assessment</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 transition-all cursor-pointer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>New Question</span>
                          </button>
                        </div>
                      </div>

                      {/* Render formatted markdown */}
                      <div className="py-2 pr-1">
                        <MarkdownRenderer content={answer} />
                      </div>
                    </div>
                  )}

                  {/* 3. IDLE STATE: Suggested Prompts & Recent Cloud History */}
                  {status === 'idle' && (
                    <div className="space-y-5 py-2">
                      <div className="space-y-3">
                        <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-500 block">
                          Suggested Queries
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeSuggestions.map((s, idx) => {
                            const SuggestionIcon = s.icon;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setQuery(s.text);
                                  handleExecuteSearch(s.text);
                                }}
                                className={`p-3 rounded-xl text-left text-xs sm:text-sm text-zinc-300 hover:text-white border border-zinc-800/80 bg-zinc-900/40 transition-all cursor-pointer flex items-center justify-between group ${
                                  isCreator 
                                    ? 'hover:border-rose-500/70 hover:shadow-[0_0_15px_rgba(225,29,72,0.15)]' 
                                    : 'hover:border-[#1db954]/70 hover:shadow-[0_0_15px_rgba(29,185,84,0.15)]'
                                }`}
                              >
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  {SuggestionIcon && <SuggestionIcon className={`w-4 h-4 shrink-0 ${s.color}`} />}
                                  <span className="line-clamp-2 leading-relaxed">{s.text}</span>
                                </div>
                                <CornerDownLeft className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0 ml-2" />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recent Sessions directly from Cloud Firestore */}
                      {historySessions.length > 0 && (
                        <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                              <Database className="w-3 h-3 text-emerald-400" />
                              Recent Cloud Sessions (Firestore)
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowHistoryView(true)}
                              className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>View all ({historySessions.length})</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {historySessions.slice(0, 2).map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectHistorySession(item)}
                                className={`p-3 rounded-xl text-left border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all cursor-pointer flex items-center justify-between group ${
                                  item.portal === 'creator'
                                    ? 'hover:border-rose-500/70'
                                    : 'hover:border-[#1db954]/70'
                                }`}
                              >
                                <div className="truncate pr-2">
                                  <span className="text-xs font-semibold text-zinc-200 block truncate group-hover:text-white">
                                    "{item.query}"
                                  </span>
                                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {formatRelativeTime(item.timestamp, item.createdAt)}
                                  </span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bottom Keyboard Hint Bar */}
            <div className="px-6 py-2.5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] text-zinc-500 shrink-0">
              <span className="flex items-center gap-2">
                <img src="/nefrasense.png" alt="NefraSense" className="w-4 h-4 object-contain inline-block" />
                <span>NefraSense Cognitive Intelligence Engine</span>
                <span className="text-zinc-600">•</span>
                <span className={currentCredits < 2 ? 'text-amber-400 font-semibold' : 'text-zinc-400 font-medium'}>
                  Query costs 2 credits ({currentCredits} remaining)
                </span>
              </span>
              <span>Press <kbd className="font-mono text-zinc-400">↵ Enter</kbd> to submit</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ALWAYS-ON-TOP FLOATING ACTION BUTTON (DRAGGABLE & MINIMIZABLE) ── */}
      <aside 
        ref={asideRef}
        aria-label="NefraSense AI Trigger"
        style={position ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' } : undefined}
        className={`fixed z-40 select-none transition-all duration-200 ${
          position ? '' : activeRoute === 'messages' ? 'bottom-28 right-5' : 'bottom-5 right-5'
        }`}
      >
        {isMinimized ? (
          /* Compact 44px Round Orb Button - Stays unobtrusively out of the way */
          <div className="relative group flex items-center">
            {!isOpen && (
              <span 
                className={`absolute -inset-1 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse ${
                  isCreator ? 'bg-rose-500/40' : 'bg-[#1db954]/40'
                }`} 
                aria-hidden="true" 
              />
            )}
            <button
              type="button"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              onClick={handleFabClick}
              className={`relative w-11 h-11 rounded-full border-2 shadow-2xl flex items-center justify-center p-1.5 transition-all duration-300 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing ${
                isCreator 
                  ? 'bg-[#0c0c0e] border-rose-500 shadow-rose-950/60 hover:border-rose-400' 
                  : 'bg-[#0c0c0e] border-[#1db954] shadow-[#1db954]/40 hover:border-[#1ed760]'
              }`}
              title={`NefraSense AI (${currentCredits} credits) • Click to open • Drag to move`}
              aria-label="Open NefraSense Search (⌘K)"
            >
              <img 
                src="/nefrasense.png" 
                alt="NefraSense" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] pointer-events-none" 
              />
              <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0c0c0e] ${
                isCreator ? 'bg-rose-400' : 'bg-[#1ed760]'
              }`} />
            </button>

            {/* Expand button on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              title="Expand NefraSense button"
              className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
            >
              <Maximize2 size={10} />
            </button>
          </div>
        ) : (
          /* Full Interactive Pill with Drag Handle and Minimize Button */
          <div className="relative group flex items-center">
            {!isOpen && (
              <span 
                className={`absolute -inset-0.5 rounded-full blur-md opacity-60 group-hover:opacity-90 transition duration-500 animate-pulse ${
                  isCreator ? 'bg-rose-500/40' : 'bg-[#1db954]/40'
                }`} 
                aria-hidden="true" 
              />
            )}

            <div
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              onClick={handleFabClick}
              className={`group/btn relative flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-full border-2 shadow-2xl transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.99] cursor-grab active:cursor-grabbing ${
                isOpen
                  ? 'bg-zinc-900 border-zinc-600 text-zinc-300 shadow-black/80'
                  : isCreator
                    ? 'bg-[#0c0c0e] border-rose-500 text-white shadow-rose-950/60 hover:border-rose-400'
                    : 'bg-[#0c0c0e] border-[#1db954] text-white shadow-[#1db954]/30 hover:border-[#1ed760]'
              }`}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close Search" : "Open Search (⌘K)"}
            >
              {/* Drag Handle Indicator */}
              <div 
                className="text-zinc-600 group-hover/btn:text-zinc-400 cursor-grab active:cursor-grabbing transition-colors -mr-0.5"
                title="Drag to reposition anywhere"
              >
                <GripVertical size={13} />
              </div>

              {/* NefraSense Logo Emblem Badge */}
              <div className={`relative w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md p-1 ${
                isCreator 
                  ? 'bg-rose-950/80 border border-rose-500/50 group-hover/btn:border-rose-400' 
                  : 'bg-emerald-950/80 border border-[#1db954]/50 group-hover/btn:border-[#1ed760]'
              }`}>
                <img 
                  src="/nefrasense.png" 
                  alt="NefraSense Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] pointer-events-none" 
                />
              </div>

              <div className="relative text-left pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight text-white">
                    NefraSense
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    isCreator ? 'bg-rose-400' : 'bg-[#1ed760]'
                  }`} />
                </div>
                <span className="text-[10px] text-zinc-400 font-medium block leading-none mt-0.5">
                  {isCreator ? 'Trends Advisor' : 'Strategic Advisor'} • <strong className="text-zinc-300 font-semibold">{currentCredits} cr</strong>
                </span>
              </div>

              <kbd className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 border bg-white/[0.08] border-white/[0.15] text-zinc-300 font-mono pointer-events-none">
                ⌘K
              </kbd>

              {/* Minimize button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors ml-0.5 cursor-pointer"
                title="Minimize button so it never covers inputs"
                aria-label="Minimize button"
              >
                <Minus size={13} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
