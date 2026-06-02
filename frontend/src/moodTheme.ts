import type { Mood } from '../types';

// Complete mood reactive configuration
export const MOOD_THEMES: Record<Mood, {
  // Background gradients
  bgGradient: string;
  bgSolid: string;

  // Sidebar theme
  sidebarBg: string;
  sidebarBorder: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;

  // Accent colors
  accent: string;
  accentGlow: string;

  // Particle effects
  particles: string[];
  particleColor: string;

  // Companion behavior
  companionMood: Mood;
  companionMessage: string;
  companionScale: number;

  // Ambient effects
  ambientEffect: 'rain' | 'sparkle' | 'float' | 'glow' | 'breeze' | 'calm';
  ambientIntensity: number;

  // UI mood
  cardBg: string;
  cardBorder: string;

  // Weather description
  weather: string;
}> = {
  happy: {
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
    bgSolid: '#fffbeb',
    sidebarBg: 'from-amber-100/80 to-yellow-100/80',
    sidebarBorder: 'border-amber-200/50',
    textPrimary: '#78350f',
    textSecondary: '#92400e',
    accent: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    particles: ['☀️', '🌟', '✨', '🦋', '🌸', '💛'],
    particleColor: '#fbbf24',
    companionMood: 'happy',
    companionMessage: "You're radiating joy today! Let's celebrate together! 🎉",
    companionScale: 1.1,
    ambientEffect: 'sparkle',
    ambientIntensity: 1,
    cardBg: 'rgba(254, 243, 199, 0.8)',
    cardBorder: 'rgba(251, 191, 36, 0.3)',
    weather: 'Sunshine & Clear Skies',
  },
  calm: {
    bgGradient: 'from-teal-50 via-cyan-50 to-emerald-50',
    bgSolid: '#f0fdfa',
    sidebarBg: 'from-teal-100/80 to-cyan-100/80',
    sidebarBorder: 'border-teal-200/50',
    textPrimary: '#134e4a',
    textSecondary: '#0f766e',
    accent: '#14b8a6',
    accentGlow: 'rgba(20, 184, 166, 0.4)',
    particles: ['🍃', '🌿', '💧', '🌊', '☁️', '🍀'],
    particleColor: '#5eead4',
    companionMood: 'calm',
    companionMessage: "Peace flows through you. Take a deep breath... 🌊",
    companionScale: 1,
    ambientEffect: 'breeze',
    ambientIntensity: 0.7,
    cardBg: 'rgba(204, 251, 241, 0.8)',
    cardBorder: 'rgba(20, 184, 166, 0.3)',
    weather: 'Gentle Breeze & Clear',
  },
  sad: {
    bgGradient: 'from-slate-100 via-blue-100 to-gray-100',
    bgSolid: '#f1f5f9',
    sidebarBg: 'from-slate-200/80 to-blue-100/80',
    sidebarBorder: 'border-slate-300/50',
    textPrimary: '#334155',
    textSecondary: '#475569',
    accent: '#60a5fa',
    accentGlow: 'rgba(96, 165, 250, 0.4)',
    particles: ['🌧️', '💧', '💙', '🌙', '⭐', '🫂'],
    particleColor: '#60a5fa',
    companionMood: 'sad',
    companionMessage: "I'm right here with you. You're not alone. 💙",
    companionScale: 1.15, // Companion comes closer
    ambientEffect: 'rain',
    ambientIntensity: 0.8,
    cardBg: 'rgba(225, 239, 254, 0.9)',
    cardBorder: 'rgba(96, 165, 250, 0.3)',
    weather: 'Soft Rain & Comfort',
  },
  excited: {
    bgGradient: 'from-orange-50 via-yellow-100 to-pink-50',
    bgSolid: '#fff7ed',
    sidebarBg: 'from-orange-100/80 to-yellow-100/80',
    sidebarBorder: 'border-orange-200/50',
    textPrimary: '#9a3412',
    textSecondary: '#c2410c',
    accent: '#f97316',
    accentGlow: 'rgba(249, 115, 22, 0.5)',
    particles: ['⚡', '🎉', '✨', '💫', '🌟', '🎊'],
    particleColor: '#fb923c',
    companionMood: 'excited',
    companionMessage: "I can feel your energy! Let's make today amazing! ⚡",
    companionScale: 1.2,
    ambientEffect: 'sparkle',
    ambientIntensity: 1.5,
    cardBg: 'rgba(255, 237, 213, 0.8)',
    cardBorder: 'rgba(249, 115, 22, 0.3)',
    weather: 'Electric Energy & Sparkles',
  },
  anxious: {
    bgGradient: 'from-violet-50 via-purple-50 to-slate-50',
    bgSolid: '#faf5ff',
    sidebarBg: 'from-violet-100/80 to-purple-100/80',
    sidebarBorder: 'border-violet-200/50',
    textPrimary: '#4c1d95',
    textSecondary: '#5b21b6',
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.4)',
    particles: ['🌸', '🕊️', '💆', '💜', '☁️', '🍃'],
    particleColor: '#a78bfa',
    companionMood: 'calm',
    companionMessage: "Take a breath. I'm here. You're safe. Let's breathe together. 🌸",
    companionScale: 1.1,
    ambientEffect: 'calm',
    ambientIntensity: 0.6,
    cardBg: 'rgba(237, 233, 253, 0.8)',
    cardBorder: 'rgba(139, 92, 246, 0.3)',
    weather: 'Focus Mode Active',
  },
  neutral: {
    bgGradient: 'from-sky-50 via-gray-50 to-slate-50',
    bgSolid: '#f8fafc',
    sidebarBg: 'from-sky-100/80 to-gray-100/80',
    sidebarBorder: 'border-sky-200/50',
    textPrimary: '#1e293b',
    textSecondary: '#334155',
    accent: '#0ea5e9',
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    particles: ['☁️', '🌤️', '💪', '🌱', '💫', '⭐'],
    particleColor: '#38bdf8',
    companionMood: 'neutral',
    companionMessage: "Every moment is a fresh start. Let's begin! 🌱",
    companionScale: 1,
    ambientEffect: 'float',
    ambientIntensity: 0.5,
    cardBg: 'rgba(230, 242, 255, 0.8)',
    cardBorder: 'rgba(14, 165, 233, 0.3)',
    weather: 'Balanced & Clear',
  },
};

// Companion environments based on type
export const COMPANION_ENVIRONMENTS: Record<string, {
  name: string;
  bgImage: string;
  groundColor: string;
  elements: string[];
  atmosphericColor: string;
}> = {
  panda: {
    name: 'Bamboo Sanctuary',
    bgImage: 'from-green-100 via-emerald-50 to-teal-50',
    groundColor: '#166534',
    elements: ['🎋', '🌿', '🍃', '🦋', '🌸'],
    atmosphericColor: 'rgba(34, 197, 94, 0.1)',
  },
  fox: {
    name: 'Mystic Forest',
    bgImage: 'from-orange-100 via-amber-100 to-yellow-50',
    groundColor: '#92400e',
    elements: ['🍂', '🍁', '🍄', '🦊', '🌙'],
    atmosphericColor: 'rgba(251, 146, 60, 0.1)',
  },
  bunny: {
    name: 'Moonlit Garden',
    bgImage: 'from-pink-100 via-rose-50 to-fuchsia-50',
    groundColor: '#86198f',
    elements: ['🌸', '🌺', '🐰', '⭐', '🌙', '🌷'],
    atmosphericColor: 'rgba(244, 114, 182, 0.1)',
  },
  otter: {
    name: 'River Paradise',
    bgImage: 'from-cyan-100 via-teal-50 to-blue-50',
    groundColor: '#0e7490',
    elements: ['🌊', '🐟', '🐚', '🪨', '🦦', '💧'],
    atmosphericColor: 'rgba(20, 184, 166, 0.1)',
  },
  cat: {
    name: 'Cozy Room',
    bgImage: 'from-amber-100 via-yellow-50 to-orange-50',
    groundColor: '#92400e',
    elements: ['🧶', '📚', '🪴', '🕯️', '😺', '🛋️'],
    atmosphericColor: 'rgba(251, 191, 36, 0.1)',
  },
  penguin: {
    name: 'Crystal Ice World',
    bgImage: 'from-sky-100 via-blue-50 to-cyan-50',
    groundColor: '#0369a1',
    elements: ['❄️', '🧊', '🐧', '🌟', '⭐', '🐟'],
    atmosphericColor: 'rgba(56, 189, 248, 0.1)',
  },
  shiba: {
    name: 'Sakura Village',
    bgImage: 'from-yellow-100 via-lime-50 to-green-50',
    groundColor: '#166534',
    elements: ['🌸', '🏯', '🐕', '☀️', '🎐', '🍡'],
    atmosphericColor: 'rgba(132, 204, 22, 0.1)',
  },
};

// Loading messages
export const LOADING_MESSAGES = [
  "🧠 Analyzing your emotional patterns...",
  "🌱 Growing your emotional profile...",
  "✨ Creating your personal sanctuary...",
  "🦊 Waking up your companion...",
  "💫 Aligning your emotional DNA...",
  "🌟 Building your digital twin...",
  "🎨 Painting your mood landscape...",
  "🧬 Decoding your emotional blueprint...",
  "🌸 Preparing your growth journey...",
  "🔮 Reading your emotional stars...",
];
