import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { askNefraSense } from '../../packages/ai/geminiClient';
import { deduplicateCreators, formatCents } from '../../lib/utils';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  Zap, 
  BarChart3, 
  Target, 
  Lightbulb,
  Briefcase,
  AtSign,
  X
} from 'lucide-react';

export function NefraSenseAdvisor({ 
  campaigns = [], 
  creators = [],
  brandCredits = 250,
  onDeductBrandCredits,
  onOpenTopup
}) {
  const activeCampaign = campaigns[0] || { title: "AI Developer Tool Showcase", budgetCents: 250000, category: "Tech" };

  // Ensure 100% unique, deduplicated creators
  const validCreators = deduplicateCreators(
    (creators || []).filter(c => c.id !== 'creator_01' || c.youtubeConnected)
  );

  const c1 = validCreators[0] || { name: "Elena Rostova", handle: "@elenacodes" };
  const c2 = validCreators.find(c => 
    c.id !== c1.id && 
    (c.handle ? c.handle.toLowerCase() !== c1.handle?.toLowerCase() : true) &&
    (c.name ? c.name.toLowerCase() !== c1.name?.toLowerCase() : true)
  ) || { name: "Marcus Vance", handle: "@marcustech" };

  const [showRAGContext, setShowRAGContext] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am NefraSense, your Vertex AI-powered influencer marketing strategist. I am grounded directly with your live Cloud Firestore database containing ${validCreators.length > 0 ? validCreators.length : 'verified'} creator telemetry records.\n\nTip: You can type "@" at any time to select a specific gig/campaign from your workspace, and I will tailor my recommendations, ROI models, and creator matching specifically to that gig!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // @ Gig Auto-Suggest State
  const [attachedGig, setAttachedGig] = useState(null);
  const [showGigSuggestions, setShowGigSuggestions] = useState(false);
  const [gigSearchQuery, setGigSearchQuery] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filtered campaigns for @ auto-suggest
  const filteredGigs = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [];
    if (!gigSearchQuery) return campaigns;
    const q = gigSearchQuery.toLowerCase();
    return campaigns.filter(c => 
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.brandName?.toLowerCase().includes(q)
    );
  }, [campaigns, gigSearchQuery]);

  // Click outside to close auto-suggest popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowGigSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setInputText(value);

    // Detect if user typed @
    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const queryAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Ensure there are no newlines or closing brackets in between
      if (!queryAfterAt.includes('\n') && !queryAfterAt.includes(';')) {
        setGigSearchQuery(queryAfterAt.trim());
        setShowGigSuggestions(true);
        setSelectedSuggestionIndex(0);
        return;
      }
    }

    setShowGigSuggestions(false);
  };

  const handleSelectGig = (gig) => {
    setAttachedGig(gig);
    setShowGigSuggestions(false);

    // Replace @query with @GigTitle
    if (inputRef.current) {
      const cursorPos = inputRef.current.selectionStart || inputText.length;
      const textBeforeCursor = inputText.slice(0, cursorPos);
      const textAfterCursor = inputText.slice(cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');

      if (lastAtIndex !== -1) {
        const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${gig.title} ` + textAfterCursor;
        setInputText(newText);
      } else {
        setInputText(prev => `${prev} @${gig.title} `);
      }
    } else {
      setInputText(prev => `${prev} @${gig.title} `);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleInputKeyDown = (e) => {
    if (showGigSuggestions && filteredGigs.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev + 1) % filteredGigs.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev - 1 + filteredGigs.length) % filteredGigs.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelectGig(filteredGigs[selectedSuggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowGigSuggestions(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const effectiveGig = attachedGig || activeCampaign;

  const quickPills = [
    { 
      label: `ROI for ${effectiveGig?.title ? `"${effectiveGig.title.slice(0, 20)}..."` : 'Gig'}`, 
      icon: Zap,
      prompt: `How should I allocate my $${((effectiveGig?.budgetCents || 250000) / 100).toLocaleString()} budget between dedicated video vs YouTube Shorts for @${effectiveGig?.title}?` 
    },
    { 
      label: `Best Fit for ${effectiveGig?.category || 'Tech'}`, 
      icon: Target,
      prompt: `Which verified creators in our database best fit our gig @${effectiveGig?.title} (${formatCents(effectiveGig?.budgetCents)})?` 
    },
    { 
      label: `Compare ${c1.name.split(' ')[0]} vs ${c2.name.split(' ')[0]}`, 
      icon: BarChart3,
      prompt: `Compare ${c1.name} (${c1.handle}) and ${c2.name} (${c2.handle}) for @${effectiveGig?.title} — who drives higher conversion?` 
    },
    { 
      label: "High-Retention Hooks", 
      icon: Lightbulb,
      prompt: `Draft 3 catchy 5-second video hooks tailored for @${effectiveGig?.title}.` 
    }
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    if (typeof brandCredits === 'number' && brandCredits < 10) {
      if (onOpenTopup) {
        onOpenTopup();
      } else {
        alert('Insufficient Brand Credits. You need 10 Brand Credits to run a NefraSense strategic analysis. Please top up your business wallet.');
      }
      return;
    }

    // Determine targeted gig:
    let targetedGig = attachedGig;
    if (!targetedGig && campaigns.length > 0) {
      // Check if text has @GigName or matches any campaign title
      for (const camp of campaigns) {
        if (
          text.toLowerCase().includes(`@${camp.title.toLowerCase()}`) ||
          text.toLowerCase().includes(camp.title.toLowerCase())
        ) {
          targetedGig = camp;
          break;
        }
      }
    }

    const finalGig = targetedGig || activeCampaign;

    if (onDeductBrandCredits) {
      onDeductBrandCredits(10, `NefraSense AI - "${text.slice(0, 30)}..."`);
    }

    const userMsg = { 
      role: 'user', 
      text,
      attachedGig: targetedGig ? {
        id: targetedGig.id,
        title: targetedGig.title,
        budgetCents: targetedGig.budgetCents,
        category: targetedGig.category,
        modality: targetedGig.modality
      } : null
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setShowGigSuggestions(false);
    setIsThinking(true);

    try {
      const reply = await askNefraSense(text, finalGig, { 
        creators,
        isTaggedGig: Boolean(targetedGig)
      });
      setMessages(prev => [...prev, { role: 'assistant', text: reply, attachedGig: userMsg.attachedGig }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI advisor. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Option 1 RAG status & Guardrails */}
      <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <img src="/nefrasense.png" alt="NefraSense Logo" className="w-6 h-6 object-contain" />
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              NefraSense strategic advisor
            </h1>
            <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">Vertex AI Grounded</Badge>
            <Badge className="bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30 text-[10px]">Firestore RAG Live</Badge>
            <Badge className="bg-[#8b5cf6]/15 text-[#a78bfa] border-[#8b5cf6]/30 text-[10px] flex items-center space-x-1">
              <ShieldCheck size={10} className="mr-0.5" />
              <span>Creator Fame Guardrails</span>
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] flex items-center space-x-1">
              <Coins size={10} className="mr-0.5" />
              <span>10 credits/query • {brandCredits} remaining</span>
            </Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Real-time influencer marketing strategist grounded on live Cloud Firestore creator telemetry. Type <strong>@</strong> in the chat to select and discuss specific gigs!
          </p>
        </div>

        {/* Toggle RAG Grounding Context Drawer */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRAGContext(prev => !prev)}
          className="border-[#27272a] bg-[#18181b] text-xs text-[#fafafa] flex items-center space-x-2 hover:border-[#3b82f6] transition-colors self-start sm:self-auto"
        >
          <Database size={13} className="text-[#3b82f6]" />
          <span>RAG Context ({validCreators.length} Live Documents)</span>
          {showRAGContext ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </Button>
      </div>

      {/* RAG Context Live Drawer */}
      {showRAGContext && (
        <Card className="bg-[#121215] border border-[#3b82f6]/30 p-4 rounded-xl shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div className="flex items-center space-x-2">
              <Database size={15} className="text-[#3b82f6]" />
              <span className="text-xs font-semibold text-[#fafafa]">Cloud Firestore In-Context Snapshot</span>
              <Badge className="bg-[#3b82f6]/20 text-[#60a5fa] border-none text-[10px]">Option 1: In-Context Injection</Badge>
            </div>
            <span className="text-[11px] text-[#71717a]">
              Synchronized with Firebase / Firestore collection <code className="text-[#a1a1aa]">users/creators</code>
            </span>
          </div>

          <div className="flex items-start space-x-2 text-[11px] text-[#a1a1aa] bg-[#18181b] p-2.5 rounded-lg border border-[#27272a]">
            <ShieldCheck size={14} className="text-[#10b981] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#fafafa]">Creator Reputation & Fame Guardrails Active:</strong> All advisor outputs are strictly filtered under a Zero-Defamation policy. Comparisons celebrate each creator's strengths, target audience demographics, and delivery formats without derogatory framing or language disparagement.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {validCreators.map((creator) => (
              <div
                key={creator.id}
                className="p-2.5 rounded-lg bg-[#18181b] border border-[#27272a] flex flex-col justify-between space-y-1.5 hover:border-[#3b82f6]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#fafafa] truncate">{creator.name}</span>
                  <Badge className="bg-[#10b981]/15 text-[#10b981] border-none text-[9px] px-1.5 py-0">
                    AI {creator.aiScore || 88}
                  </Badge>
                </div>
                <div className="text-[11px] text-[#71717a] truncate">{creator.handle} • {creator.category}</div>
                <div className="flex items-center justify-between text-[10px] text-[#a1a1aa] pt-1 border-t border-[#27272a]/60">
                  <span>{creator.subscribersFormatted || `${creator.subscribers || 0}`} subs</span>
                  <span className="text-[#fafafa] font-semibold">
                    ${((creator.startingPriceCents || 85000) / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-2">
        {quickPills.map((pill, idx) => {
          const PillIcon = pill.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(pill.prompt)}
              className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] hover:border-[#e11d48] transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              {PillIcon && <PillIcon size={13} className="text-[#e11d48]" />}
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <Card className="flex flex-col h-[540px] p-0 overflow-hidden relative">
        {/* Subtle Watermark Logo in Background */}
        <div 
          className="absolute right-6 bottom-16 pointer-events-none select-none z-0 opacity-[0.06] transition-opacity duration-300"
          aria-hidden="true"
        >
          <img 
            src="/nefrasense.png" 
            alt="" 
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain" 
          />
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#27272a] text-[#fafafa]' : 'bg-[#e11d48]/20 border border-[#e11d48]/40 p-1'
                }`}>
                  {isUser ? <User size={14} /> : <img src="/nefrasense.png" alt="NefraSense" className="w-full h-full object-contain" />}
                </div>

                <div className={`p-3.5 rounded-lg max-w-[85%] text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-[#18181b] border border-[#27272a] text-[#fafafa]' 
                    : 'bg-[#000000] border border-[#27272a] text-[#d4d4d8]'
                }`}>
                  {/* Tagged Gig Header Pill if message targets a gig */}
                  {msg.attachedGig && (
                    <div className="mb-2 p-2 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-xs text-[#38bdf8] flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 truncate">
                        <Briefcase size={12} className="shrink-0 text-[#38bdf8]" />
                        <span className="font-semibold text-[11px] text-[#fafafa] truncate">
                          Referencing Gig: {msg.attachedGig.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#93c5fd] shrink-0 font-medium">
                        {formatCents(msg.attachedGig.budgetCents)}
                      </span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-[#27272a] flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#71717a]">
                      <div className="flex items-center space-x-1">
                        <Database size={11} className="text-[#3b82f6]" />
                        <span>Grounded on Cloud Firestore Telemetry</span>
                      </div>
                      <span className="text-[#3f3f46]">•</span>
                      <div className="flex items-center space-x-1">
                        <ShieldCheck size={11} className="text-[#10b981]" />
                        <span>Creator Fame Guardrails Enforced</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-[#71717a] pl-10">
              <Sparkles size={14} className="animate-pulse text-[#e11d48]" />
              <span>NefraSense is reasoning over live Firestore data...</span>
            </div>
          )}
        </div>

        {/* @ Gig Auto-Suggest Dropdown */}
        {showGigSuggestions && filteredGigs.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute left-3 right-3 bottom-16 bg-[#121215] border border-[#3b82f6]/40 rounded-xl shadow-2xl p-2 z-50 max-h-56 overflow-y-auto space-y-1 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center justify-between px-2 py-1 text-[10px] text-[#71717a] border-b border-[#27272a] mb-1">
              <span className="flex items-center gap-1 font-semibold text-[#38bdf8]">
                <Briefcase size={11} /> Select Gig Context (@mention)
              </span>
              <span>Use ↑↓ keys + Enter</span>
            </div>
            {filteredGigs.map((gig, idx) => (
              <div
                key={gig.id || idx}
                onClick={() => handleSelectGig(gig)}
                className={`px-2.5 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                  idx === selectedSuggestionIndex 
                    ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#fafafa]' 
                    : 'hover:bg-[#18181b] text-[#a1a1aa] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-[#27272a] text-[#38bdf8] shrink-0">
                    <Briefcase size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#fafafa] truncate">{gig.title}</p>
                    <p className="text-[10px] text-[#71717a] truncate">{gig.category} • {gig.modality?.toUpperCase()}</p>
                  </div>
                </div>
                <Badge variant="action" className="text-[10px] shrink-0 ml-2">
                  {formatCents(gig.budgetCents)}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 border-t border-[#27272a] bg-[#09090b] space-y-2">
          {/* Active Attached Gig Banner */}
          {attachedGig && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-lg text-xs text-[#38bdf8] animate-in fade-in">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-[#38bdf8] font-bold text-[11px] flex items-center gap-1 shrink-0">
                  <Briefcase size={12} /> Active Gig Context:
                </span>
                <span className="text-[#fafafa] font-semibold text-xs truncate">
                  {attachedGig.title}
                </span>
                <Badge variant="action" className="text-[9px] py-0 px-1.5 shrink-0">
                  {formatCents(attachedGig.budgetCents)}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setAttachedGig(null)}
                className="p-1 text-[#71717a] hover:text-[#ef4444] transition-colors shrink-0"
                title="Remove attached gig context"
              >
                <X size={13} />
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Quick @ Tag Gig Button */}
            <button
              type="button"
              onClick={() => {
                setShowGigSuggestions(true);
                setGigSearchQuery('');
                inputRef.current?.focus();
              }}
              className="h-9 px-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#38bdf8] hover:border-[#3b82f6] text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              title="Tag a gig with @"
            >
              <AtSign size={13} />
              <span className="hidden sm:inline text-[11px] font-normal text-[#a1a1aa]">Gig</span>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask anything or type '@' to select a specific gig..."
              className="flex-1 h-9 px-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#e11d48]"
            />
            <Button
              size="sm"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isThinking}
              className="space-x-1.5 shrink-0"
              title={`Send query (10 credits • ${brandCredits} remaining)`}
            >
              <Send size={14} />
              <span className="hidden sm:inline">Send (10 credits)</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
