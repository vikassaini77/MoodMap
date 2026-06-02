import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../moodTheme';
import AnimatedCompanion from './AnimatedCompanion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCompanion, setShowCompanion] = useState(false);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    // Staggered animations
    setTimeout(() => setShowStars(true), 300);
    setTimeout(() => setShowCompanion(true), 800);

    // Cycle through loading messages
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Complete after 3 seconds
    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 500);
    }, 3000);

    return () => clearInterval(msgInterval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      }}
    >
      {/* Animated stars */}
      {showStars && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${4 + Math.random() * 8}px`,
                animationDelay: `${Math.random() * 2}s`,
                color: '#fbbf24',
              }}
            >
              ✦
            </div>
          ))}
        </div>
      )}

      {/* Floating clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {['top-[10%] left-[10%]', 'top-[20%] right-[15%]', 'bottom-[30%] left-[20%]'].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} animate-drift`}
            style={{
              animationDelay: `${i * -6}s`,
              animationDuration: `${25 + i * 5}s`,
            }}
          >
            <svg width={80 + i * 30} height={50} viewBox="0 0 200 100">
              <g fill="rgba(186, 230, 253, 0.8)">
                <ellipse cx="100" cy="70" rx="80" ry="30" />
                <ellipse cx="70" cy="55" rx="50" ry="40" />
                <ellipse cx="130" cy="60" rx="45" ry="35" />
              </g>
            </svg>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center px-8">
        {/* Logo with glow */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-3xl animate-pulse_soft"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              filter: 'blur(20px)',
              transform: 'scale(1.3)',
            }}
          />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              animation: 'breathe 3s ease-in-out infinite',
            }}
          >
            <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h1
          className="text-4xl font-bold text-gray-800 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          MoodMap X
        </h1>
        <p className="text-gray-500 text-sm mb-8">Your emotional wellness companion</p>

        {/* Animated companion */}
        {showCompanion && (
          <div
            className="mb-8 animate-fade-in"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            <AnimatedCompanion type="fox" mood="happy" size="lg" />
          </div>
        )}

        {/* Loading message */}
        <div className="h-8 flex items-center justify-center">
          <p
            className="text-gray-600 font-medium animate-fade-in"
            key={messageIndex}
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-6">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              background: 'linear-gradient(90deg, #0ea5e9, #22c55e)',
              width: fadeOut ? '100%' : '60%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Page loading overlay
interface PageLoadingProps {
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ message }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 font-medium" key={msgIndex}>
          {message || LOADING_MESSAGES[msgIndex]}
        </p>
      </div>
    </div>
  );
};

// Skeleton loading component
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
  />
);

export default SplashScreen;
