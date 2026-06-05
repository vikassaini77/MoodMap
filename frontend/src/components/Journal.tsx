import React, { useState } from 'react';
import { Plus, Search, TrendingUp, BookOpen, Calendar, Tag } from 'lucide-react';
import type { Mood, UserProfile, JournalEntry } from '../types';
import { MOOD_CONFIG } from '../types';
import { FloatingWorld } from './FloatingWorld';
import { useToast } from './ToastContext';
import { DEFAULT_MISSIONS } from '../App';

interface JournalProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (page: any) => void;
}

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: '1', date: new Date(Date.now() - 86400000).toISOString(), title: 'Finding peace in small moments',
    content: "Today I noticed the morning light through my window and felt genuinely grateful. Small victories: finished my project, had a good lunch, called mom.",
    mood: 'calm', sentiment: 78, tags: ['gratitude', 'work', 'family'],
  },
  {
    id: '2', date: new Date(Date.now() - 172800000).toISOString(), title: 'Overwhelming but I pushed through',
    content: "Work was incredibly stressful. Deadlines piling up. But I remembered to breathe. My companion helped me through it.",
    mood: 'anxious', sentiment: 45, tags: ['work', 'stress', 'growth'],
  },
  {
    id: '3', date: new Date(Date.now() - 259200000).toISOString(), title: 'Best day in a while!',
    content: "Went for a run, met a friend for coffee, laughed until my stomach hurt. Life is genuinely beautiful sometimes.",
    mood: 'happy', sentiment: 92, tags: ['friends', 'exercise', 'joy'],
  },
  {
    id: '4', date: new Date(Date.now() - 345600000).toISOString(), title: 'Quiet Sunday reflection',
    content: "Spent the day reading and journaling. Sometimes doing nothing is the most productive thing.",
    mood: 'calm', sentiment: 75, tags: ['self-care', 'reading', 'peace'],
  },
];

const Journal: React.FC<JournalProps> = ({ profile, onUpdateProfile, onNavigate }) => {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>(profile.journalEntries || SAMPLE_ENTRIES);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<Mood>(profile.currentMood);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const filteredEntries = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  );

  const saveEntry = async () => {
    if (!newTitle.trim()) return;
    
    try {
      const { saveJournalEntry } = await import('../api');
      const apiResponse = await saveJournalEntry({
        user_id: profile.id,
        date: new Date().toISOString(),
        mood: newMood,
        note: newContent,
        sleep_hours: 7,
        energy_level: 5
      });
      
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: newTitle,
        content: apiResponse.companionResponse ? `${newContent}\n\n🌟 Companion says: ${apiResponse.companionResponse}` : newContent,
        mood: newMood,
        sentiment: 85,
        tags: []
      };
      
      const newEntries = [entry, ...entries];
      setEntries(newEntries);
      onUpdateProfile({ journalEntries: newEntries });
      
      setNewTitle('');
      setNewContent('');
      setShowNew(false);
      
      // Update mission
      const currentMissions = profile.dailyMissions && profile.dailyMissions.length > 0 ? profile.dailyMissions : DEFAULT_MISSIONS;
      const updatedMissions = currentMissions.map(m => 
        m.id === 'm2' ? { ...m, done: true } : m
      );
      
      const wasDone = currentMissions.find(m => m.id === 'm2')?.done;
      if (!wasDone) {
        showToast('Mission Completed: Write a journal entry! +30 XP', 'success');
        onUpdateProfile({ 
          dailyMissions: updatedMissions,
          xp: profile.xp + 30
        });
      } else {
        onUpdateProfile({ dailyMissions: updatedMissions });
      }

      showToast('Entry saved successfully!', 'success');
    } catch (e) {
      console.error('Failed to save entry', e);
      showToast('Failed to save entry', 'error');
    }
  };

  const avgSentiment = Math.round(entries.reduce((s, e) => s + e.sentiment, 0) / entries.length);

  if (selectedEntry) {
    return (
      <FloatingWorld mood={selectedEntry.mood} equippedBackground={profile.equippedBackground}>
        <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back button */}
            <button onClick={() => setSelectedEntry(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Journal</span>
            </button>

            <div className="grid grid-cols-12 gap-6">
              {/* Entry Content */}
              <div className="col-span-12 lg:col-span-8 bento-card glass-card rounded-3xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-5xl">{MOOD_CONFIG[selectedEntry.mood].emoji}</span>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {selectedEntry.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedEntry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl text-sm font-bold"
                    style={{
                      background: selectedEntry.sentiment > 70 ? '#dcfce7' : selectedEntry.sentiment > 40 ? '#fef9c3' : '#fee2e2',
                      color: selectedEntry.sentiment > 70 ? '#16a34a' : selectedEntry.sentiment > 40 ? '#ca8a04' : '#dc2626',
                    }}>
                    {selectedEntry.sentiment}% positive
                  </div>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedEntry.content}</p>
                </div>
                <div className="flex gap-2 flex-wrap mt-6">
                  {selectedEntry.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bento-card glass-card rounded-3xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-4">Entry Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mood</span>
                      <span className="font-semibold">{MOOD_CONFIG[selectedEntry.mood].label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sentiment</span>
                      <span className="font-semibold">{selectedEntry.sentiment}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Word Count</span>
                      <span className="font-semibold">{selectedEntry.content.split(' ').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FloatingWorld>
    );
  }

  return (
    <FloatingWorld mood={profile.currentMood} equippedBackground={profile.equippedBackground}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Journal</h1>
              <p className="text-gray-500 mt-1">Your story, your growth</p>
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}>
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bento-card glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-sky-500" />
                <span className="text-sm text-gray-500">Total Entries</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{entries.length}</div>
            </div>
            <div className="bento-card glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-500">Avg Positivity</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{avgSentiment}%</div>
            </div>
            <div className="bento-card glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-gray-500">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{profile.streakDays}</div>
            </div>
            <div className="bento-card glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-500">Tags Used</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{entries.reduce((s, e) => s + e.tags.length, 0)}</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-700 placeholder-gray-400"
                  placeholder="Search your entries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* New Entry Form */}
              {showNew && (
                <div className="bento-card glass-card rounded-3xl p-6 animate-scale-in">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">New Entry</h3>
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-800 placeholder-gray-400 bg-white mb-4"
                    placeholder="What's on your mind today?"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-700 placeholder-gray-400 bg-white mb-4 resize-none"
                    placeholder="Tell your story..."
                    rows={5}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                  />
                  <div className="flex gap-2 flex-wrap mb-4">
                    {(Object.entries(MOOD_CONFIG) as [Mood, typeof MOOD_CONFIG[Mood]][]).map(([mood, cfg]) => (
                      <button key={mood}
                        onClick={() => setNewMood(mood)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          newMood === mood ? 'scale-110 ring-2 ring-offset-1' : ''
                        }`}
                        style={{ background: `${cfg.color}20`, ringColor: cfg.color }}>
                        {cfg.emoji} {cfg.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowNew(false)}
                      className="flex-1 py-3 rounded-xl text-gray-600 font-medium glass hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <button onClick={saveEntry}
                      className="flex-1 py-3 rounded-xl text-white font-bold transition-all hover:scale-102"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }}>
                      Save Entry
                    </button>
                  </div>
                </div>
              )}

              {/* Entries List */}
              <div className="space-y-4">
                {filteredEntries.map(entry => (
                  <button key={entry.id} onClick={() => setSelectedEntry(entry)}
                    className="w-full bento-card glass-card rounded-2xl p-5 text-left transition-all hover:scale-[1.01]">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{MOOD_CONFIG[entry.mood].emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg truncate">{entry.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm text-gray-400">
                              {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{
                                background: entry.sentiment > 70 ? '#dcfce7' : entry.sentiment > 40 ? '#fef9c3' : '#fee2e2',
                                color: entry.sentiment > 70 ? '#16a34a' : entry.sentiment > 40 ? '#ca8a04' : '#dc2626',
                              }}>
                              {entry.sentiment}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{entry.content}</p>
                        {entry.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {entry.tags.map(tag => (
                              <span key={tag} className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Writing Streak */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Writing Streak</h3>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      i < profile.streakDays ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {i < profile.streakDays ? '✓' : ''}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500">{profile.streakDays} days in a row</p>
              </div>

              {/* Mood Distribution */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Mood Distribution</h3>
                <div className="space-y-3">
                  {[
                    { mood: 'happy', count: 8 },
                    { mood: 'calm', count: 5 },
                    { mood: 'neutral', count: 2 },
                    { mood: 'anxious', count: 1 },
                  ].map(({ mood, count }) => (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-xl">{MOOD_CONFIG[mood as Mood].emoji}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${(count / 8) * 100}%`, background: MOOD_CONFIG[mood as Mood].color }} />
                      </div>
                      <span className="text-sm text-gray-600 w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingWorld>
  );
};

export default Journal;
