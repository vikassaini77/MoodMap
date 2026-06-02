import React, { useState, useEffect, useCallback } from 'react';
import type { CompanionType, Mood } from '../types';
import { COMPANIONS } from '../types';

interface CompanionProps {
  type: CompanionType;
  mood: Mood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  message?: string;
  interactive?: boolean;
}

const COMPANION_SVGS: Record<CompanionType, React.FC<{ mood: Mood; animate: boolean }>> = {
  panda: ({ mood, animate }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <radialGradient id="panda-body" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="60" cy="78" rx="32" ry="28" fill="url(#panda-body)" />
      {/* Head */}
      <circle cx="60" cy="48" r="28" fill="url(#panda-body)" />
      {/* Ears */}
      <circle cx="38" cy="26" r="12" fill="#1a1a1a" />
      <circle cx="82" cy="26" r="12" fill="#1a1a1a" />
      <circle cx="38" cy="26" r="7" fill="#2d2d2d" />
      <circle cx="82" cy="26" r="7" fill="#2d2d2d" />
      {/* Eye patches */}
      <ellipse cx="48" cy="45" rx="11" ry="10" fill="#1a1a1a" />
      <ellipse cx="72" cy="45" rx="11" ry="10" fill="#1a1a1a" />
      {/* Eyes */}
      <circle cx="48" cy="45" r="5" fill="white" />
      <circle cx="72" cy="45" r="5" fill="white" />
      <circle cx={mood === 'happy' || mood === 'excited' ? 49 : 48} cy="45" r="3" fill="#1a1a1a" />
      <circle cx={mood === 'happy' || mood === 'excited' ? 73 : 72} cy="45" r="3" fill="#1a1a1a" />
      {/* Eye shine */}
      <circle cx="50" cy="43" r="1.5" fill="white" />
      <circle cx="74" cy="43" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="54" rx="5" ry="3.5" fill="#ff8fa3" />
      {/* Mouth */}
      {mood === 'sad' ? (
        <path d="M52 60 Q60 56 68 60" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M52 58 Q60 65 68 58" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Arms */}
      <ellipse cx="28" cy="80" rx="10" ry="16" fill="#1a1a1a" transform="rotate(-20, 28, 80)" />
      <ellipse cx="92" cy="80" rx="10" ry="16" fill="#1a1a1a" transform="rotate(20, 92, 80)" />
      {/* Belly spot */}
      <ellipse cx="60" cy="82" rx="16" ry="14" fill="rgba(0,0,0,0.05)" />
      {/* Bamboo for panda */}
      {mood === 'happy' && (
        <g transform="translate(88, 60)">
          <rect x="0" y="0" width="6" height="35" rx="3" fill="#4ade80" />
          <rect x="0" y="12" width="6" height="3" rx="1" fill="#22c55e" />
          <rect x="0" y="24" width="6" height="3" rx="1" fill="#22c55e" />
          <path d="M6 8 Q16 4 14 10" stroke="#4ade80" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  ),

  fox: ({ mood, animate }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <radialGradient id="fox-body" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      {/* Tail */}
      <path d="M85 95 Q105 80 100 65 Q95 50 85 60" fill="#fb923c" />
      <path d="M88 92 Q105 80 100 68 Q97 58 88 64" fill="#fed7aa" />
      {/* Body */}
      <ellipse cx="58" cy="80" rx="28" ry="24" fill="url(#fox-body)" />
      {/* Chest */}
      <ellipse cx="58" cy="82" rx="16" ry="16" fill="#fed7aa" />
      {/* Head */}
      <ellipse cx="58" cy="48" rx="26" ry="24" fill="url(#fox-body)" />
      {/* Ears */}
      <polygon points="36,32 28,8 48,28" fill="#fb923c" />
      <polygon points="80,32 90,8 70,28" fill="#fb923c" />
      <polygon points="38,30 33,14 48,27" fill="#fda4af" />
      <polygon points="78,30 85,14 70,27" fill="#fda4af" />
      {/* Face white patch */}
      <ellipse cx="58" cy="52" rx="14" ry="12" fill="#fed7aa" />
      {/* Eyes */}
      <ellipse cx="48" cy="44" rx="6" ry="6" fill="#1a1a1a" />
      <ellipse cx="68" cy="44" rx="6" ry="6" fill="#1a1a1a" />
      <circle cx="48" cy="44" r="3" fill="#7c3aed" />
      <circle cx="68" cy="44" r="3" fill="#7c3aed" />
      <circle cx="49.5" cy="42.5" r="1.5" fill="white" />
      <circle cx="69.5" cy="42.5" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="58" cy="52" rx="4" ry="3" fill="#1a1a1a" />
      {/* Mouth */}
      {mood === 'sad' ? (
        <path d="M52 57 Q58 54 64 57" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M52 56 Q58 62 64 56" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Paws */}
      <ellipse cx="36" cy="94" rx="8" ry="6" fill="#fb923c" />
      <ellipse cx="80" cy="94" rx="8" ry="6" fill="#fb923c" />
    </svg>
  ),

  bunny: ({ mood }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Ears */}
      <ellipse cx="44" cy="20" rx="9" ry="22" fill="#fce7f3" />
      <ellipse cx="76" cy="20" rx="9" ry="22" fill="#fce7f3" />
      <ellipse cx="44" cy="20" rx="5" ry="18" fill="#fbcfe8" />
      <ellipse cx="76" cy="20" rx="5" ry="18" fill="#fbcfe8" />
      {/* Body */}
      <ellipse cx="60" cy="82" rx="30" ry="26" fill="#fce7f3" />
      {/* Head */}
      <circle cx="60" cy="52" r="26" fill="#fce7f3" />
      {/* Eyes */}
      <circle cx="50" cy="48" r="6" fill="#1a1a1a" />
      <circle cx="70" cy="48" r="6" fill="#1a1a1a" />
      <circle cx="50" cy="48" r="3.5" fill="#f43f5e" />
      <circle cx="70" cy="48" r="3.5" fill="#f43f5e" />
      <circle cx="51.5" cy="46.5" r="1.5" fill="white" />
      <circle cx="71.5" cy="46.5" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="55" rx="3.5" ry="2.5" fill="#f43f5e" />
      {/* Whiskers */}
      <line x1="36" y1="55" x2="54" y2="56" stroke="#ccc" strokeWidth="1.5" />
      <line x1="36" y1="58" x2="54" y2="58" stroke="#ccc" strokeWidth="1.5" />
      <line x1="66" y1="56" x2="84" y2="55" stroke="#ccc" strokeWidth="1.5" />
      <line x1="66" y1="58" x2="84" y2="58" stroke="#ccc" strokeWidth="1.5" />
      {/* Mouth */}
      <path d="M54 59 Q60 65 66 59" stroke="#f43f5e" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Belly */}
      <ellipse cx="60" cy="84" rx="16" ry="14" fill="#fdf2f8" />
      {/* Tail */}
      <circle cx="82" cy="98" r="8" fill="white" />
      {/* Arms */}
      <ellipse cx="34" cy="80" rx="8" ry="14" fill="#fce7f3" transform="rotate(-15, 34, 80)" />
      <ellipse cx="86" cy="80" rx="8" ry="14" fill="#fce7f3" transform="rotate(15, 86, 80)" />
      {/* Star for bunny */}
      {mood === 'happy' && (
        <text x="88" y="30" fontSize="14" style={{ userSelect: 'none' }}>⭐</text>
      )}
    </svg>
  ),

  otter: ({ mood }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Body */}
      <ellipse cx="60" cy="80" rx="28" ry="22" fill="#a16207" />
      {/* Chest */}
      <ellipse cx="60" cy="82" rx="18" ry="15" fill="#d97706" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="24" ry="22" fill="#a16207" />
      {/* Face */}
      <ellipse cx="60" cy="56" rx="16" ry="12" fill="#d97706" />
      {/* Ears */}
      <circle cx="38" cy="32" r="9" fill="#a16207" />
      <circle cx="82" cy="32" r="9" fill="#a16207" />
      <circle cx="38" cy="32" r="5" fill="#d97706" />
      <circle cx="82" cy="32" r="5" fill="#d97706" />
      {/* Eyes */}
      <circle cx="50" cy="46" r="7" fill="#1a1a1a" />
      <circle cx="70" cy="46" r="7" fill="#1a1a1a" />
      <circle cx="50" cy="46" r="4" fill="#7dd3fc" />
      <circle cx="70" cy="46" r="4" fill="#7dd3fc" />
      <circle cx="51.5" cy="44.5" r="2" fill="white" />
      <circle cx="71.5" cy="44.5" r="2" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="55" rx="5" ry="4" fill="#1a1a1a" />
      <ellipse cx="60" cy="54" rx="3" ry="2" fill="#374151" />
      {/* Mouth */}
      <path d="M53 60 Q60 67 67 60" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="34" y1="57" x2="52" y2="57" stroke="#92400e" strokeWidth="1.5" />
      <line x1="68" y1="57" x2="86" y2="57" stroke="#92400e" strokeWidth="1.5" />
      {/* Arms holding shell */}
      <ellipse cx="34" cy="82" rx="8" ry="13" fill="#a16207" transform="rotate(-25, 34, 82)" />
      <ellipse cx="86" cy="82" rx="8" ry="13" fill="#a16207" transform="rotate(25, 86, 82)" />
      {mood === 'happy' && (
        <text x="46" y="100" fontSize="16" style={{ userSelect: 'none' }}>🐚</text>
      )}
    </svg>
  ),

  cat: ({ mood }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Body */}
      <ellipse cx="60" cy="80" rx="28" ry="24" fill="#fbbf24" />
      {/* Tail */}
      <path d="M88 90 Q108 75 105 58 Q102 44 92 52" stroke="#f59e0b" strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="60" cy="50" r="26" fill="#fbbf24" />
      {/* Ears */}
      <polygon points="38,34 32,12 52,30" fill="#fbbf24" />
      <polygon points="82,34 88,12 68,30" fill="#fbbf24" />
      <polygon points="40,32 36,17 50,29" fill="#fda4af" />
      <polygon points="80,32 84,17 70,29" fill="#fda4af" />
      {/* Eyes */}
      <ellipse cx="48" cy="46" rx="8" ry="7" fill="#1a1a1a" />
      <ellipse cx="72" cy="46" rx="8" ry="7" fill="#1a1a1a" />
      {mood === 'happy' || mood === 'excited' ? (
        <>
          <path d="M42 46 Q48 41 54 46" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <path d="M66 46 Q72 41 78 46" stroke="#fbbf24" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="48" cy="46" rx="4" ry="5" fill="#84cc16" />
          <ellipse cx="72" cy="46" rx="4" ry="5" fill="#84cc16" />
          <circle cx="49.5" cy="44.5" r="1.5" fill="white" />
          <circle cx="73.5" cy="44.5" r="1.5" fill="white" />
        </>
      )}
      {/* Nose */}
      <polygon points="60,53 56,58 64,58" fill="#f43f5e" />
      {/* Whiskers */}
      <line x1="30" y1="54" x2="52" y2="55" stroke="#e5e7eb" strokeWidth="1.5" />
      <line x1="30" y1="58" x2="52" y2="58" stroke="#e5e7eb" strokeWidth="1.5" />
      <line x1="68" y1="55" x2="90" y2="54" stroke="#e5e7eb" strokeWidth="1.5" />
      <line x1="68" y1="58" x2="90" y2="58" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Mouth */}
      <path d="M53 59 Q60 66 67 59" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Belly */}
      <ellipse cx="60" cy="82" rx="15" ry="13" fill="#fde68a" />
      {/* Paws */}
      <ellipse cx="36" cy="96" rx="9" ry="6" fill="#fbbf24" />
      <ellipse cx="84" cy="96" rx="9" ry="6" fill="#fbbf24" />
    </svg>
  ),

  penguin: ({ mood }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      {/* Body */}
      <ellipse cx="60" cy="78" rx="28" ry="30" fill="#1e293b" />
      {/* Belly */}
      <ellipse cx="60" cy="82" rx="18" ry="22" fill="white" />
      {/* Head */}
      <circle cx="60" cy="46" r="24" fill="#1e293b" />
      {/* Face white */}
      <ellipse cx="60" cy="50" rx="15" ry="14" fill="white" />
      {/* Eyes */}
      <circle cx="52" cy="44" r="7" fill="white" />
      <circle cx="68" cy="44" r="7" fill="white" />
      <circle cx="52" cy="44" r="4" fill="#1e293b" />
      <circle cx="68" cy="44" r="4" fill="#1e293b" />
      <circle cx="53.5" cy="42.5" r="1.5" fill="white" />
      <circle cx="69.5" cy="42.5" r="1.5" fill="white" />
      {/* Beak */}
      <polygon points="56,54 64,54 60,62" fill="#f97316" />
      {/* Mouth */}
      {mood === 'sad' ? null : (
        <path d="M55 61 Q60 65 65 61" stroke="#ea580c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {/* Wings */}
      <ellipse cx="30" cy="78" rx="10" ry="22" fill="#1e293b" transform="rotate(-15, 30, 78)" />
      <ellipse cx="90" cy="78" rx="10" ry="22" fill="#1e293b" transform="rotate(15, 90, 78)" />
      {/* Feet */}
      <ellipse cx="48" cy="106" rx="10" ry="5" fill="#f97316" transform="rotate(-10, 48, 106)" />
      <ellipse cx="72" cy="106" rx="10" ry="5" fill="#f97316" transform="rotate(10, 72, 106)" />
      {/* Scarf */}
      <rect x="38" y="66" width="44" height="8" rx="4" fill="#7dd3fc" />
      {/* Bow tie */}
      {mood !== 'sad' && (
        <polygon points="54,70 60,73 54,76" fill="#38bdf8" />
      )}
      {mood !== 'sad' && (
        <polygon points="66,70 60,73 66,76" fill="#38bdf8" />
      )}
    </svg>
  ),

  shiba: ({ mood }) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <radialGradient id="shiba-body" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      {/* Body */}
      <ellipse cx="60" cy="80" rx="30" ry="25" fill="url(#shiba-body)" />
      {/* Chest */}
      <ellipse cx="60" cy="84" rx="18" ry="16" fill="#fef3c7" />
      {/* Head */}
      <circle cx="60" cy="48" r="26" fill="url(#shiba-body)" />
      {/* Ears */}
      <polygon points="40,30 34,10 52,26" fill="#f59e0b" />
      <polygon points="80,30 86,10 68,26" fill="#f59e0b" />
      <polygon points="40,30 36,16 50,26" fill="#fde68a" />
      <polygon points="80,30 84,16 70,26" fill="#fde68a" />
      {/* Face markings */}
      <ellipse cx="60" cy="54" rx="14" ry="10" fill="#fef3c7" />
      {/* Eyes */}
      <ellipse cx="48" cy="44" rx="7" ry="7" fill="#1a1a1a" />
      <ellipse cx="72" cy="44" rx="7" ry="7" fill="#1a1a1a" />
      <circle cx="48" cy="44" r="4" fill="#7c3aed" />
      <circle cx="72" cy="44" r="4" fill="#7c3aed" />
      <circle cx="49.5" cy="42.5" r="2" fill="white" />
      <circle cx="73.5" cy="42.5" r="2" fill="white" />
      {mood === 'happy' || mood === 'excited' ? (
        <>
          <path d="M42 44 Q48 39 54 44" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <path d="M66 44 Q72 39 78 44" stroke="#f59e0b" strokeWidth="2" fill="none" />
        </>
      ) : null}
      {/* Nose */}
      <ellipse cx="60" cy="52" rx="5" ry="4" fill="#1a1a1a" />
      {/* Mouth */}
      <path d="M53 57 Q60 64 67 57" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M88 80 Q110 60 105 45 Q100 32 90 42" stroke="#f59e0b" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Paws */}
      <ellipse cx="36" cy="98" rx="9" ry="7" fill="#fcd34d" />
      <ellipse cx="84" cy="98" rx="9" ry="7" fill="#fcd34d" />
    </svg>
  ),
};

export const AnimatedCompanion: React.FC<CompanionProps> = ({
  type, mood, size = 'md', showSpeech = false, message, interactive = false,
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const companion = COMPANIONS[type];
  const CompanionSVG = COMPANION_SVGS[type];

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const handleClick = useCallback(() => {
    if (!interactive) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1500);
  }, [interactive]);

  useEffect(() => {
    if (mood === 'excited') {
      const interval = setInterval(() => {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 600);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mood]);

  const speechMsg = message || companion.greeting;

  return (
    <div className="relative inline-flex flex-col items-center">
      {showSpeech && (
        <div className="speech-bubble glass-card px-4 py-2.5 mb-3 max-w-xs animate-fade-in">
          <p className="text-sm text-gray-700 font-medium leading-snug">{speechMsg}</p>
        </div>
      )}
      <div
        className={`
          ${sizeClasses[size]} companion-float
          ${isBouncing ? 'animate-bounce_soft' : 'animate-float'}
          ${interactive ? 'cursor-pointer' : ''}
          transition-transform
        `}
        onClick={handleClick}
        style={{ filter: `drop-shadow(0 8px 16px ${companion.color}44)` }}
      >
        <CompanionSVG mood={mood} animate={isWaving} />
      </div>
    </div>
  );
};

export default AnimatedCompanion;
