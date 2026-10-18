import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { askNefraSense } from '../../packages/ai/geminiClient';
import { deduplicateCreators } from '../../lib/utils';
import { Sparkles, Send, Bot, User, Database, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Coins, Zap, BarChart3, Target, Lightbulb } from 'lucide-react';

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
  // Guarantee c2 is a completely distinct creator from c1
  const c2 = validCreators.find(c => 
    c.id !== c1.id && 
    (c.handle ? c.handle.toLowerCase() !== c1.handle?.toLowerCase() : true) &&
    (c.name ? c.name.toLowerCase() !== c1.name?.toLowerCase() : true)
  ) || { name: "Marcus Vance", handle: "@marcustech" };

  const [showRAGContext, setShowRAGContext] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am NefraSense, your Vertex AI-powered influencer marketing strategist. I am grounded directly with your live Cloud Firestore database containing ${validCreators.length > 0 ? validCreators.length : 'verified'} creator telemetry records.\n\nAsk me to compare candidates, evaluate reach, or optimize your campaign budget!`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPills = [
    { 
      label: "Optimize Campaign ROI", 
      icon: Zap,
      prompt: `How should I allocate my $${((activeCampaign.budgetCents || 250000) / 100).toLocaleString()} budget between dedicated video vs YouTube Shorts?` 
    },
    { 
      label: `Compare ${c1.name.split(' ')[0]} vs ${c2.name.split(' ')[0]}`, 
      icon: BarChart3,
      prompt: `Compare ${c1.name} (${c1.handle}) and ${c2.name} (${c2.handle}) — who drives higher technical conversion?` 
    },
    { 
      label: `Best Fit for ${activeCampaign.category || 'Tech'}`, 
      icon: Target,
      prompt: `Which verified creators in our database best fit our campaign budget and category?` 
    },
    { 
      label: "High-Retention Hooks", 
      icon: Lightbulb,
      prompt: `Draft 3 catchy 5-second video hooks tailored for ${activeCampaign.title}.` 
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

    if (onDeductBrandCredits) {
      onDeductBrandCredits(10, `NefraSense AI - "${text.slice(0, 30)}..."`);
    }

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const reply = await askNefraSense(text, activeCampaign, { creators });
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
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
            Real-time influencer marketing strategist grounded on live Cloud Firestore creator telemetry, protected by zero-defamation ethical guardrails.
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

          <p className="text-[11px] text-[#a1a1aa] my-3 leading-relaxed">
            These verified creator records are actively injected into the Vertex AI prompt context window, grounding all recommendations in genuine YouTube performance metrics, 30-day views, multimodal AI quality scores, and starting rate cards.
          </p>

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
      <Card className="flex flex-col h-[520px] p-0 overflow-hidden relative">
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

        {/* Input Footer */}
        <div className="p-3 border-t border-[#27272a] bg-[#09090b] flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about campaign strategy, budget splits, or creator comparisons..."
            className="flex-1 h-9 px-3 rounded-lg bg-[#000000] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#e11d48]"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isThinking}
            className="space-x-1.5"
            title={`Send query (10 credits • ${brandCredits} remaining)`}
          >
            <Send size={14} />
            <span>Send (10 credits • {brandCredits} remaining)</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
