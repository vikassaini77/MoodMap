import React, { useState } from 'react';
import { Camera, Award, Star, Flame, Edit2, ChevronRight, Trophy, Upload, Settings, LogOut } from 'lucide-react';
import type { Mood, UserProfile } from '../types';
import { MOOD_CONFIG, COMPANIONS } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import AnimatedCompanion from './AnimatedCompanion';
import { MoodWorld } from './MoodWorld';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate?: (page: any) => void;
  onSignOut?: () => void;
}

const ACHIEVEMENTS = [
  { icon: '🌱', title: 'First Step', desc: 'Joined MoodMap X', unlocked: true, progress: 100 },
  { icon: '🔥', title: '7-Day Streak', desc: '7 days of logging', unlocked: false, progress: 71 },
  { icon: '📝', title: 'Storyteller', desc: 'Wrote 10 journal entries', unlocked: false, progress: 60 },
  { icon: '🎮', title: 'Gamer', desc: 'Played 5 games', unlocked: false, progress: 40 },
  { icon: '💪', title: 'Resilient', desc: 'Logged through a tough week', unlocked: true, progress: 100 },
  { icon: '🌟', title: 'Shining Star', desc: 'Reached Level 5', unlocked: false, progress: 20 },
  { icon: '🦋', title: 'Transformed', desc: 'Improved mood score by 30%', unlocked: false, progress: 45 },
  { icon: '💎', title: 'Diamond Mind', desc: 'Reached Level 10', unlocked: false, progress: 10 },
];

const DNA_TRAITS = [
  { label: 'Empathy', value: 78, color: '#f43f5e' },
  { label: 'Resilience', value: 65, color: '#0ea5e9' },
  { label: 'Creativity', value: 84, color: '#fbbf24' },
  { label: 'Mindfulness', value: 52, color: '#22c55e' },
  { label: 'Social Energy', value: 71, color: '#f97316' },
  { label: 'Inner Calm', value: 59, color: '#a855f7' },
];

const MOOD_TIMELINE: { date: string; mood: Mood; energy: number; note: string }[] = [
  { date: 'Today', mood: 'happy', energy: 8, note: 'Great morning workout!' },
  { date: 'Yesterday', mood: 'calm', energy: 7, note: 'Peaceful evening reading' },
  { date: '2 days ago', mood: 'happy', energy: 9, note: 'Met friends for coffee' },
  { date: '3 days ago', mood: 'anxious', energy: 5, note: 'Work deadline stress' },
  { date: '4 days ago', mood: 'neutral', energy: 6, note: 'Regular day' },
];

const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile, onNavigate, onSignOut }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'timeline'>('overview');
  const levelProgress = ((profile.xp % 500) / 500) * 100;
  const moodTheme = MOOD_THEMES[profile.currentMood];

  const saveName = () => {
    onUpdateProfile({ name: nameInput });
    setEditingName(false);
  };

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <MoodWorld mood={profile.currentMood}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: moodTheme.textPrimary }}>
              Profile
            </h1>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-semibold shadow-sm border border-red-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>

          {/* Main Profile Card with Cover */}
          <div
            className="bento-card rounded-3xl overflow-hidden mb-8"
            style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
          >
            {/* Cover Image */}
            <div
              className="h-40 relative overflow-hidden cursor-pointer group"
              style={{ background: `linear-gradient(135deg, ${moodTheme.accent}30, ${moodTheme.accent}15)` }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="absolute animate-float"
                  style={{
                    left: `${8 + i * 10}%`,
                    top: `${15 + (i % 3) * 20}%`,
                    fontSize: `${16 + (i % 3) * 8}px`,
                    animationDelay: `${i * 0.4}s`,
                    opacity: 0.3,
                  }}
                >
                  {moodTheme.particles[i % moodTheme.particles.length]}
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Upload className="w-5 h-5" />
                  Change Cover
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative px-8 pb-8 -mt-16">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div
                  className="w-28 h-28 rounded-2xl border-4 flex items-center justify-center text-4xl shadow-xl cursor-pointer group"
                  style={{ borderColor: moodTheme.cardBg, background: `linear-gradient(135deg, ${moodTheme.accent}20, ${moodTheme.accent}10)` }}
                >
                  {profile.name ? profile.name[0].toUpperCase() : '😊'}
                  <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Name & Editable */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingName ? (
                    <input
                      className="text-2xl font-bold border-b-2 bg-transparent focus:outline-none w-full max-w-xs"
                      style={{ fontFamily: 'Playfair Display, serif', borderColor: moodTheme.accent, color: moodTheme.textPrimary }}
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onBlur={saveName}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'Playfair Display, serif', color: moodTheme.textPrimary }}
                      >
                        {profile.name || 'Your Name'}
                      </h2>
                      <button onClick={() => setEditingName(true)}>
                        <Edit2 className="w-4 h-4 hover:scale-110 transition-transform" style={{ color: moodTheme.textSecondary }} />
                      </button>
                    </div>
                  )}
                  <p className="text-sm mt-1" style={{ color: moodTheme.textSecondary }}>
                    {profile.occupation || 'MoodMap Explorer'} • Level {profile.level}
                  </p>
                </div>

                {/* Mini Companion */}
                <div className="flex items-center gap-3">
                  <AnimatedCompanion type={profile.companion} mood={profile.currentMood} size="sm" />
                  <div>
                    <p className="font-bold text-sm" style={{ color: moodTheme.textPrimary }}>{COMPANIONS[profile.companion].name}</p>
                    <p className="text-xs" style={{ color: moodTheme.textSecondary }}>{COMPANIONS[profile.companion].personality}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                {[
                  { value: profile.streakDays, label: 'Day Streak', icon: '🔥', color: '#f97316' },
                  { value: profile.level, label: 'Level', icon: '⭐', color: '#fbbf24' },
                  { value: profile.moodCoins, label: 'Coins', icon: '🪙', color: '#fbbf24' },
                  { value: unlockedCount, label: 'Badges', icon: '🏆', color: '#a855f7' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="text-center p-3 rounded-xl"
                    style={{ background: `${s.color}10` }}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-2xl font-bold" style={{ color: moodTheme.textPrimary }}>{s.value}</span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: moodTheme.textSecondary }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* XP Progress */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: `${moodTheme.accent}10` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" style={{ color: moodTheme.accent }} fill="currentColor" />
                    <span className="font-semibold" style={{ color: moodTheme.textPrimary }}>Level {profile.level} Progress</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: moodTheme.textSecondary }}>
                    {profile.xp} / {profile.level * 500} XP
                  </span>
                </div>
                <div className="h-4 rounded-full overflow-hidden" style={{ background: `${moodTheme.accent}20` }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${levelProgress}%`, background: `linear-gradient(90deg, ${moodTheme.accent}, ${moodTheme.accent}aa)` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'timeline', label: 'Timeline', icon: '📅' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'text-white' : ''
                }`}
                style={{
                  background: activeTab === tab.id ? `linear-gradient(135deg, ${moodTheme.accent}, ${moodTheme.accent}aa)` : moodTheme.cardBg,
                  color: activeTab === tab.id ? 'white' : moodTheme.textSecondary,
                  border: activeTab === tab.id ? 'none' : `1px solid ${moodTheme.cardBorder}`,
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - DNA & Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Emotional DNA */}
              <div
                className="bento-card rounded-3xl p-6"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🧬</div>
                    <h3 className="font-bold" style={{ color: moodTheme.textPrimary }}>Emotional DNA</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  {DNA_TRAITS.map(trait => (
                    <div key={trait.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: moodTheme.textSecondary }}>{trait.label}</span>
                        <span className="font-bold" style={{ color: trait.color }}>{trait.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${trait.color}20` }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${trait.value}%`, background: trait.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center mt-4 p-3 rounded-xl" style={{ background: `${moodTheme.accent}10` }}>
                  <span className="text-xl font-bold gradient-text-sky" style={{ fontFamily: 'Playfair Display, serif' }}>
                    The Empathetic Creator
                  </span>
                </p>
              </div>

              {/* Companion Collection */}
              <div
                className="bento-card rounded-3xl p-6"
                style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: moodTheme.textPrimary }}>Companions</h3>
                  <button className="text-xs font-semibold" style={{ color: moodTheme.accent }} onClick={() => alert('Keep chatting with your companion and maintaining streaks to unlock more achievements!')}>Unlock More</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(COMPANIONS) as [keyof typeof COMPANIONS, typeof COMPANIONS[keyof typeof COMPANIONS]][]).map(([type, c]) => {
                    const isCurrent = profile.companion === type;
                    const isLocked = !isCurrent && Math.random() > 0.5;
                    return (
                      <div
                        key={type}
                        className={`rounded-xl p-2 text-center transition-all ${isCurrent ? 'scale-105' : ''} ${isLocked ? 'opacity-30 grayscale' : 'hover:scale-105 cursor-pointer'}`}
                        style={{
                          background: isCurrent ? `${c.color}20` : 'rgba(255,255,255,0.5)',
                          border: isCurrent ? `2px solid ${c.color}` : 'none',
                        }}
                      >
                        {isLocked ? (
                          <div className="text-2xl my-1">🔒</div>
                        ) : (
                          <AnimatedCompanion type={type} mood="happy" size="sm" />
                        )}
                        <p className="text-xs font-semibold mt-1" style={{ color: moodTheme.textSecondary }}>{c.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Content varies by tab */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Mood Frequency */}
                  <div
                    className="bento-card rounded-3xl p-6"
                    style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                  >
                    <h3 className="font-bold text-lg mb-6" style={{ color: moodTheme.textPrimary }}>Mood Distribution</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {(['happy', 'calm', 'sad', 'excited', 'anxious', 'neutral'] as Mood[]).map(mood => {
                        const count = Math.floor(Math.random() * 15) + 1;
                        const cfg = MOOD_CONFIG[mood];
                        return (
                          <div
                            key={mood}
                            className="flex items-center gap-3 p-3 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                            style={{ background: `${cfg.color}10` }}
                          >
                            <span className="text-2xl">{cfg.emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm capitalize" style={{ color: moodTheme.textPrimary }}>{cfg.label}</p>
                              <div className="h-2 rounded-full overflow-hidden mt-1" style={{ background: `${cfg.color}30` }}>
                                <div className="h-full rounded-full" style={{ width: `${(count / 15) * 100}%`, background: cfg.color }} />
                              </div>
                            </div>
                            <span className="font-bold text-sm" style={{ color: moodTheme.textSecondary }}>{count}x</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Journal', emoji: '📝', page: 'journal' },
                      { label: 'Insights', emoji: '🧬', page: 'insights' },
                      { label: 'Shop', emoji: '🛒', page: 'shop' },
                      { label: 'Settings', emoji: '⚙️', page: 'settings' },
                    ].map(s => (
                      <button
                        key={s.label}
                        onClick={() => onNavigate?.(s.page as any)}
                        className="bento-card flex items-center gap-3 p-4 hover:scale-[1.02] transition-all"
                        style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="font-medium text-sm" style={{ color: moodTheme.textPrimary }}>{s.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" style={{ color: moodTheme.textSecondary }} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'achievements' && (
                <div
                  className="bento-card rounded-3xl p-6"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-amber-500" />
                      <h3 className="font-bold text-lg" style={{ color: moodTheme.textPrimary }}>Achievements</h3>
                    </div>
                    <span className="text-sm" style={{ color: moodTheme.textSecondary }}>
                      {unlockedCount}/{ACHIEVEMENTS.length} unlocked
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ACHIEVEMENTS.map(a => (
                      <div
                        key={a.title}
                        className={`text-center p-4 rounded-xl transition-all ${
                          a.unlocked ? '' : 'opacity-50'
                        }`}
                        style={{ background: a.unlocked ? `${moodTheme.accent}10` : 'rgba(255,255,255,0.3)' }}
                      >
                        <div className={`text-3xl mb-2 ${!a.unlocked ? 'grayscale' : ''}`}>{a.icon}</div>
                        <p className="font-semibold text-sm" style={{ color: moodTheme.textPrimary }}>{a.title}</p>
                        <p className="text-xs mt-1" style={{ color: moodTheme.textSecondary }}>{a.desc}</p>
                        {!a.unlocked && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gray-400" style={{ width: `${a.progress}%` }} />
                            </div>
                            <p className="text-xs mt-1" style={{ color: moodTheme.textSecondary }}>{a.progress}%</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div
                  className="bento-card rounded-3xl p-6"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
                >
                  <h3 className="font-bold text-lg mb-6" style={{ color: moodTheme.textPrimary }}>Mood Timeline</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ background: `${moodTheme.accent}30` }} />
                    <div className="space-y-4">
                      {MOOD_TIMELINE.map((entry, i) => (
                        <div key={i} className="relative flex gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl z-10"
                            style={{ background: moodTheme.cardBg, border: `2px solid ${MOOD_CONFIG[entry.mood].color}` }}
                          >
                            {MOOD_CONFIG[entry.mood].emoji}
                          </div>
                          <div
                            className="flex-1 p-4 rounded-xl"
                            style={{ background: `${MOOD_CONFIG[entry.mood].color}10` }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold" style={{ color: moodTheme.textPrimary }}>{entry.date}</span>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, star) => (
                                  <div
                                    key={star}
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: star < Math.round(entry.energy / 2) ? '#fbbf24' : '#e5e7eb' }}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm" style={{ color: moodTheme.textSecondary }}>{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MoodWorld>
  );
};

export default Profile;
