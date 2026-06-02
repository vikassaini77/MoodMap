import React, { useState, useCallback } from 'react';
import type { Page, UserProfile } from './types';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import { Sidebar, BottomNav } from './components/Navigation';
import { SplashScreen } from './components/LoadingScreen';
import Home from './components/Home';
import Journal from './components/Journal';
import Sanctuary from './components/Sanctuary';
import Insights from './components/Insights';
import Arcade from './components/Arcade';
import Shop from './components/Shop';
import Profile from './components/Profile';
import SOS from './components/SOS';
import Settings from './components/Settings';
import Chatbot from './components/Chatbot';
import Council from './components/Council';

type AppState = 'splash' | 'landing' | 'onboarding' | 'login' | 'app';

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  email: '',
  name: '',
  age: '',
  country: '',
  occupation: '',
  goals: [],
  companion: 'fox',
  xp: 100,
  level: 1,
  moodCoins: 50,
  streakDays: 1,
  currentMood: 'neutral',
  moodHistory: [],
  achievements: [],
  emergencyContacts: [],
  settings: {
    theme: 'System',
    contrast: 'System',
    accentColor: 'Green',
    language: 'Auto-detect',
    dictationEnabled: true,
    spokenLanguage: 'English',
    mfaEnabled: false,
    subscription: 'free'
  }
};

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [transitionKey, setTransitionKey] = useState(0);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const handleOnboardingComplete = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    setAppState('app');
    setCurrentPage('home');
  }, []);

  const handleLogin = useCallback((user: any) => {
    setAppState('app');
    setProfile({
      ...DEFAULT_PROFILE,
      id: user.id,
      email: user.email,
      name: user.name || 'User',
      currentMood: user.currentMood || 'neutral',
      xp: user.xp || 0,
      moodCoins: user.moodCoins || 0,
      streakDays: user.streakDays || 1,
      level: user.level || 1,
      moodHistory: user.moodHistory || [],
    });
    setCurrentPage('home');
  }, []);

  const handleSplashComplete = useCallback(() => {
    setAppState('landing');
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('token');
    setProfile(DEFAULT_PROFILE);
    setAppState('landing');
  }, []);

  const handleForgotPassword = useCallback(() => {
    alert('Password reset email would be sent to your inbox');
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setTransitionKey(k => k + 1);
    setCurrentPage(page);
  }, []);

  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (appState === 'landing') {
    return (
      <LandingPage
        onEnter={() => setAppState('onboarding')}
        onLogin={() => setAppState('login')}
      />
    );
  }

  if (appState === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onCreateAccount={() => setAppState('onboarding')}
        onForgotPassword={handleForgotPassword}
        onBack={() => setAppState('landing')}
      />
    );
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} onLogin={() => setAppState('login')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home key={transitionKey} profile={profile} onUpdateProfile={updateProfile} onNavigate={navigateTo} />;
      case 'journal':
        return <Journal key={transitionKey} profile={profile} onNavigate={navigateTo} />;
      case 'sanctuary':
        return <Sanctuary key={transitionKey} profile={profile} />;
      case 'insights':
        return <Insights key={transitionKey} profile={profile} />;
      case 'arcade':
        return <Arcade key={transitionKey} profile={profile} onUpdateProfile={updateProfile} />;
      case 'shop':
        return <Shop key={transitionKey} profile={profile} onUpdateProfile={updateProfile} />;
      case 'profile':
        return <Profile key={transitionKey} profile={profile} onUpdateProfile={updateProfile} onSignOut={handleSignOut} />;
      case 'chat':
        return <Chatbot key={transitionKey} profile={profile} onUpdateProfile={updateProfile} onSignOut={handleSignOut} />;
      case 'council':
        return <Council key={transitionKey} profile={profile} />;
      case 'sos':
        return <SOS key={transitionKey} profile={profile} />;
      case 'settings':
        return <Settings key={transitionKey} profile={profile} onUpdateProfile={updateProfile} onNavigate={navigateTo} />;
      default:
        return <Home key={transitionKey} profile={profile} onUpdateProfile={updateProfile} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={navigateTo} profile={profile} onSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="animate-fade-in">
        {renderPage()}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={navigateTo} profile={profile} onSignOut={handleSignOut} />
    </div>
  );
}

export default App;
