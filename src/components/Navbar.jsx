import React from 'react';
import { Layers, Video, Briefcase, Settings, Sparkles, ShieldCheck } from 'lucide-react';
import YouTubeIcon from './common/YouTubeIcon';

export default function Navbar({ currentTab, setCurrentTab, apiKey, onOpenConfig }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('directory')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff, #9d4edd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.45)'
          }}>
            <Sparkles size={22} color="#050b14" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 40%, #00f0ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NEFRA
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                AI CREATOR INTELLIGENCE
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '-2px' }}>
              Google Cloud AI Builder Cup JAPAC 2026
            </span>
          </div>
        </div>

        {/* Central Persona / Navigation Switcher */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setCurrentTab('directory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: currentTab === 'directory' ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'transparent',
              color: currentTab === 'directory' ? '#050b14' : 'var(--text-muted)',
              fontFamily: 'var(--font-heading)',
              fontWeight: currentTab === 'directory' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Layers size={16} />
            Top 10 Directory
          </button>

          <button
            onClick={() => setCurrentTab('creator')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: currentTab === 'creator' ? '#2563eb' : 'transparent',
              color: currentTab === 'creator' ? '#ffffff' : 'var(--text-muted)',
              fontFamily: 'var(--font-heading)',
              fontWeight: currentTab === 'creator' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: currentTab === 'creator' ? '0 0 14px rgba(37, 99, 235, 0.4)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <YouTubeIcon size={17} color={currentTab === 'creator' ? '#ffffff' : '#ff0033'} />
            Creator Hub
          </button>

          <button
            onClick={() => setCurrentTab('business')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: currentTab === 'business' ? 'linear-gradient(135deg, #9d4edd, #7b2cbf)' : 'transparent',
              color: currentTab === 'business' ? '#ffffff' : 'var(--text-muted)',
              fontFamily: 'var(--font-heading)',
              fontWeight: currentTab === 'business' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: currentTab === 'business' ? '0 0 18px rgba(157, 78, 221, 0.4)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Briefcase size={16} />
            Brand Job Cards
          </button>
        </nav>

        {/* Right Action: Status & Config */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: apiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 240, 255, 0.08)',
            border: `1px solid ${apiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 240, 255, 0.2)'}`,
            fontSize: '0.78rem',
            color: apiKey ? '#10b981' : '#00f0ff',
            fontWeight: '600'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: apiKey ? '#10b981' : '#00f0ff',
              boxShadow: `0 0 8px ${apiKey ? '#10b981' : '#00f0ff'}`
            }}></span>
            {apiKey ? 'Gemini 2.5 Live' : 'Demo Mode Active'}
          </div>

          <button
            onClick={onOpenConfig}
            className="btn-secondary"
            title="Configure Gemini & Google OAuth credentials"
            style={{ padding: '8px 12px', borderRadius: '10px' }}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
