import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { askNefraSense } from '../../packages/ai/geminiClient';
import { Sparkles, Send, Bot, User } from 'lucide-react';

export function NefraSenseAdvisor({ campaigns = [] }) {
  const activeCampaign = campaigns[0] || { title: "AI Developer Tool Showcase", budgetCents: 250000 };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am NefraSense, your Vertex AI-powered influencer marketing strategist. I can help you optimize campaign budgets, compare candidate creator metrics, and generate viral video hooks.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickPills = [
    { label: "⚡ Optimize Campaign ROI", prompt: "How should I allocate my budget between dedicated video vs YouTube Shorts?" },
    { label: "📊 Compare Candidates", prompt: "Compare Creator A and Creator B — who drives higher technical conversion?" },
    { label: "💡 Creative Hooks", prompt: "Draft 3 catchy 5-second video hooks tailored to technical developers." },
    { label: "🤝 Deliverable Checklist", prompt: "What milestone breakdown and deliverable checklist do you recommend?" }
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const reply = await askNefraSense(text, activeCampaign);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI advisor. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
              NefraSense strategic advisor
            </h1>
            <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">Vertex AI (GCP Credits)</Badge>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Real-time influencer marketing strategist analyzing conversion rates, creator retention curves, and budget allocations.
          </p>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="flex flex-wrap gap-2">
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.prompt)}
            className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] hover:border-[#e11d48] transition-colors cursor-pointer"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <Card className="flex flex-col h-[480px] p-0 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#27272a] text-[#fafafa]' : 'bg-[#e11d48] text-white'
                }`}>
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={`p-3 rounded-lg max-w-[80%] text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-[#18181b] border border-[#27272a] text-[#fafafa]' 
                    : 'bg-[#000000] border border-[#27272a] text-[#a1a1aa]'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-[#71717a] pl-10">
              <Sparkles size={14} className="animate-pulse text-[#e11d48]" />
              <span>NefraSense is reasoning...</span>
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
            className="space-x-1"
          >
            <Send size={14} />
            <span>Send</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
