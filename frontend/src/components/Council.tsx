import React, { useState } from 'react';
import { Send, Sparkles, Loader2, Users } from 'lucide-react';
import type { UserProfile } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import { TopBar } from './Navigation';
import { getAuthHeaders } from '../api';
import { useToast } from './ToastContext';

interface CouncilProps {
  profile: UserProfile;
}

interface AgentResponse {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export const Council: React.FC<CouncilProps> = ({ profile }) => {
  const { showToast } = useToast();
  const moodTheme = MOOD_THEMES[profile.currentMood];
  const [question, setQuestion] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [councilResponse, setCouncilResponse] = useState<{
    agents: AgentResponse[];
    summary: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isDebating) return;

    setIsDebating(true);
    setCouncilResponse(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/council`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ question })
      });

      if (!res.ok) throw new Error('Failed to consult the council');
      const data = await res.json();
      setCouncilResponse(data);
    } catch (error) {
      console.error(error);
      showToast('The council is currently unavailable. Please try again later.', 'error');
    } finally {
      setIsDebating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <TopBar 
        title="Sanctuary Council" 
        subtitle="Multi-Agent Perspective Analysis"
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" style={{ background: moodTheme.appBg }}>
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-white shadow-lg border border-purple-100">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: moodTheme.textPrimary }}>Consult the Council</h2>
            <p style={{ color: moodTheme.textSecondary }}>Present your problem and our 3 specialized AI agents will debate the best course of action simultaneously.</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's on your mind? (e.g. 'I'm feeling overwhelmed with finals coming up...')"
              className="w-full rounded-2xl p-4 pr-16 resize-none shadow-sm transition-all focus:ring-2"
              style={{ 
                background: moodTheme.cardBg, 
                border: `1px solid ${moodTheme.cardBorder}`,
                minHeight: '120px'
              }}
            />
            <button
              type="submit"
              disabled={!question.trim() || isDebating}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
              style={{ background: moodTheme.accent }}
            >
              {isDebating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isDebating && (
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-12 space-y-4">
            <div className="flex gap-4">
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>🦊</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '150ms' }}>🐼</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '300ms' }}>🦦</div>
            </div>
            <p className="font-medium animate-pulse" style={{ color: moodTheme.textSecondary }}>
              The council is deliberating...
            </p>
          </div>
        )}

        {/* Results */}
        {councilResponse && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            
            {/* The Debate */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {councilResponse.agents.map((agent, idx) => (
                <div key={idx} className="rounded-2xl p-5 shadow-sm space-y-3"
                  style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}>
                  <div className="flex items-center gap-3 border-b pb-3 border-black/5">
                    <div className="text-3xl bg-white p-2 rounded-xl shadow-sm border border-black/5">
                      {agent.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{agent.name}</h4>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 italic">
                    "{agent.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Summary Action Plan */}
            <div className="rounded-3xl p-6 shadow-md relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${moodTheme.accent}15, transparent)` }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: moodTheme.accent }} />
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" style={{ color: moodTheme.accent }} />
                <h3 className="text-lg font-bold" style={{ color: moodTheme.textPrimary }}>Council Consensus</h3>
              </div>
              <div className="space-y-3">
                {councilResponse.summary.split('\n').filter(s => s.trim() !== '').map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-sm" style={{ color: moodTheme.textSecondary }}>
                    <span className="font-bold" style={{ color: moodTheme.accent }}>{idx + 1}.</span>
                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Council;
