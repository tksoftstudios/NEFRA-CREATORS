import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Users, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  Video, 
  Play, 
  Calendar, 
  Eye, 
  X,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { CATEGORIES } from '../../data/seedCreators';

export default function Top10Directory({ creators, onSelectCreatorForCampaign }) {
  const [activeCategory, setActiveCategory] = useState('tech');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState(null);

  // Derive categories dynamically from defaults + any newly generated AI categories from creators
  const dynamicCategories = useMemo(() => {
    const map = new Map();
    // Default categories
    CATEGORIES.forEach((cat) => {
      map.set(cat.id, { id: cat.id, name: cat.name, color: cat.color });
    });
    // Add any new AI-generated categories
    creators.forEach((c) => {
      if (c.category && !map.has(c.category)) {
        map.set(c.category, {
          id: c.category,
          name: c.categoryLabel || (c.category.charAt(0).toUpperCase() + c.category.slice(1)),
          color: '#00F0FF',
          isCustom: true
        });
      }
    });
    return Array.from(map.values());
  }, [creators]);

  // Derive sub-categories available in the active category
  const availableSubCategories = useMemo(() => {
    const subs = new Set();
    creators
      .filter((c) => activeCategory === 'all' || c.category === activeCategory)
      .forEach((c) => {
        if (c.subCategory) subs.add(c.subCategory);
      });
    return Array.from(subs);
  }, [creators, activeCategory]);

  // Filter creators by Category, Sub-Category, and Search Query
  const filteredCreators = creators
    .filter((c) => {
      const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
      const matchesSubCategory = activeSubCategory === 'all' || c.subCategory === activeSubCategory;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        (c.categoryLabel && c.categoryLabel.toLowerCase().includes(q)) ||
        (c.subCategory && c.subCategory.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(q))) ||
        (c.aiSummary && c.aiSummary.toLowerCase().includes(q));

      return matchesCategory && matchesSubCategory && matchesSearch;
    })
    // Sort by Nefra Score descending, then by subscriber count
    .sort((a, b) => (b.nefraScore || 0) - (a.nefraScore || 0) || b.subscriberCount - a.subscriberCount)
    .slice(0, 10);

  const activeCategoryObj = dynamicCategories.find((c) => c.id === activeCategory) || dynamicCategories[0];

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Directory Hero */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '40px auto 32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          marginBottom: '16px'
        }}>
          <Trophy size={18} color="#00f0ff" />
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#00f0ff' }}>
            AI-INDEXED CREATOR DIRECTORY
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '14px' }}>
          Top 10 Creators by Category & Niche
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          Categories and granular sub-categories automatically identified and ranked by Gemini AI across verified YouTube uploads.
        </p>
      </div>

      {/* Dynamic Category Switcher */}
      <div className="app-container" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none'
        }}>
          {dynamicCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveSubCategory('all');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  background: isActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#00f0ff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 16px rgba(0, 240, 255, 0.25)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.name}
                {cat.isCustom && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    AI GENERATED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Category Pills Filter (If available) */}
      {availableSubCategories.length > 0 && (
        <div className="app-container" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            padding: '4px 0',
            scrollbarWidth: 'none'
          }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', whiteSpace: 'nowrap' }}>
              Sub-Categories:
            </span>
            <button
              onClick={() => setActiveSubCategory('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: activeSubCategory === 'all' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: activeSubCategory === 'all' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeSubCategory === 'all' ? '#00f0ff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Sub-Categories
            </button>
            {availableSubCategories.map((sub, idx) => {
              const isSubActive = activeSubCategory === sub;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSubCategory(sub)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: isSubActive ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                    background: isSubActive ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSubActive ? '#c084fc' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="app-container" style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          padding: '12px 20px',
          borderRadius: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              placeholder={`Search by creator, sub-category ("Acoustic", "DevOps"), or tag (#Vocalist)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <span>Showing Top {filteredCreators.length} AI-Verified Creators</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Cards Grid */}
      <div className="app-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredCreators.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '12px' }}>
                No creators matched your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveSubCategory('all');
                }}
                className="btn-secondary"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            filteredCreators.map((creator, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const rankBadgeColor = rank === 1 ? '#ffb703' : rank === 2 ? '#cbd5e1' : rank === 3 ? '#b45309' : 'rgba(255, 255, 255, 0.1)';

              return (
                <div
                  key={creator.id}
                  className="glass-panel"
                  style={{
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    border: isTop3 ? `1px solid ${rank === 1 ? 'rgba(255, 183, 3, 0.4)' : 'rgba(0, 240, 255, 0.25)'}` : '1px solid var(--border-subtle)',
                    boxShadow: rank === 1 ? '0 8px 30px rgba(255, 183, 3, 0.1)' : 'none'
                  }}
                >
                  {/* Left: Rank + Avatar + Identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px' }}>
                    {/* Rank Badge */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: rankBadgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: '800',
                      fontSize: '1.25rem',
                      color: isTop3 && rank === 1 ? '#000' : isTop3 && rank === 2 ? '#000' : '#fff',
                      flexShrink: 0
                    }}>
                      #{rank}
                    </div>

                    <img
                      src={creator.avatar}
                      alt={creator.title}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255, 255, 255, 0.15)',
                        flexShrink: 0
                      }}
                    />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{creator.title}</h3>
                        <CheckCircle2 size={16} color="#00f0ff" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{creator.handle}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>•</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{creator.country || 'JAPAC'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Sub-Category Badge, Tags & AI Summary */}
                  <div style={{ flex: '1 1 320px', minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {creator.subCategory && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          background: 'rgba(192, 132, 252, 0.15)',
                          color: '#c084fc',
                          border: '1px solid rgba(192, 132, 252, 0.3)'
                        }}>
                          {creator.subCategory}
                        </span>
                      )}
                      {(creator.tags || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {creator.aiSummary}
                    </p>
                  </div>

                  {/* Right: Stats & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Verified Subscribers */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                        Subscribers
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.35rem',
                        fontWeight: '800',
                        color: '#ffffff'
                      }}>
                        {creator.subscribersFormatted}
                      </div>
                    </div>

                    {/* AI Score */}
                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                        Nefra Score
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.35rem',
                        fontWeight: '800',
                        color: '#ffb703'
                      }}>
                        {creator.nefraScore || 94}
                      </div>
                    </div>

                    {/* Inspect 3 Videos Button */}
                    <button
                      onClick={() => setSelectedCreatorForModal(creator)}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    >
                      <Video size={16} />
                      View Videos
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Inspected 3 Videos */}
      {selectedCreatorForModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '840px',
            width: '100%',
            padding: '30px',
            background: '#0d1322',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedCreatorForModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
              <img
                src={selectedCreatorForModal.avatar}
                alt={selectedCreatorForModal.title}
                style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  {selectedCreatorForModal.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {selectedCreatorForModal.handle} • {selectedCreatorForModal.subscribersFormatted} Subscribers
                  </span>
                  {selectedCreatorForModal.subCategory && (
                    <span style={{
                      fontSize: '0.74rem',
                      background: 'rgba(192, 132, 252, 0.15)',
                      color: '#c084fc',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {selectedCreatorForModal.subCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                  Gemini AI Content Rationale:
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {selectedCreatorForModal.aiSummary}
              </p>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={16} color="var(--accent-cyan)" />
              The 3 Verified Videos Evaluated by Gemini AI:
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
              {(selectedCreatorForModal.recentVideos || []).map((video, idx) => (
                <div
                  key={video.id || idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: '100%', height: '130px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '12px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', lineHeight: 1.35, marginBottom: '6px' }}>
                      {video.title}
                    </h5>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                      {video.description?.slice(0, 90)}...
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {video.publishedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
