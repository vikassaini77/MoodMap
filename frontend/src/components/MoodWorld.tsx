import React, { useEffect, useState, useMemo } from 'react';
import type { Mood } from '../types';
import { MOOD_THEMES } from '../moodTheme';

interface MoodWorldProps {
  mood: Mood;
  equippedBackground?: string;
  children: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

export const MoodWorld: React.FC<MoodWorldProps> = ({ mood, equippedBackground, children }) => {
  const theme = MOOD_THEMES[mood];
  const [particles, setParticles] = useState<Particle[]>([]);
  const [raindrops, setRaindrops] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

  // Generate particles based on mood
  useEffect(() => {
    const particleCount = Math.floor(12 * theme.ambientIntensity);
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: theme.particles[Math.floor(Math.random() * theme.particles.length)],
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 14 + Math.random() * 12,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setParticles(newParticles);

    // Rain for sad mood
    if (mood === 'sad') {
      const drops = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 1,
      }));
      setRaindrops(drops);
    } else {
      setRaindrops([]);
    }
  }, [mood, theme]);

  // Ambient effect component
  const AmbientEffect = useMemo(() => {
    switch (theme.ambientEffect) {
      case 'rain':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {raindrops.map(drop => (
              <div
                key={drop.id}
                className="absolute w-0.5 bg-blue-400/40 rounded-full"
                style={{
                  left: `${drop.x}%`,
                  height: `${15 + Math.random() * 20}px`,
                  animation: `rain ${drop.duration}s linear infinite`,
                  animationDelay: `${drop.delay}s`,
                }}
              />
            ))}
            {/* Soft rain sound indicator */}
            <div className="absolute bottom-4 right-4 opacity-30 text-2xl animate-pulse_soft">🌧️</div>
          </div>
        );
      case 'sparkle':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${8 + Math.random() * 12}px`,
                  animationDelay: `${Math.random() * 3}s`,
                }}>
                ✦
              </div>
            ))}
          </div>
        );
      case 'breeze':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute text-3xl opacity-40"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 15}%`,
                  animation: 'float 4s ease-in-out infinite',
                  animationDelay: `${i * 0.5}s`,
                }}>
                🍃
              </div>
            ))}
          </div>
        );
      case 'calm':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="absolute animate-breathe"
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${25 + (i % 2) * 20}%`,
                  width: `${60 + i * 20}px`,
                  height: `${60 + i * 20}px`,
                  borderRadius: '50%',
                  background: `${theme.accent}10`,
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  }, [theme, raindrops]);

  const isStarry = equippedBackground === 'starry-bg' || equippedBackground === 'starry-bundle';
  const isSakura = equippedBackground === 'sakura-bg';
  
  let bgClasses = `bg-gradient-to-b ${theme.bgGradient}`;
  if (isStarry) bgClasses = 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900';
  if (isSakura) bgClasses = 'bg-gradient-to-b from-pink-100 via-rose-50 to-pink-50';

  return (
    <div
      className="min-h-screen relative transition-all duration-1000 overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, var(--tw-gradient-stops))`,
      }}
    >
      {/* Dynamic gradient background */}
      <div
        className={`fixed inset-0 ${bgClasses} transition-all duration-1000`}
      />

      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${theme.accentGlow}, transparent 50%)`,
        }}
      />

      {/* Ambient effect */}
      {AmbientEffect}

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute transition-all"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Starry Effect */}
      {isStarry && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                opacity: 0.2 + Math.random() * 0.8,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes twinkle {
              0% { opacity: 0.2; transform: scale(0.8); }
              100% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* CSS for rain animation */}
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MoodWorld;
