import React, { useState, useEffect, useRef } from 'react';
import { Zap, Trophy, ArrowLeft } from 'lucide-react';
import type { UserProfile } from '../types';
import { FloatingWorld } from './FloatingWorld';

interface ArcadeProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

type GameId = 'bubble' | 'color' | 'memory' | 'breathe' | null;

const GAMES = [
  { id: 'bubble' as GameId, name: 'Bubble Pop', emoji: '🫧', desc: 'Pop anxiety bubbles!', xp: 30, coins: 15, color: '#0ea5e9', bg: 'from-sky-100 to-blue-50' },
  { id: 'color' as GameId, name: 'Color Therapy', emoji: '🎨', desc: 'Color your mood away', xp: 25, coins: 12, color: '#f97316', bg: 'from-orange-100 to-amber-50' },
  { id: 'memory' as GameId, name: 'Memory Garden', emoji: '🌸', desc: 'Find matching flowers', xp: 35, coins: 18, color: '#f43f5e', bg: 'from-rose-100 to-pink-50' },
  { id: 'breathe' as GameId, name: 'Breath Rider', emoji: '🌊', desc: 'Ride the waves of calm', xp: 20, coins: 10, color: '#22c55e', bg: 'from-emerald-100 to-teal-50' },
];

// BubblePop game
const BubblePopGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [bubbles, setBubbles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i, x: 10 + (i % 4) * 22, y: 15 + Math.floor(i / 4) * 30,
      size: 50 + Math.random() * 40, color: ['#bae6fd', '#bbf7d0', '#fde68a', '#fecaca', '#ddd6fe', '#fed7aa'][i % 6],
      popped: false, text: ['😰', '😤', '😫', '😟', '😣', '😖', '😩', '😤', '💢', '😾', '😤', '😫'][i],
    }))
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setFinished(true); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const popBubble = (id: number) => {
    setBubbles(bs => bs.map(b => b.id === id ? { ...b, popped: true } : b));
    setScore(s => s + 10);
    if (bubbles.filter(b => !b.popped).length === 1) setFinished(true);
  };

  const allPopped = bubbles.every(b => b.popped);

  return (
    <div className="text-center p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="font-bold text-gray-700 text-lg">Score: {score}</span>
        <span className={`font-bold text-lg ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>
      {finished || allPopped ? (
        <div className="py-12">
          <div className="text-6xl mb-4">{allPopped ? '🎉' : score > 60 ? '👏' : '😊'}</div>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {allPopped ? 'All stress bubbles popped!' : `Time's up!`}
          </p>
          <p className="text-gray-600 mb-8">Score: {score} points</p>
          <button onClick={() => onComplete(score)}
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 8px 24px rgba(14,165,233,0.4)' }}>
            Collect Rewards
          </button>
        </div>
      ) : (
        <div className="relative bg-gradient-to-b from-sky-100 to-blue-50 rounded-2xl p-8 min-h-[320px]">
          <p className="text-gray-600 mb-6">Pop the stress bubbles!</p>
          {bubbles.map(bubble => (
            !bubble.popped && (
              <button key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className="absolute rounded-full flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 animate-float"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  background: bubble.color,
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  animationDelay: `${bubble.id * 0.3}s`,
                }}>
                {bubble.text}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// Memory Garden game
const MemoryGame: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const FLOWERS = ['🌸', '🌺', '🌻', '🌹', '🌼', '🌷'];
  const [cards, setCards] = useState(() => {
    const pairs = [...FLOWERS, ...FLOWERS];
    return pairs.sort(() => Math.random() - 0.5).map((f, i) => ({
      id: i, value: f, flipped: false, matched: false,
    }));
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
    const newFlipped = [...flipped, id];
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].value === cards[b].value) {
        setTimeout(() => {
          setCards(cs => cs.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c));
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards(cs => cs.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 800);
      }
    }
  };

  const allMatched = cards.every(c => c.matched);

  return (
    <div className="text-center p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-600">Moves: {moves}</span>
        <span className="text-sm text-gray-600">Pairs: {cards.filter(c => c.matched).length / 2}/{FLOWERS.length}</span>
      </div>
      {allMatched ? (
        <div className="py-12">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-2xl font-bold text-gray-800 mb-2">Garden Complete!</p>
          <p className="text-gray-600 mb-8">{moves} moves</p>
          <button onClick={() => onComplete(Math.max(10, 100 - moves * 5))}
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)', boxShadow: '0 8px 24px rgba(244,63,94,0.4)' }}>
            Collect Rewards
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map(card => (
            <button key={card.id} onClick={() => flip(card.id)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-105 ${
                card.matched ? 'bg-green-100' : card.flipped ? 'bg-pink-100' : 'bg-gray-200 hover:bg-gray-100'
              }`}
              style={{ fontSize: '28px' }}>
              {card.flipped || card.matched ? card.value : '🌿'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Color Therapy
const ColorTherapy: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [color, setColor] = useState('#60a5fa');
  const [painted, setPainted] = useState<string[]>([]);
  const COLORS = ['#bae6fd', '#bbf7d0', '#fde68a', '#fecaca', '#ddd6fe', '#fed7aa', '#a5f3fc', '#d9f99d'];
  const CELLS = Array.from({ length: 30 }, (_, i) => i);

  const paint = (id: number) => {
    setPainted(p => {
      const newP = [...p];
      newP[id] = color;
      if (newP.filter(Boolean).length >= 28) setTimeout(() => onComplete(80), 500);
      return newP;
    });
  };

  return (
    <div className="p-6">
      <p className="text-center text-gray-600 mb-6">Paint with your chosen colors</p>
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)}
            className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${color === c ? 'ring-4 ring-offset-2 scale-125' : ''}`}
            style={{ background: c, ringColor: c }} />
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {CELLS.map(i => (
          <button key={i} onClick={() => paint(i)}
            className="aspect-square rounded-lg transition-all hover:scale-105"
            style={{ background: painted[i] || '#f1f5f9' }} />
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">{painted.filter(Boolean).length}/{CELLS.length} cells painted</p>
      </div>
    </div>
  );
};

// Breathe Rider
const BreathRider: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [rounds, setRounds] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const phases: { p: 'inhale' | 'hold' | 'exhale'; d: number }[] = [
      { p: 'inhale', d: 4 }, { p: 'hold', d: 4 }, { p: 'exhale', d: 6 },
    ];
    let pi = 0;
    let t = phases[0].d;
    setCount(t);
    setScale(phases[0].p === 'inhale' ? 1.5 : phases[0].p === 'exhale' ? 0.8 : 1.2);

    const interval = setInterval(() => {
      t--;
      setCount(t);
      if (t <= 0) {
        pi = (pi + 1) % phases.length;
        t = phases[pi].d;
        setPhase(phases[pi].p);
        setScale(phases[pi].p === 'inhale' ? 1.5 : phases[pi].p === 'exhale' ? 0.8 : 1.2);
        if (pi === 0) {
          setRounds(r => {
            if (r + 1 >= 3) setTimeout(() => onComplete(90), 500);
            return r + 1;
          });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const phaseColors = { inhale: '#22c55e', hold: '#0ea5e9', exhale: '#a855f7' };
  const phaseLabels = { inhale: '🌬️ Breathe In', hold: '⏸️ Hold', exhale: '💨 Breathe Out' };

  return (
    <div className="p-8 text-center">
      <p className="text-sm text-gray-500 mb-8">Round {Math.min(rounds + 1, 3)} of 3</p>
      <div className="relative inline-flex items-center justify-center w-48 h-48 mb-8">
        <div className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
          style={{
            transform: `scale(${scale})`,
            background: `${phaseColors[phase]}20`,
            border: `4px solid ${phaseColors[phase]}`,
          }} />
        <div className="z-10">
          <div className="text-6xl font-bold text-gray-800">{count}</div>
        </div>
      </div>
      <div className="text-xl font-semibold mb-4" style={{ color: phaseColors[phase] }}>
        {phaseLabels[phase]}
      </div>
      <p className="text-sm text-gray-500 mb-6">Follow the circle... breathe with me</p>
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map(r => (
          <div key={r} className={`w-4 h-4 rounded-full transition-colors ${r <= rounds ? 'bg-sky-500' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};

const Arcade: React.FC<ArcadeProps> = ({ profile, onUpdateProfile }) => {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [completed, setCompleted] = useState<GameId[]>([]);
  const [showGameModal, setShowGameModal] = useState(false);

  const handleComplete = (gameId: GameId, score: number) => {
    if (!gameId || completed.includes(gameId)) { setActiveGame(null); setShowGameModal(false); return; }
    const game = GAMES.find(g => g.id === gameId)!;
    setCompleted(c => [...c, gameId]);
    onUpdateProfile({
      xp: profile.xp + game.xp,
      moodCoins: profile.moodCoins + game.coins,
    });
    setActiveGame(null);
    setShowGameModal(false);
  };

  if (activeGame && showGameModal) {
    const game = GAMES.find(g => g.id === activeGame)!;
    return (
      <FloatingWorld mood={profile.currentMood}>
        <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-6">
            <button onClick={() => { setActiveGame(null); setShowGameModal(false); }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Arcade</span>
            </button>
            <div className="bento-card glass-card rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{game.emoji}</span>
                  <h2 className="text-xl font-bold text-gray-800">{game.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">+{game.xp} XP</span>
                  <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">+{game.coins} 🪙</span>
                </div>
              </div>
              {activeGame === 'bubble' && <BubblePopGame onComplete={s => handleComplete('bubble', s)} />}
              {activeGame === 'memory' && <MemoryGame onComplete={s => handleComplete('memory', s)} />}
              {activeGame === 'color' && <ColorTherapy onComplete={s => handleComplete('color', s)} />}
              {activeGame === 'breathe' && <BreathRider onComplete={s => handleComplete('breathe', s)} />}
            </div>
          </div>
        </div>
      </FloatingWorld>
    );
  }

  return (
    <FloatingWorld mood={profile.currentMood}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Mood Arcade</h1>
            <p className="text-gray-500 mt-1">Play games, heal your mind</p>
          </div>

          {/* Daily Rewards */}
          <div className="bento-card glass-card rounded-2xl p-4 flex items-center gap-4 mb-8">
            <div className="text-3xl">🎮</div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Today's Rewards</p>
              <p className="text-sm text-gray-500">{completed.length} games played</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4">
                <div className="text-lg font-bold text-amber-600">+{completed.reduce((s, id) => s + (GAMES.find(g => g.id === id)?.xp || 0), 0)}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>
              <div className="text-center px-4 border-l border-gray-200">
                <div className="text-lg font-bold text-yellow-600">+{completed.reduce((s, id) => s + (GAMES.find(g => g.id === id)?.coins || 0), 0)}</div>
                <div className="text-xs text-gray-400">🪙</div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {GAMES.map(game => {
              const isComplete = completed.includes(game.id);
              return (
                <button key={game.id}
                  onClick={() => { setActiveGame(game.id); setShowGameModal(true); }}
                  className={`bento-card glass-card rounded-3xl p-6 text-left transition-all hover:scale-[1.02] relative overflow-hidden
                    ${isComplete ? 'opacity-90' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${game.color}10, ${game.color}05)` }}>
                  {isComplete && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="text-5xl mb-4 animate-float">{game.emoji}</div>
                  <p className="font-bold text-gray-800 text-lg mb-1">{game.name}</p>
                  <p className="text-sm text-gray-500 mb-4">{game.desc}</p>
                  <div className="flex gap-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: `${game.color}20`, color: game.color }}>
                      +{game.xp} XP
                    </span>
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      +{game.coins} 🪙
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Leaderboard */}
          <div className="bento-card glass-card rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-gray-800 text-lg">Weekly Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'MindfulMaya', score: 2840, rank: 1, emoji: '🦊' },
                { name: 'CalmPanda42', score: 2640, rank: 2, emoji: '🐼' },
                { name: 'BunnyLuna', score: 2520, rank: 3, emoji: '🐰' },
                { name: profile.name || 'You', score: profile.xp, rank: 7, emoji: GAMES[0].emoji },
              ].map(p => (
                <div key={p.name}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    p.name === (profile.name || 'You') ? 'bg-sky-50 border-2 border-sky-200' : 'bg-white/60'
                  }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${p.rank === 1 ? 'bg-yellow-400 text-white' : p.rank === 2 ? 'bg-gray-300 text-white' : p.rank === 3 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {p.rank}
                  </div>
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="flex-1 font-medium text-gray-700">{p.name}</span>
                  <span className="font-bold text-gray-800">{p.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FloatingWorld>
  );
};

export default Arcade;
