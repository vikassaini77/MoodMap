export type Mood = 'happy' | 'calm' | 'sad' | 'excited' | 'anxious' | 'neutral';
export type CompanionType = 'panda' | 'fox' | 'bunny' | 'otter' | 'cat' | 'penguin' | 'shiba';
export type Page = 'landing' | 'onboarding' | 'home' | 'journal' | 'chat' | 'council' | 'sanctuary' | 'insights' | 'arcade' | 'shop' | 'profile' | 'sos';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: string;
  country: string;
  occupation: string;
  goals: string[];
  companion: CompanionType;
  xp: number;
  level: number;
  moodCoins: number;
  streakDays: number;
  currentMood: Mood;
  moodHistory: MoodEntry[];
  achievements: Achievement[];
  emergencyContacts: EmergencyContact[];
  avatarUrl?: string;
  customInstructions?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'System' | 'Dark' | 'Light';
  contrast: 'System' | 'High';
  accentColor: 'Green' | 'Blue' | 'Pink';
  language: string;
  dictationEnabled: boolean;
  spokenLanguage: string;
  mfaEnabled: boolean;
  subscription: 'free' | 'plus';
}

export interface MoodEntry {
  date: string;
  mood: Mood;
  note: string;
  energy: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: Mood;
  sentiment: number;
  tags: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'theme' | 'background' | 'accessory' | 'companion';
  preview: string;
  owned: boolean;
}

export const COMPANIONS: Record<CompanionType, {
  name: string;
  emoji: string;
  personality: string;
  habitat: string;
  color: string;
  greeting: string;
}> = {
  panda: {
    name: 'Bao',
    emoji: '🐼',
    personality: 'Calm & Wise',
    habitat: 'Bamboo Forest',
    color: '#4ade80',
    greeting: 'Good morning! Remember to breathe today.',
  },
  fox: {
    name: 'Kira',
    emoji: '🦊',
    personality: 'Playful & Clever',
    habitat: 'Mystic Forest',
    color: '#fb923c',
    greeting: 'Hey! Ready for an adventure today?',
  },
  bunny: {
    name: 'Luna',
    emoji: '🐰',
    personality: 'Sweet & Gentle',
    habitat: 'Moon Garden',
    color: '#f9a8d4',
    greeting: 'Hi there! You make the world brighter.',
  },
  otter: {
    name: 'Rio',
    emoji: '🦦',
    personality: 'Joyful & Free',
    habitat: 'River Sanctuary',
    color: '#7dd3fc',
    greeting: 'Splash! Today is going to be wonderful!',
  },
  cat: {
    name: 'Mochi',
    emoji: '🐱',
    personality: 'Cozy & Curious',
    habitat: 'Cozy House',
    color: '#fbbf24',
    greeting: "Purr... I believe in you today.",
  },
  penguin: {
    name: 'Finn',
    emoji: '🐧',
    personality: 'Loyal & Brave',
    habitat: 'Crystal Ice World',
    color: '#bae6fd',
    greeting: 'Waddle waddle! Let\'s tackle today together!',
  },
  shiba: {
    name: 'Doge',
    emoji: '🐕',
    personality: 'Energetic & Loyal',
    habitat: 'Sunny Meadow',
    color: '#fde68a',
    greeting: 'Such wow! Much happy to see you!',
  },
};

export const MOOD_CONFIG: Record<Mood, {
  label: string;
  emoji: string;
  color: string;
  bg: string;
  sky: string;
  particles: string;
  message: string;
}> = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    color: '#fbbf24',
    bg: 'bg-mood-happy',
    sky: 'from-yellow-100 via-amber-50 to-orange-50',
    particles: '☀️🌸🌈✨',
    message: 'Your happiness lights up the world!',
  },
  calm: {
    label: 'Calm',
    emoji: '😌',
    color: '#22c55e',
    bg: 'bg-mood-calm',
    sky: 'from-teal-100 via-cyan-50 to-green-50',
    particles: '🍃🌿🌊💧',
    message: 'Peace flows through you.',
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    color: '#60a5fa',
    bg: 'bg-mood-sad',
    sky: 'from-blue-100 via-slate-100 to-gray-100',
    particles: '🌧️💙🌙⭐',
    message: 'Your companion is here for you.',
  },
  excited: {
    label: 'Excited',
    emoji: '🤩',
    color: '#f97316',
    bg: 'bg-mood-excited',
    sky: 'from-orange-100 via-yellow-50 to-pink-50',
    particles: '⚡🎉🌟✨',
    message: 'Your energy is contagious!',
  },
  anxious: {
    label: 'Anxious',
    emoji: '😰',
    color: '#a78bfa',
    bg: 'bg-mood-anxious',
    sky: 'from-purple-100 via-blue-50 to-slate-100',
    particles: '🌺🍃💆🌙',
    message: "Breathe. You're safe here.",
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: '#94a3b8',
    bg: 'bg-mood-neutral',
    sky: 'from-sky-100 via-blue-50 to-cyan-50',
    particles: '☁️🌤️🌱💫',
    message: "Every moment is a fresh start.",
  },
};
