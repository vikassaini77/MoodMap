import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Star, Zap, TrendingUp, Brain, ChevronRight, Award, BookOpen, Heart } from 'lucide-react';
import type { Mood, UserProfile } from '../types';
import { MOOD_CONFIG, COMPANIONS } from '../types';
import { MOOD_THEMES, COMPANION_ENVIRONMENTS } from '../moodTheme';
import AnimatedCompanion from './AnimatedCompanion';
import { MoodWorld } from './MoodWorld';

interface HomeProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (page: any) => void;
}

const DAILY_MISSIONS = [
  { id: 'm1', title: 'Log your mood', xp: 20, done: true, emoji: '🎭' },
  { id: 'm2', title: 'Write a journal entry', xp: 30, done: false, emoji: '✍️' },
  { id: 'm3', title: 'Complete a breathing exercise', xp: 25, done: true, emoji: '💨' },
  { id: 'm4', title: 'Play a mood game', xp: 20, done: false, emoji: '🎮' },
];

const MOOD_WEEK: Mood[] = ['happy', 'calm', 'neutral', 'anxious', 'happy', 'excited', 'calm'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Home: React.FC<HomeProps> = ({ profile, onUpdateProfile, onNavigate }) => {
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [missions] = useState(DAILY_MISSIONS);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breatheTimer, setBreatheTimer] = useState(4);

  const companion = COMPANIONS[profile.companion];
  const moodConfig = MOOD_CONFIG[profile.currentMood];
  const moodTheme = MOOD_THEMES[profile.currentMood];
  const companionEnv = COMPANION_ENVIRONMENTS[profile.companion];
  const levelProgress = ((profile.xp % 500) / 500) * 100;
  const completedMissions = missions.filter(m => m.done).length;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    if (!breathingActive) return;
    const phases: { phase: 'inhale' | 'hold' | 'exhale'; duration: number }[] = [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold', duration: 4 },
      { phase: 'exhale', duration: 6 },
    ];
    let phaseIdx = 0;
    let timeLeft = phases[0].duration;
    setBreathePhase(phases[0].phase);
    setBreatheTimer(timeLeft);
    const interval = setInterval(() => {
      timeLeft--;
      setBreatheTimer(timeLeft);
      if (timeLeft <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        timeLeft = phases[phaseIdx].duration;
        setBreathePhase(phases[phaseIdx].phase);
        setBreatheTimer(timeLeft);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  const selectMood = (mood: Mood) => {
    onUpdateProfile({ currentMood: mood });
    setShowMoodPicker(false);
  };

  const companionMessage = () => {
    if (profile.currentMood === 'sad') return moodTheme.companionMessage;
    if (profile.currentMood === 'anxious') return moodTheme.companionMessage;
    return `${greeting}, ${profile.name || 'friend'}! ${companion.greeting}`;
  };

  // Environment elements
  const environmentElements = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      emoji: companionEnv.elements[i % companionEnv.elements.length],
      x: 5 + i * 12,
      y: 10 + (i % 3) * 20,
      delay: i * 0.8,
      size: 18 + (i % 3) * 6,
    }));
  }, [companionEnv]);

  return (
    <MoodWorld mood={profile.currentMood}>
      {/* Desktop Layout Wrapper */}
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: moodTheme.textSecondary }}>{moodTheme.weather}</p>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: moodTheme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
                {greeting}, {profile.name || 'Friend'}
              </h1>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Mood Display */}
              <button
                onClick={() => setShowMoodPicker(true)}
                className="rounded-2xl px-5 py-3 flex items-center gap-3 hover:scale-105 transition-all cursor-pointer"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <span className="text-3xl animate-float">{moodConfig.emoji}</span>
                <div className="text-left">
                  <p className="text-xs" style={{ color: moodTheme.textSecondary }}>Feeling</p>
                  <p className="font-bold" style={{ color: moodTheme.textPrimary }}>{moodConfig.label}</p>
                </div>
              </button>
              {/* Stats */}
              <div
                className="rounded-2xl px-5 py-3 flex items-center gap-4"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-bold" style={{ color: moodTheme.textPrimary }}>{profile.streakDays}</span>
                  </div>
                  <p className="text-xs" style={{ color: moodTheme.textSecondary }}>Streak</p>
                </div>
                <div className="w-px h-8" style={{ background: moodTheme.cardBorder }} />
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-sm">🪙</span>
                    <span className="text-lg font-bold" style={{ color: moodTheme.textPrimary }}>{profile.moodCoins}</span>
                  </div>
                  <p className="text-xs" style={{ color: moodTheme.textSecondary }}>Coins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Bento Grid - Companion takes ~40% width */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Companion World - ~40% width */}
            <div className="col-span-12 lg:col-span-5 row-span-2">
              <div
                className="bento-card rounded-3xl overflow-hidden relative transition-all hover:scale-[1.01]"
                style={{
                  minHeight: '420px',
                  background: `linear-gradient(180deg, ${companionEnv.bgImage})`,
                  border: `1px solid ${moodTheme.cardBorder}`,
                  boxShadow: `0 8px 40px ${moodTheme.accentGlow}`,
                }}
              >
                {/* Environment atmosphere */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 70% 60%, ${companionEnv.atmosphericColor}, transparent 70%)` }}
                />

                {/* Environment elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {environmentElements.map((el, i) => (
                    <div
                      key={i}
                      className="absolute animate-float"
                      style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        fontSize: `${el.size}px`,
                        animationDelay: `${el.delay}s`,
                        opacity: 0.6,
                      }}
                    >
                      {el.emoji}
                    </div>
                  ))}
                </div>

                {/* Ground effect */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: `linear-gradient(0deg, ${companionEnv.groundColor}30, transparent)` }}
                />

                {/* Companion */}
                <div className="absolute inset-0 flex items-center justify-center pb-16 pt-8">
                  <div
                    className="relative animate-float"
                    style={{ transform: `scale(${moodTheme.companionScale})` }}
                  >
                    <AnimatedCompanion
                      type={profile.companion}
                      mood={moodTheme.companionMood}
                      size="xl"
                      interactive
                      showSpeech
                      message={companionMessage()}
                    />
                  </div>
                </div>

                {/* Companion info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4"
                  style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{companion.emoji}</span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>{companion.name}</p>
                        <p className="text-xs" style={{ color: moodTheme.textSecondary }}>{companionEnv.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('sanctuary')}
                      className="text-xs font-semibold flex items-center gap-1 hover:underline"
                      style={{ color: moodTheme.accent }}
                    >
                      Visit <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Companion Bond Bar */}
              <div
                className="mt-4 rounded-2xl p-4"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div className="flex justify-between text-xs mb-2" style={{ color: moodTheme.textSecondary }}>
                  <span>Bond with {companion.name}</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${moodTheme.accent}20` }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: '35%', background: `linear-gradient(90deg, ${companion.color}, ${companion.color}88)` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - 60% width */}
            <div className="col-span-12 lg:col-span-7 space-y-4 lg:space-y-6">
              {/* XP Progress + Level */}
              <div
                className="bento-card rounded-2xl p-4 flex items-center gap-4"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `linear-gradient(135deg, ${moodTheme.accent}, ${moodTheme.accent}aa)` }}
                >
                  <Star className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold" style={{ color: moodTheme.textPrimary }}>Level {profile.level} — Seedling</span>
                    <span className="text-sm" style={{ color: moodTheme.textSecondary }}>{profile.xp} XP</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: `${moodTheme.accent}20` }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${levelProgress}%`, background: `linear-gradient(90deg, ${moodTheme.accent}, ${moodTheme.accent}88)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Daily Missions + Quick Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Missions */}
                <div
                  className="bento-card rounded-2xl p-4"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>Missions</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      +{missions.filter(m => m.done).reduce((s, m) => s + m.xp, 0)} XP
                    </span>
                  </div>
                  <div className="space-y-2">
                    {missions.slice(0, 3).map(m => (
                      <div key={m.id} className={`flex items-center gap-2 p-2 rounded-lg ${m.done ? 'bg-green-50' : ''}`}>
                        <span className="text-base">{m.emoji}</span>
                        <span className={`text-xs flex-1 ${m.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {m.title}
                        </span>
                        {m.done ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div
                  className="bento-card rounded-2xl p-4"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" style={{ color: moodTheme.accent }} />
                      <span className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>AI Insight</span>
                    </div>
                  </div>
                  <div className="text-center py-3">
                    <div className="text-2xl font-bold mb-1" style={{ color: moodTheme.textPrimary }}>
                      {profile.currentMood === 'sad' ? '38' : profile.currentMood === 'anxious' ? '52' : '68'}%
                    </div>
                    <p className="text-xs" style={{ color: moodTheme.textSecondary }}>
                      {profile.currentMood === 'sad' ? 'Burnout risk' : profile.currentMood === 'anxious' ? 'Anxiety level' : 'Positivity score'}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('insights')}
                    className="w-full text-xs font-semibold py-2 rounded-lg hover:bg-white/50 transition-colors"
                    style={{ color: moodTheme.accent }}
                  >
                    View Full Report
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { emoji: '🎭', label: 'Mood', nav: 'home' },
                  { emoji: '📝', label: 'Journal', nav: 'journal' },
                  { emoji: '💨', label: 'Breathe', action: () => setBreathingActive(true) },
                  { emoji: '🎮', label: 'Play', nav: 'arcade' },
                ].map(a => (
                  <button
                    key={a.label}
                    onClick={() => a.nav ? onNavigate(a.nav) : a.action?.()}
                    className="rounded-xl p-3 flex flex-col items-center gap-2 hover:scale-105 transition-all"
                    style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                  >
                    <span className="text-2xl animate-float">{a.emoji}</span>
                    <span className="text-xs font-medium" style={{ color: moodTheme.textSecondary }}>{a.label}</span>
                  </button>
                ))}
              </div>

              {/* Weekly Mood */}
              <div
                className="bento-card rounded-2xl p-4"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" style={{ color: moodTheme.accent }} />
                    <span className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>This Week</span>
                  </div>
                  <button onClick={() => onNavigate('insights')} className="text-xs font-medium" style={{ color: moodTheme.accent }} >
                    View trends
                  </button>
                </div>
                <div className="flex items-end justify-between gap-1">
                  {MOOD_WEEK.map((mood, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full rounded-t transition-all"
                        style={{
                          height: `${30 + Math.random() * 40}px`,
                          background: `${MOOD_CONFIG[mood].color}66`,
                          minHeight: '16px',
                        }}
                      />
                      <span className="text-xs" style={{ color: moodTheme.textSecondary }}>{DAY_LABELS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Journal & Achievements Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Recent Journal */}
                <div
                  className="bento-card rounded-2xl p-4"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-500" />
                      <span className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>Journal</span>
                    </div>
                    <button onClick={() => onNavigate('journal')} className="text-xs" style={{ color: moodTheme.accent }}>+</button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: 'Finding peace...', mood: 'calm' },
                      { title: 'Great morning...', mood: 'happy' },
                    ].map((e, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/50">
                        <span className="text-lg">{MOOD_CONFIG[e.mood].emoji}</span>
                        <span className="text-xs truncate flex-1" style={{ color: moodTheme.textSecondary }}>{e.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div
                  className="bento-card rounded-2xl p-4"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>Badges</span>
                    </div>
                    <button onClick={() => onNavigate('profile')} className="text-xs" style={{ color: moodTheme.accent }}>All</button>
                  </div>
                  <div className="flex justify-center gap-2">
                    {['🌱', '🔥', '💪', '⭐'].map((icon, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${i > 1 ? 'opacity-30 grayscale' : ''}`}
                        style={{ background: i <= 1 ? moodTheme.cardBg : 'gray-100' }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Picker Modal */}
      {showMoodPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowMoodPicker(false)}>
          <div
            className="rounded-3xl p-8 w-full max-w-md animate-scale-in mx-4"
            style={{ background: moodTheme.cardBg, border: `2px solid ${moodTheme.cardBorder}` }}
            onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-center mb-6" style={{ fontFamily: 'Playfair Display, serif', color: moodTheme.textPrimary }}>
              How are you feeling right now?
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(MOOD_CONFIG) as [Mood, typeof MOOD_CONFIG[Mood]][]).map(([mood, cfg]) => (
                <button key={mood}
                  onClick={() => selectMood(mood)}
                  className={`py-5 rounded-2xl flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                    profile.currentMood === mood ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    background: `${cfg.color}15`,
                    ringColor: cfg.color,
                    offsetColor: moodTheme.cardBg,
                  }}>
                  <span className="text-3xl">{cfg.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: moodTheme.textPrimary }}>{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breathing Modal */}
      {breathingActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setBreathingActive(false)}>
          <div
            className="rounded-3xl p-10 w-full max-w-sm animate-scale-in mx-4 text-center"
            style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-6" style={{ color: moodTheme.textPrimary }}>Box Breathing</h3>
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  breathePhase === 'inhale' ? 'scale-125' : breathePhase === 'exhale' ? 'scale-90' : 'scale-100'
                }`}
                style={{ borderColor: '#22c55e', background: 'rgba(34,197,34,0.1)' }}
              />
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600">{breatheTimer}</div>
                <div className="text-xs capitalize mt-1" style={{ color: moodTheme.textSecondary }}>{breathePhase}</div>
              </div>
            </div>
            <p className="text-sm font-medium mb-6" style={{ color: moodTheme.textSecondary }}>
              {breathePhase === 'inhale' ? '🌬️ Breathe in...' : breathePhase === 'hold' ? '⏸️ Hold...' : '💨 Breathe out...'}
            </p>
            <button onClick={() => setBreathingActive(false)} className="text-sm" style={{ color: moodTheme.textSecondary }}>
              Close
            </button>
          </div>
        </div>
      )}
    </MoodWorld>
  );
};

export default Home;
