import React, { useState, useEffect } from 'react';
import CreatorAuth from './CreatorAuth';
import SingleCreatorDashboard from './SingleCreatorDashboard';
import { getDemoSandboxCreator } from '../../services/youtubeService';

const CREATOR_SESSION_KEY = 'nefra_logged_in_creator';

export default function CreatorPortal({ apiKey, googleClientId, onCreatorEnrolled }) {
  // Session state: null if logged out, or creator object if logged in
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CREATOR_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    // Default to initial demo session (The Coding Train) so it opens smoothly, or user can Sign Out to test login/register
    return getDemoSandboxCreator('creator-tech-1');
  });

  const handleLoginSuccess = (creatorData) => {
    setCurrentUser(creatorData);
    try {
      localStorage.setItem(CREATOR_SESSION_KEY, JSON.stringify(creatorData));
    } catch (e) {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(CREATOR_SESSION_KEY);
    } catch (e) {}
  };

  if (!currentUser) {
    return (
      <CreatorAuth
        onLoginSuccess={handleLoginSuccess}
        googleClientId={googleClientId}
      />
    );
  }

  return (
    <SingleCreatorDashboard
      creator={currentUser}
      onSignOut={handleSignOut}
      apiKey={apiKey}
      onCreatorEnrolled={onCreatorEnrolled}
    />
  );
}
