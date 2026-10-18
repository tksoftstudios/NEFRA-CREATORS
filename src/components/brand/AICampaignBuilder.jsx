import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input, Textarea, Select } from '../ui/Input';
import { buildJobCardWithGemini } from '../../packages/ai/geminiClient';
import { Sparkles, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PROMPTS = [
  "Looking for 2 tech creators to review our new AI developer IDE. Budget is $2,500, targeting young developers in JAPAC.",
  "Need a soulful acoustic singer or female vocalist to write an original song for our travel retreat in Sri Lanka. Budget $2,200.",
  "Seeking an esports pro gamer to test and benchmark our ultra-lightweight wireless gaming mouse. Budget $1,500.",
  "On-site technical vlogger needed to host our Tokyo DevCon keynote panel. Budget $9,500 with flight and hotel covered."
];

export function AICampaignBuilder({
  onPublishCampaign,
  onCancel,
  brandCredits = 250,
  onDeductBrandCredits,
  onOpenTopup
}) {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);

  // Form State for manual tuning
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology & AI');
  const [budgetDollars, setBudgetDollars] = useState('2500');
  const [modality, setModality] = useState('online');
  const [deadline, setDeadline] = useState('2026-11-25');
  const [targetCountries, setTargetCountries] = useState('US, UK, Singapore, Global');
  const [deliverablesText, setDeliverablesText] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (typeof brandCredits === 'number' && brandCredits < 15) {
      if (onOpenTopup) {
        onOpenTopup();
      } else {
        alert('Insufficient Brand Credits. You need 15 Brand Credits to generate an AI campaign brief. Please top up your business wallet.');
      }
      return;
    }

    setIsGenerating(true);
    try {
      if (onDeductBrandCredits) {
        onDeductBrandCredits(15, `AI Campaign Builder - "${prompt.slice(0, 30)}..."`);
      }

      const card = await buildJobCardWithGemini(prompt);
      setGeneratedCard(card);

      // Populate form
      setTitle(card.title || 'Sponsored Developer Showcase');
      setCategory(card.category || 'Technology & AI');
      setBudgetDollars(((card.budgetCents || 250000) / 100).toString());
      setModality(card.modality || 'online');
      setDeadline(card.deadline || '2026-11-25');
      setTargetCountries((card.targetCountries || ['Global']).join(', '));
      setDeliverablesText((card.deliverables || []).join('\n'));
      setDescription(card.keyMessage || 'Demonstrate high-speed developer workflows.');

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.3 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const budgetCents = Math.round((parseFloat(budgetDollars) || 0) * 100);
    const deliverables = deliverablesText.split('\n').filter(d => d.trim().length > 0);
    const countries = targetCountries.split(',').map(c => c.trim()).filter(Boolean);

    const newCampaign = {
      id: `camp_${Date.now()}`,
      brandOrgId: 'brand_acme',
      brandName: 'Acme Enterprise Corp',
      brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80',
      title,
      category,
      modality,
      budgetCents,
      escrowGuaranteed: true,
      deadline,
      targetCountries: countries.length ? countries : ['Global'],
      description,
      deliverables,
      deliverableType: deliverables[0] || 'Dedicated Video',
      bidsCount: 0,
      status: 'open'
    };

    onPublishCampaign(newCampaign);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            AI campaign job card builder
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Type your project goals in plain language. NEFRA AI converts it into a structured, agency-grade job card.
          </p>
        </div>
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs flex items-center space-x-1.5 self-start sm:self-auto px-3 py-1">
          <Coins size={12} className="text-amber-400" />
          <span>Cost: 15 Brand Credits • {brandCredits} remaining</span>
        </Badge>
      </div>

      {/* Prompt Input & 1-Click Inspirations */}
      <Card className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#fafafa]">Describe your campaign requirement</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. Looking for 2 tech creators to do an in-depth review of our new SaaS developer platform, budget $2,500..."
          />
        </div>

        <div>
          <p className="text-[10px] uppercase font-semibold text-[#71717a] mb-2">1-Click sample prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 text-[11px] rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46] transition-colors text-left"
              >
                {p.substring(0, 48)}...
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-[#a1a1aa] flex items-center gap-1.5">
            <Coins size={13} className="text-amber-400" />
            <span>Cost: 15 Brand Credits • <strong className="text-[#fafafa]">{brandCredits} credits remaining</strong></span>
          </span>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
            className="space-x-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            title={`Synthesize Job Card (15 credits • ${brandCredits} remaining)`}
          >
            <Sparkles size={14} />
            <span>{isGenerating ? "Synthesizing with AI..." : `Synthesize with AI (15 credits • ${brandCredits} remaining)`}</span>
          </Button>
        </div>
      </Card>

      {/* Generated & Editable Structured Job Card Form */}
      {generatedCard && (
        <form onSubmit={handlePublish} className="space-y-6 animate-in fade-in duration-200">
          <Card className="space-y-4 border-[#3b82f6]/40">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30 text-[10px]">Synthesized by NEFRA AI</Badge>
                <span className="text-xs text-[#a1a1aa]">Review &amp; customize before publishing</span>
              </div>
              <Badge variant="outline" className="text-[10px]">100% Escrow Backed</Badge>
            </div>

            <Input
              label="Campaign Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Budget (USD $)"
                type="number"
                min="100"
                value={budgetDollars}
                onChange={(e) => setBudgetDollars(e.target.value)}
                required
              />
              <Select
                label="Primary Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Technology & AI', label: 'Technology & AI' },
                  { value: 'Acoustic & Music', label: 'Acoustic & Music' },
                  { value: 'Gaming & Esports', label: 'Gaming & Esports' },
                  { value: 'Travel & Culinary', label: 'Travel & Culinary' }
                ]}
              />
              <Select
                label="Work Modality"
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                options={[
                  { value: 'online', label: 'Online / Remote' },
                  { value: 'hybrid', label: 'Hybrid (Hardware)' },
                  { value: 'physical', label: 'Physical (On-site)' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Turnaround Deadline (YYYY-MM-DD)"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
              <Input
                label="Target Whitelisted Countries (Comma-separated)"
                value={targetCountries}
                onChange={(e) => setTargetCountries(e.target.value)}
                placeholder="US, UK, Singapore, Global"
                required
              />
            </div>

            <Textarea
              label="Required Deliverables (One per line)"
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              rows={3}
              required
            />

            <Textarea
              label="Key Message & Call to Action"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
              <span className="text-xs text-[#71717a]">
                Budget will be pre-funded in escrow when a creator bid is accepted.
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" type="button" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  Publish campaign
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
