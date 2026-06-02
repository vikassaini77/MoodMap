import React, { useEffect, useState } from 'react';
import type { Mood } from '../types';
import { MOOD_CONFIG } from '../types';

interface FloatingWorldProps {
  mood: Mood;
  children?: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
}

interface Cloud {
  id: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const MOOD_PARTICLES: Record<Mood, string[]> = {
  happy: ['☀️', '🌸', '🌈', '✨', '🌻', '🦋'],
  calm: ['🍃', '🌿', '💧', '🌊', '🍀', '🌙'],
  sad: ['🌧️', '💙', '⭐', '🌙', '💫', '🌊'],
  excited: ['⚡', '🎉', '🌟', '✨', '🎊', '💥'],
  anxious: ['🌺', '🍃', '💆', '🌙', '🕊️', '🌸'],
  neutral: ['☁️', '🌤️', '🌱', '💫', '🌾', '🍂'],
};

const MOOD_GRADIENTS: Record<Mood, string> = {
  happy: 'from-amber-100 via-yellow-50 to-orange-50',
  calm: 'from-teal-100 via-emerald-50 to-cyan-50',
  sad: 'from-blue-200 via-slate-100 to-gray-100',
  excited: 'from-orange-100 via-yellow-50 to-pink-50',
  anxious: 'from-blue-100 via-slate-100 to-blue-50',
  neutral: 'from-sky-100 via-blue-50 to-cyan-50',
};

export const FloatingWorld: React.FC<FloatingWorldProps> = ({ mood, children }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    const emojis = MOOD_PARTICLES[mood];
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 95,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 14 + Math.random() * 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles(newParticles);

    const newClouds: Cloud[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      y: 5 + i * 12,
      size: 80 + Math.random() * 100,
      delay: i * -8,
      duration: 25 + Math.random() * 15,
      opacity: 0.4 + Math.random() * 0.3,
    }));
    setClouds(newClouds);
  }, [mood]);

  const config = MOOD_CONFIG[mood];

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${MOOD_GRADIENTS[mood]} overflow-hidden transition-all duration-2000`}>
      {/* Animated clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {clouds.map(cloud => (
          <div
            key={cloud.id}
            className="absolute"
            style={{
              top: `${cloud.y}%`,
              animationName: 'drift',
              animationDuration: `${cloud.duration}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: `${cloud.delay}s`,
              opacity: cloud.opacity,
            }}
          >
            <CloudShape size={cloud.size} mood={mood} />
          </div>
        ))}
      </div>

      {/* Rain for sad mood */}
      {mood === 'sad' && <RainEffect />}

      {/* Sparkles for excited mood */}
      {mood === 'excited' && <SparkleEffect />}

      {/* Floating emoji particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              bottom: '-20px',
              fontSize: `${p.size}px`,
              animation: `particleFloat ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Mood indicator bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: `linear-gradient(90deg, ${config.color}88, ${config.color}, ${config.color}88)` }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const CloudShape: React.FC<{ size: number; mood: Mood }> = ({ size, mood }) => {
  const colors: Record<Mood, string> = {
    happy: 'rgba(255, 220, 100, 0.5)',
    calm: 'rgba(134, 239, 172, 0.5)',
    sad: 'rgba(147, 197, 253, 0.5)',
    excited: 'rgba(251, 146, 60, 0.4)',
    anxious: 'rgba(196, 181, 253, 0.4)',
    neutral: 'rgba(186, 230, 253, 0.6)',
  };

  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100">
      <g fill={colors[mood]}>
        <ellipse cx="100" cy="70" rx="80" ry="30" />
        <ellipse cx="70" cy="55" rx="50" ry="40" />
        <ellipse cx="130" cy="60" rx="45" ry="35" />
        <ellipse cx="100" cy="50" rx="40" ry="30" />
      </g>
    </svg>
  );
};

const RainEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute w-0.5 bg-blue-300 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          height: `${20 + Math.random() * 30}px`,
          opacity: 0.4 + Math.random() * 0.3,
          animationName: 'rain',
          animationDuration: `${1 + Math.random() * 1.5}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

const SparkleEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 15 }, (_, i) => (
      <div
        key={i}
        className="absolute text-yellow-400"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: `${10 + Math.random() * 14}px`,
          animationName: 'sparkle',
          animationDuration: `${1.5 + Math.random() * 2}s`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: `${Math.random() * 3}s`,
        }}
      >
        ✦
      </div>
    ))}
  </div>
);

export const MoodWeatherBanner: React.FC<{ mood: Mood; message: string }> = ({ mood, message }) => {
  const config = MOOD_CONFIG[mood];
  return (
    <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3 animate-slide-up">
      <span className="text-2xl">{config.emoji}</span>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feeling {config.label}</p>
        <p className="text-sm text-gray-700 font-medium">{message}</p>
      </div>
      <div className="ml-auto">
        <div className="w-3 h-3 rounded-full mood-ring" style={{ background: config.color }} />
      </div>
    </div>
  );
};

export default FloatingWorld;
