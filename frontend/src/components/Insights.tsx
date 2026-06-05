import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Info, Heart, Zap } from 'lucide-react';
import type { Mood, UserProfile } from '../types';
import { MOOD_CONFIG } from '../types';
import { FloatingWorld } from './FloatingWorld';
import { useToast } from './ToastContext';

interface InsightsProps {
  profile: UserProfile;
}

const MOOD_DATA: { day: string; mood: Mood; score: number }[] = [
  { day: 'Mon', mood: 'happy', score: 82 },
  { day: 'Tue', mood: 'calm', score: 74 },
  { day: 'Wed', mood: 'neutral', score: 60 },
  { day: 'Thu', mood: 'anxious', score: 42 },
  { day: 'Fri', mood: 'happy', score: 80 },
  { day: 'Sat', mood: 'excited', score: 90 },
  { day: 'Sun', mood: 'calm', score: 76 },
];

const DEFAULT_AI_INSIGHTS = [
  {
    title: 'Peak Energy Time', insight: "You're most positive between 9-11 AM. Schedule important tasks then.",
    icon: '⚡', color: '#fbbf24', confidence: 87,
  },
  {
    title: 'Anxiety Trigger Pattern', insight: 'Your anxiety often spikes on Wednesday evenings. Likely related to work.',
    icon: '🔍', color: '#f97316', confidence: 72,
  },
  {
    title: 'Mood Booster Identified', insight: 'Journal entries mentioning "exercise" correlate with +28% better mood.',
    icon: '🏃', color: '#22c55e', confidence: 91,
  },
  {
    title: 'Sleep & Mood Link', insight: 'Days you mention "tired" show 40% lower positivity scores.',
    icon: '😴', color: '#60a5fa', confidence: 85,
  },
];

const getDynamicInsights = (goals: string[]) => {
  const insights = [];
  
  if (goals.includes('stress')) {
    insights.push({
      title: 'Stress Management', insight: 'Taking short breaks every 90 minutes reduces your stress signals by 35%.',
      icon: '😮‍💨', color: '#22c55e', confidence: 88,
    });
  }
  if (goals.includes('sleep')) {
    insights.push({
      title: 'Sleep Optimization', insight: 'Going to bed before 11 PM correlates with a 40% higher mood score the next day.',
      icon: '😴', color: '#60a5fa', confidence: 92,
    });
  }
  if (goals.includes('focus') || goals.includes('productivity')) {
    insights.push({
      title: 'Peak Focus Time', insight: 'You are most productive between 10 AM and 12 PM. Tackle hard tasks then!',
      icon: '🎯', color: '#fbbf24', confidence: 85,
    });
  }
  if (goals.includes('anxiety')) {
    insights.push({
      title: 'Anxiety Pattern', insight: 'Your anxiety is lowest after engaging in mindful breathing exercises.',
      icon: '💆', color: '#a855f7', confidence: 78,
    });
  }
  
  // Fill the rest with defaults if not enough goals
  for (const def of DEFAULT_AI_INSIGHTS) {
    if (insights.length >= 4) break;
    if (!insights.find(i => i.title === def.title)) {
      insights.push(def);
    }
  }
  
  return insights.slice(0, 4);
};

const getRecommendedHabits = (goals: string[]) => {
  const habits = [];
  
  if (goals.includes('stress') || goals.includes('anxiety')) {
    habits.push({ habit: '5-min box breathing', benefit: 'Quickly lowers heart rate and stress', emoji: '🌬️' });
  }
  if (goals.includes('sleep')) {
    habits.push({ habit: 'Digital sunset at 9pm', benefit: 'Improves sleep quality and deep sleep', emoji: '🌙' });
  }
  if (goals.includes('happiness') || goals.includes('motivation')) {
    habits.push({ habit: 'Gratitude journaling', benefit: 'Boosts baseline happiness score', emoji: '📝' });
  }
  if (goals.includes('productivity') || goals.includes('focus')) {
    habits.push({ habit: 'Pomodoro Technique', benefit: 'Enhances focus and prevents burnout', emoji: '⏱️' });
  }
  
  // Defaults
  const defaultHabits = [
    { habit: 'Morning stretching', benefit: 'Wakes up the body', emoji: '🧘' },
    { habit: 'Drink 8 glasses of water', benefit: 'Keeps energy levels stable', emoji: '💧' },
    { habit: 'Take a 15-min walk', benefit: 'Clears the mind', emoji: '🚶' },
  ];
  
  for (const def of defaultHabits) {
    if (habits.length >= 3) break;
    if (!habits.find(h => h.habit === def.habit)) {
      habits.push(def);
    }
  }
  
  return habits.slice(0, 3);
};

const DNA_TRAITS = [
  { label: 'Empathy', value: 78, color: '#f43f5e' },
  { label: 'Resilience', value: 65, color: '#0ea5e9' },
  { label: 'Mindfulness', value: 52, color: '#22c55e' },
  { label: 'Creativity', value: 84, color: '#fbbf24' },
  { label: 'Social Energy', value: 71, color: '#f97316' },
  { label: 'Inner Calm', value: 59, color: '#a855f7' },
];

const Insights: React.FC<InsightsProps> = ({ profile, onUpdateProfile }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'dna' | 'predict' | 'habits'>('overview');

  const burnoutScore = 38;
  const burnoutColor = burnoutScore > 70 ? '#ef4444' : burnoutScore > 40 ? '#f97316' : '#22c55e';
  const burnoutLabel = burnoutScore > 70 ? 'High Risk' : burnoutScore > 40 ? 'Moderate' : 'Low Risk';
  
  const dynamicInsights = getDynamicInsights(profile.goals || []);
  const dynamicHabits = getRecommendedHabits(profile.goals || []);

  return (
    <FloatingWorld mood={profile.currentMood} equippedBackground={profile.equippedBackground}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>AI Insights</h1>
            <p className="text-gray-500 mt-1">Your emotional intelligence dashboard</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'dna', label: 'Emotional DNA', icon: Brain },
              { id: 'predict', label: 'Predictions', icon: Target },
              { id: 'habits', label: 'Habits', icon: Zap },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all flex-shrink-0 ${
                  activeTab === id ? 'text-white' : 'glass text-gray-600 hover:bg-gray-50'
                }`}
                style={activeTab === id ? { background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' } : {}}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Mood Chart */}
              <div className="col-span-12 lg:col-span-8 bento-card glass-card rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-sky-500" />
                  <h3 className="font-bold text-gray-800 text-lg">Mood This Week</h3>
                </div>
                <div className="flex items-end gap-4 h-40">
                  {MOOD_DATA.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${(d.score / 100) * 100}px`,
                          background: `${MOOD_CONFIG[d.mood].color}88`,
                          minHeight: '16px',
                        }} />
                      <span className="text-sm">{MOOD_CONFIG[d.mood].emoji}</span>
                      <span className="text-xs text-gray-500">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Burnout Score */}
              <div className="col-span-12 lg:col-span-4 bento-card glass-card rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5" style={{ color: burnoutColor }} />
                  <h3 className="font-bold text-gray-800">Burnout Risk</h3>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">{burnoutScore}</span>
                  <span className="text-lg text-gray-500 mb-2">/100</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${burnoutScore}%`,
                      background: burnoutScore > 70
                        ? 'linear-gradient(90deg, #fbbf24, #ef4444)'
                        : burnoutScore > 40
                        ? 'linear-gradient(90deg, #22c55e, #fbbf24)'
                        : 'linear-gradient(90deg, #22c55e, #4ade80)',
                    }} />
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ color: burnoutColor, background: `${burnoutColor}15` }}>
                  {burnoutLabel}
                </span>
                <p className="text-sm text-gray-600 mt-4">
                  {burnoutScore < 40
                    ? "You're thriving! Keep the healthy habits."
                    : "Some stress detected. Consider rest."}
                </p>
              </div>

              {/* AI Insights */}
              <div className="col-span-12">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-sky-500" />
                  <h3 className="font-bold text-gray-800 text-lg">AI Observations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dynamicInsights.map(ins => (
                    <div key={ins.title} className="bento-card glass-card rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{ins.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-gray-800">{ins.title}</p>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: `${ins.color}15`, color: ins.color }}>
                              {ins.confidence}% sure
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{ins.insight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dna' && (
            <div className="grid grid-cols-12 gap-6">
              {/* DNA Hero */}
              <div className="col-span-12 bento-card glass-card rounded-3xl p-8 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(34,197,94,0.1))' }}>
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #22c55e)' }}>
                  🧬
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Emotional DNA
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  A unique blueprint of your emotional personality, crafted by AI from your journal entries and mood patterns.
                </p>
              </div>

              {/* Archetype */}
              <div className="col-span-12 lg:col-span-4 bento-card glass-card rounded-3xl p-6">
                <div className="text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <p className="text-sm text-gray-500 mb-1">Emotional Archetype</p>
                  <p className="text-2xl font-bold gradient-text-sky" style={{ fontFamily: 'Playfair Display, serif' }}>
                    The Empathetic Creator
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  High empathy and creativity make you uniquely gifted at understanding others and expressing yourself.
                </p>
              </div>

              {/* DNA Traits */}
              <div className="col-span-12 lg:col-span-8 bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-6">Core Traits</h3>
                <div className="grid grid-cols-2 gap-6">
                  {DNA_TRAITS.map(trait => (
                    <div key={trait.label}>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">{trait.label}</span>
                        <span className="font-bold" style={{ color: trait.color }}>{trait.value}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${trait.value}%`, background: `linear-gradient(90deg, ${trait.color}, ${trait.color}88)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predict' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Tomorrow Forecast */}
              <div className="col-span-12 lg:col-span-6 bento-card glass-card rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-sky-500" />
                  <h3 className="font-bold text-gray-800 text-lg">Tomorrow's Forecast</h3>
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-6xl">😊</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Positive Day Likely</p>
                    <p className="text-sm text-gray-500">78% probability</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Energy Level', value: 72, icon: '⚡' },
                    { label: 'Stress Risk', value: 30, icon: '🌊' },
                    { label: 'Focus Quality', value: 81, icon: '🎯' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xl w-8">{item.icon}</span>
                      <span className="text-sm text-gray-600 w-28">{item.label}</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-sky-400" style={{ width: `${item.value}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-10">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Forecast */}
              <div className="col-span-12 lg:col-span-6 bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-6">This Week's Forecast</h3>
                <div className="flex gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const moods: Mood[] = ['happy', 'calm', 'happy', 'neutral', 'happy', 'excited', 'calm'];
                    return (
                      <div key={day} className="flex-1 text-center">
                        <div className="text-2xl mb-2">{MOOD_CONFIG[moods[i]].emoji}</div>
                        <div className="text-xs text-gray-500">{day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="col-span-12 bento-card glass-card rounded-2xl p-5 border border-sky-200 bg-sky-50/50">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-sky-700 leading-relaxed">
                    Predictions are based on your journal entries, mood logs, and behavioral patterns. Not medical advice.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Habit Correlations */}
              <div className="col-span-12 lg:col-span-6 bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-6">Habit Correlations</h3>
                <p className="text-sm text-gray-500 mb-6">Activities that most impact your mood:</p>
                <div className="space-y-3">
                  {[
                    { habit: 'Morning Walk', impact: '+32% mood', color: '#22c55e', trend: 'up' },
                    { habit: 'Late Screens', impact: '-24% sleep', color: '#ef4444', trend: 'down' },
                    { habit: 'Journaling', impact: '+28% clarity', color: '#0ea5e9', trend: 'up' },
                    { habit: 'Social Time', impact: '+19% happiness', color: '#f97316', trend: 'up' },
                    { habit: 'Skipping Meals', impact: '-31% energy', color: '#ef4444', trend: 'down' },
                  ].map(h => (
                    <div key={h.habit} className="flex items-center gap-4 p-4 rounded-xl bg-white/60">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `${h.color}15` }}>
                        <TrendingUp className="w-5 h-5" style={{
                          color: h.color,
                          transform: h.trend === 'down' ? 'scaleY(-1)' : 'none',
                        }} />
                      </div>
                      <span className="flex-1 font-medium text-gray-700">{h.habit}</span>
                      <span className="font-bold text-sm" style={{ color: h.color }}>{h.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Habits */}
              <div className="col-span-12 lg:col-span-6 bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-6">Recommended Habits</h3>
                <div className="space-y-4">
                  {dynamicHabits.map(r => (
                    <div key={r.habit} className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                      <span className="text-3xl">{r.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{r.habit}</p>
                        <p className="text-sm text-gray-500">{r.benefit}</p>
                      </div>
                      <button 
                        className="text-xs font-bold text-sky-600 px-3 py-1.5 bg-sky-100 rounded-lg hover:bg-sky-200 transition-colors" 
                        onClick={() => {
                          const currentGoals = profile.goals || [];
                          if (!currentGoals.includes(r.habit)) {
                            onUpdateProfile?.({ goals: [...currentGoals, r.habit] });
                          }
                          showToast('Habit added to your tracker!', 'success');
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FloatingWorld>
  );
};

export default Insights;
