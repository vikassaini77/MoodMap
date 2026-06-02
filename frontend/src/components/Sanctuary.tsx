import React from 'react';
import type { UserProfile } from '../types';
import { COMPANIONS, MOOD_CONFIG } from '../types';
import AnimatedCompanion from './AnimatedCompanion';
import { FloatingWorld } from './FloatingWorld';

interface SanctuaryProps {
  profile: UserProfile;
}

const HABITATS: Record<string, {
  name: string;
  bg: string;
  skyColorFrom: string;
  skyColorTo: string;
  groundColor: string;
  elements: string[];
  ambience: string;
}> = {
  panda: {
    name: 'Bamboo Forest', bg: 'from-green-100 via-emerald-50 to-green-50', skyColorFrom: '#d1fae5',
    skyColorTo: '#a7f3d0', groundColor: '#166534', elements: ['🎋', '🌿', '🍃', '🌱', '🦋'],
    ambience: 'The bamboo rustles gently in the breeze...',
  },
  fox: {
    name: 'Mystic Forest', bg: 'from-orange-100 via-amber-50 to-yellow-50', skyColorFrom: '#fef3c7',
    skyColorTo: '#fde68a', groundColor: '#92400e', elements: ['🍂', '🍁', '🌙', '⭐', '🦔'],
    ambience: 'Golden light filters through the ancient trees...',
  },
  bunny: {
    name: 'Moon Garden', bg: 'from-pink-100 via-rose-50 to-pink-50', skyColorFrom: '#fce7f3',
    skyColorTo: '#fbcfe8', groundColor: '#831843', elements: ['🌸', '🌺', '🌙', '⭐', '🦋'],
    ambience: 'Moonflowers bloom under the gentle night sky...',
  },
  otter: {
    name: 'River Sanctuary', bg: 'from-cyan-100 via-teal-50 to-blue-50', skyColorFrom: '#cffafe',
    skyColorTo: '#a5f3fc', groundColor: '#0e7490', elements: ['🌊', '🐟', '🌿', '🪨', '🦆'],
    ambience: 'The river flows peacefully, carrying your worries away...',
  },
  cat: {
    name: 'Cozy House', bg: 'from-amber-100 via-yellow-50 to-orange-50', skyColorFrom: '#fef3c7',
    skyColorTo: '#fde68a', groundColor: '#92400e', elements: ['🕯️', '📚', '🌻', '🪴', '🧶'],
    ambience: 'A warm, safe space where everything is just right...',
  },
  penguin: {
    name: 'Crystal Ice World', bg: 'from-sky-100 via-blue-50 to-cyan-50', skyColorFrom: '#e0f2fe',
    skyColorTo: '#bae6fd', groundColor: '#0369a1', elements: ['❄️', '🧊', '⭐', '🌟', '🐟'],
    ambience: 'Crystal ice reflects the northern lights above...',
  },
  shiba: {
    name: 'Sunny Meadow', bg: 'from-yellow-100 via-lime-50 to-green-50', skyColorFrom: '#fefce8',
    skyColorTo: '#fef9c3', groundColor: '#166534', elements: ['🌻', '🌼', '🦋', '🐝', '☀️'],
    ambience: 'The meadow dances with wildflowers and sunshine...',
  },
};

const Sanctuary: React.FC<SanctuaryProps> = ({ profile }) => {
  const companion = COMPANIONS[profile.companion];
  const habitat = HABITATS[profile.companion];
  const moodConfig = MOOD_CONFIG[profile.currentMood];

  const COMPANION_MESSAGES: Record<string, string> = {
    panda: 'This is my peaceful bamboo grove. So tranquil here.',
    fox: 'The mystic forest holds ancient secrets. Stay curious.',
    bunny: 'My moon garden blooms for those who dream.',
    otter: 'This river sanctuary is my happy place. Splash!',
    cat: 'My cozy corner, purr-fect for afternoon naps.',
    penguin: 'The crystals sing in the polar wind. Magical!',
    shiba: 'Sunny days, happy vibes, much wow!',
  };

  return (
    <FloatingWorld mood={profile.currentMood}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              {companion.name}'s Sanctuary
            </h1>
            <p className="text-gray-500 mt-1">{habitat.name}</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Sanctuary View */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bento-card rounded-3xl overflow-hidden relative"
                style={{ minHeight: '500px', background: `linear-gradient(180deg, ${habitat.skyColorFrom} 0%, ${habitat.skyColorTo} 50%, transparent 100%)` }}>
                {/* Sky gradient */}
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(180deg, ${habitat.skyColorFrom}40 0%, ${habitat.skyColorTo}20 40%, transparent 100%)` }} />

                {/* Habitat elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {habitat.elements.map((el, i) => (
                    <div key={i} className="absolute text-4xl animate-float"
                      style={{
                        left: `${8 + i * 18}%`,
                        top: `${10 + (i % 3) * 18}%`,
                        animationDelay: `${i * 1.2}s`,
                        animationDuration: `${6 + i}s`,
                      }}>
                      {el}
                    </div>
                  ))}
                  {/* Additional particles */}
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={`p-${i}`} className="absolute text-xl animate-float opacity-60"
                      style={{
                        left: `${Math.random() * 90}%`,
                        top: `${Math.random() * 80}%`,
                        animationDelay: `${i * 0.6}s`,
                      }}>
                      {habitat.elements[i % habitat.elements.length]}
                    </div>
                  ))}
                </div>

                {/* Mood weather */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-3">
                    <span className="text-3xl">{moodConfig.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-500">Current Mood</p>
                      <p className="font-semibold text-gray-800">{moodConfig.label}</p>
                    </div>
                    <div className="w-3 h-3 rounded-full animate-pulse_soft" style={{ background: moodConfig.color }} />
                  </div>
                </div>

                {/* Companion in center */}
                <div className="absolute inset-0 flex items-center justify-center pb-20 z-10">
                  <div className="animate-float">
                    <AnimatedCompanion
                      type={profile.companion}
                      mood={profile.currentMood}
                      size="xl"
                      interactive
                    />
                  </div>
                </div>

                {/* Speech bubble */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
                  <div className="speech-bubble glass-card px-6 py-4 max-w-sm">
                    <p className="text-sm text-gray-600 italic">{habitat.ambience}</p>
                  </div>
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-24"
                  style={{ background: `linear-gradient(0deg, ${habitat.groundColor}30 0%, transparent 100%)` }} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Companion Info */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <AnimatedCompanion type={profile.companion} mood={profile.currentMood} size="md" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{companion.name}</h3>
                    <p className="text-sm text-gray-500">{companion.personality}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic mb-4">"{COMPANION_MESSAGES[profile.companion]}"</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl bg-sky-50">
                    <div className="text-lg font-bold text-sky-700">Level 1</div>
                    <div className="text-xs text-gray-500">Seedling</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50">
                    <div className="text-lg font-bold text-amber-700">35%</div>
                    <div className="text-xs text-gray-500">Bond</div>
                  </div>
                </div>
              </div>

              {/* Stats Bars */}
              <div className="bento-card glass-card rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-gray-800">Companion Stats</h3>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                    <span>Bond Level</span><span className="font-semibold">35%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: '35%', background: `linear-gradient(90deg, ${companion.color}, ${companion.color}88)` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                    <span>Happiness</span><span className="font-semibold">72%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                    <span>Energy</span><span className="font-semibold">68%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-400" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Interact</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Pet', emoji: '🤝', color: '#0ea5e9' },
                    { label: 'Feed', emoji: '🍎', color: '#22c55e' },
                    { label: 'Play', emoji: '🎾', color: '#f97316' },
                    { label: 'Rest', emoji: '😴', color: '#a855f7' },
                  ].map(a => (
                    <button key={a.label}
                      className="flex items-center gap-2 p-3 rounded-xl glass hover:scale-105 transition-all text-left">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: `${a.color}15` }}>
                        {a.emoji}
                      </div>
                      <span className="font-medium text-gray-700 text-sm">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Habitat Items */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Habitat Items</h3>
                <div className="grid grid-cols-4 gap-2">
                  {habitat.elements.map((el, i) => (
                    <div key={i}
                      className="aspect-square rounded-xl flex items-center justify-center text-2xl bg-white/60 hover:bg-white/80 transition-colors cursor-pointer">
                      {el}
                    </div>
                  ))}
                  <div className="aspect-square rounded-xl flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-2 border-dashed border-gray-300">
                    <span className="text-xl text-gray-400">+</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">Unlock more in the Shop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FloatingWorld>
  );
};

export default Sanctuary;
