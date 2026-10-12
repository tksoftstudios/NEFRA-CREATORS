import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Top10Directory from './components/directory/Top10Directory';
import CreatorConnect from './components/creator/CreatorConnect';
import BusinessJobPortal from './components/business/BusinessJobPortal';
import ConfigModal from './components/common/ConfigModal';
import { SEED_CREATORS } from './data/seedCreators';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import YouTubeIcon from './components/common/YouTubeIcon';

import { saveCreatorToFirestore, subscribeToCreators } from './services/firestoreService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('directory');
  const [creators, setCreators] = useState(() => {
    try {
      const saved = localStorage.getItem('nefra_enrolled_creators');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SEED_CREATORS;
  });
  const [apiKey, setApiKey] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load stored credentials
  useEffect(() => {
    const savedKey = localStorage.getItem('nefra_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
    const savedClient = localStorage.getItem('nefra_google_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    if (savedKey) setApiKey(savedKey);
    if (savedClient) setGoogleClientId(savedClient);
  }, []);

  // Real-time Firestore sync listener for globally enrolled creators
  useEffect(() => {
    const unsubscribe = subscribeToCreators((cloudCreators) => {
      if (cloudCreators && cloudCreators.length > 0) {
        setCreators((prev) => {
          const map = new Map();
          // Seed & local creators first
          prev.forEach((c) => map.set(c.channelId || c.id, c));
          // Cloud creators overwrite or prepend
          cloudCreators.forEach((c) => map.set(c.channelId || c.id, c));
          
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('nefra_enrolled_creators', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Show temporary toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // When a creator connects & gets analyzed by Gemini, enroll them into the platform and Firestore
  const handleCreatorEnrolled = async (newCreator) => {
    setCreators((prev) => {
      const existingIndex = prev.findIndex((c) => c.channelId === newCreator.channelId);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = newCreator;
      } else {
        // Enrolled creator gets top placement
        updated = [newCreator, ...prev];
      }
      try {
        localStorage.setItem('nefra_enrolled_creators', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Save to Cloud Firestore
    saveCreatorToFirestore(newCreator);

    triggerToast(`🎉 ${newCreator.title} enrolled into Top 10 ${newCreator.categoryLabel} & synced to Firestore!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        apiKey={apiKey}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 999,
          background: 'rgba(14, 20, 36, 0.95)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)',
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentTab === 'directory' && (
          <Top10Directory
            creators={creators}
            onSelectCreatorForCampaign={() => setCurrentTab('business')}
          />
        )}

        {currentTab === 'creator' && (
          <CreatorConnect
            apiKey={apiKey}
            googleClientId={googleClientId}
            onCreatorEnrolled={handleCreatorEnrolled}
          />
        )}

        {currentTab === 'business' && (
          <BusinessJobPortal
            apiKey={apiKey}
            allCreators={creators}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(5, 8, 16, 0.95)',
        padding: '36px 0',
        marginTop: 'auto'
      }}>
        <div className="app-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                NEFRA CREATORS
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                GOOGLE CLOUD AI BUILDER CUP
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Empowering the creator economy with Gemini Flash multimodal video analysis & smart brand matching.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cpu size={14} color="var(--accent-cyan)" /> Gemini 2.5 Flash
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <YouTubeIcon size={14} color="#ff0033" /> YouTube Data API v3
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} color="#10b981" /> Google OAuth 2.0
            </span>
          </div>
        </div>
      </footer>

      {/* Settings & Credentials Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        googleClientId={googleClientId}
        setGoogleClientId={setGoogleClientId}
      />
    </div>
  );
}
