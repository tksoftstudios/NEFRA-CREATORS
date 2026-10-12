import React, { useState } from 'react';
import { Key, ShieldCheck, X, Sparkles, ExternalLink } from 'lucide-react';

export default function ConfigModal({ isOpen, onClose, apiKey, setApiKey, googleClientId, setGoogleClientId }) {
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [tempClientId, setTempClientId] = useState(googleClientId || '');

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempApiKey.trim());
    setGoogleClientId(tempClientId.trim());
    localStorage.setItem('nefra_gemini_key', tempApiKey.trim());
    localStorage.setItem('nefra_google_client_id', tempClientId.trim());
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        background: '#0d1322',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        <button
          onClick={onClose}
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
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(0, 240, 255, 0.12)',
            padding: '10px',
            borderRadius: '12px',
            color: 'var(--accent-cyan)'
          }}>
            <Key size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Platform Configuration</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Live Gemini AI and Google Cloud OAuth settings
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '20px 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              Gemini API Key (Google AI Studio / Vertex AI)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Used for live 3-video analysis, category tagging, and AI Job Card synthesis. (Leave empty to use built-in smart demo mode).
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              Google OAuth Client ID (Optional)
            </label>
            <input
              type="text"
              placeholder="your-client-id.apps.googleusercontent.com"
              value={tempClientId}
              onChange={(e) => setTempClientId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
              Required only for live creator Google Sign-In with YouTube permissions. The Demo Sandbox works without a Client ID.
            </span>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          padding: '12px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <Sparkles size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong>Hackathon Demo Tip:</strong> You can test all video analysis, AI tagging, job cards, and ranking right away with the Demo Sandbox without configuring any credentials.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
