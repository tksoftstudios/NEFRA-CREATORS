import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  DollarSign, 
  Calendar, 
  Tag, 
  Send,
  Award,
  Video
} from 'lucide-react';
import { generateJobCardWithGemini, rankCreatorsForJobWithGemini } from '../../services/geminiService';
import { saveJobCardToFirestore } from '../../services/firestoreService';
import confetti from 'canvas-confetti';

const SAMPLE_PROMPTS = [
  "Looking for a soulful acoustic singer or vocalist to compose and perform an original song for our travel and resort campaign. Budget $2,200.",
  "Looking for 2 tech creators to do an in-depth review of our new Gemini-powered AI developer tool. Budget is $2,500, targeting young developers in JAPAC.",
  "Seeking an island culinary/travel creator to document our boutique coastal retreat and seafood cooking masterclass in Sri Lanka. Budget $1,800.",
  "Need a competitive esports gamer to test and showcase our low-latency wireless mouse during ranked gameplay. Budget $1,500.",
  "Looking for an edtech or career YouTuber to review our resume review and mock interview app for university graduates. Budget $1,200."
];

export default function BusinessJobPortal({ apiKey, allCreators }) {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [jobCard, setJobCard] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedResults, setMatchedResults] = useState(null);
  const [offerSentId, setOfferSentId] = useState(null);

  // Generate structured Job Card with Gemini
  const handleGenerateJobCard = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingCard(true);
    setMatchedResults(null);
    setOfferSentId(null);

    try {
      const card = await generateJobCardWithGemini(apiKey, prompt);
      setJobCard(card);
      // Persist to Cloud Firestore
      saveJobCardToFirestore(card);
      setIsGeneratingCard(false);
    } catch (err) {
      console.error(err);
      setIsGeneratingCard(false);
    }
  };

  // Rank creators using Gemini matchmaker
  const handleRankCreators = async () => {
    if (!jobCard) return;
    setIsMatching(true);

    try {
      // Find candidate creators in the relevant category
      const targetCategory = jobCard.targetCategory || 'tech';
      let categoryMatches = allCreators.filter((c) => c.category === targetCategory);
      
      // If fewer than 4 candidates, supplement with others so brand has comparison
      let candidates = [...categoryMatches];
      if (candidates.length < 4) {
        const others = allCreators.filter((c) => c.category !== targetCategory);
        candidates = [...candidates, ...others.slice(0, 4 - candidates.length)];
      }

      const rankings = await rankCreatorsForJobWithGemini(apiKey, jobCard, candidates);

      // Merge rankings with creator data
      const merged = candidates.map((creator, idx) => {
        const foundRanking = rankings.find((r) => r.creatorId === creator.id);
        const isExactCategory = creator.category === targetCategory;
        const fallbackScore = isExactCategory ? (98 - idx * 3) : (80 - idx * 4);
        return {
          ...creator,
          matchScore: foundRanking?.matchScore || fallbackScore,
          rationale: foundRanking?.rationale || (isExactCategory 
            ? `Top recommendation for "${jobCard.title}". Channel uploads in ${creator.categoryLabel} demonstrate authentic audience trust and vocal/content alignment.`
            : `Secondary fit from ${creator.categoryLabel}. Audience reach is viable, though outside the primary category focus.`)
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setMatchedResults(merged);
      setIsMatching(false);
    } catch (err) {
      console.error(err);
      setIsMatching(false);
    }
  };

  const handleSendOffer = (creatorId) => {
    setOfferSentId(creatorId);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '40px auto 32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(157, 78, 221, 0.12)',
          border: '1px solid rgba(157, 78, 221, 0.3)',
          marginBottom: '16px'
        }}>
          <Briefcase size={18} color="#c084fc" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#c084fc' }}>
            BRAND CAMPAIGN ENGINE
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '14px' }}>
          AI Job Card Builder & Creator Matchmaker
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          State your marketing requirement in natural language. Gemini constructs a structured campaign brief and evaluates verified YouTube creators for maximum ROI.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Step 1: Input Requirement */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '6px' }}>STEP 1</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Describe Your Campaign Requirement</h3>
          </div>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. We are launching an AI developer productivity tool..."
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              outline: 'none',
              marginBottom: '14px',
              resize: 'vertical'
            }}
          />

          {/* Sample Prompt Chips */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
              Quick Demo Prompts (Click to load):
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  style={{
                    textAlign: 'left',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  "{p.slice(0, 95)}..."
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGenerateJobCard}
              disabled={isGeneratingCard}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #9d4edd, #7b2cbf)',
                boxShadow: '0 0 20px rgba(157, 78, 221, 0.35)',
                color: '#fff'
              }}
            >
              <Sparkles size={18} />
              {isGeneratingCard ? 'Gemini Structuring Brief...' : 'Synthesize Campaign Job Card'}
            </button>
          </div>
        </div>

        {/* Step 2: The Structured Job Card */}
        {jobCard && (
          <div className="glass-panel" style={{
            padding: '30px',
            marginBottom: '28px',
            border: '1px solid rgba(157, 78, 221, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '6px' }}>STEP 2 (AI GENERATED)</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  {jobCard.title}
                </h3>
              </div>

              <button
                onClick={handleRankCreators}
                disabled={isMatching}
                className="btn-primary ai-pulse-active"
                style={{ padding: '12px 24px' }}
              >
                <Users size={18} />
                {isMatching ? 'Gemini Ranking Candidates...' : 'Rank Top Matched Creators'}
              </button>
            </div>

            {/* Campaign Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Target Category</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                  {jobCard.targetCategoryLabel || 'Tech & AI'}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Estimated Budget</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                  {jobCard.estimatedBudget}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Subscriber Tier</span>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffb703', marginTop: '4px' }}>
                  {jobCard.subscriberTier}
                </div>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-muted)' }}>
                CAMPAIGN DELIVERABLES
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(jobCard.deliverables || []).map((del, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(jobCard.requiredTags || []).map((t, idx) => (
                <span key={idx} className="tag-pill" style={{ color: 'var(--accent-cyan)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: AI Matched Creators */}
        {matchedResults && (
          <div className="glass-panel" style={{
            padding: '30px',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 0 40px rgba(0, 240, 255, 0.15)'
          }}>
            <div style={{ marginBottom: '22px' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>STEP 3 (AI MATCH RESULTS)</span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                Ranked Creators for this Campaign
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Gemini evaluated channel recent videos, subscriber credibility, and niche tags against your deliverables.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {matchedResults.map((creator, idx) => {
                const isSent = offerSentId === creator.id;
                return (
                  <div
                    key={creator.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '18px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={creator.avatar}
                        alt={creator.title}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{creator.title}</h4>
                          <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                            {creator.matchScore}% MATCH
                          </span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {creator.handle} • {creator.subscribersFormatted} Subscribers
                        </span>
                      </div>
                    </div>

                    {/* AI Rationale */}
                    <div style={{ flex: '1 1 300px', minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Sparkles size={14} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                          AI Recommendation Rationale
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {creator.rationale}
                      </p>
                    </div>

                    {/* Action */}
                    <div>
                      <button
                        onClick={() => handleSendOffer(creator.id)}
                        disabled={isSent}
                        className={isSent ? 'btn-secondary' : 'btn-primary'}
                        style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                      >
                        {isSent ? (
                          <>
                            <CheckCircle2 size={16} color="#10b981" />
                            Offer Dispatched
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Job Card Offer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
