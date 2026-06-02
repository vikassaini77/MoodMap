import React, { useState } from 'react';
import { ShoppingBag, Star, Lock, Check, Info } from 'lucide-react';
import type { UserProfile } from '../types';
import { FloatingWorld } from './FloatingWorld';

interface ShopProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const SHOP_ITEMS = [
  { id: 'arctic-panda', name: 'Arctic Panda Skin', emoji: '🐼', type: 'skin', price: 150, color: '#bae6fd', rare: false },
  { id: 'golden-fox', name: 'Golden Fox Skin', emoji: '🦊', type: 'skin', price: 200, color: '#fde68a', rare: true },
  { id: 'starry-bg', name: 'Starry Night BG', emoji: '🌌', type: 'background', price: 100, color: '#1e293b', rare: false },
  { id: 'sakura-bg', name: 'Sakura Garden BG', emoji: '🌸', type: 'background', price: 120, color: '#fce7f3', rare: false },
  { id: 'rainbow-hat', name: 'Rainbow Hat', emoji: '🌈', type: 'accessory', price: 75, color: '#fbbf24', rare: false },
  { id: 'sparkle-aura', name: 'Sparkle Aura', emoji: '✨', type: 'accessory', price: 180, color: '#f9a8d4', rare: true },
  { id: 'dragon-theme', name: 'Dragon Theme', emoji: '🐉', type: 'theme', price: 300, color: '#dc2626', rare: true },
  { id: 'ocean-theme', name: 'Ocean Theme', emoji: '🌊', type: 'theme', price: 250, color: '#0ea5e9', rare: false },
  { id: 'dragon-companion', name: 'Dragon Companion', emoji: '🐲', type: 'companion', price: 500, color: '#dc2626', rare: true },
  { id: 'unicorn-companion', name: 'Unicorn Friend', emoji: '🦄', type: 'companion', price: 450, color: '#f9a8d4', rare: true },
];

const CATEGORIES = ['All', 'Skins', 'Backgrounds', 'Accessories', 'Themes', 'Companions'];

const Shop: React.FC<ShopProps> = ({ profile, onUpdateProfile }) => {
  const [category, setCategory] = useState('All');
  const [owned, setOwned] = useState<string[]>(['sakura-bg']);
  const [purchaseAnim, setPurchaseAnim] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<typeof SHOP_ITEMS[0] | null>(null);

  const filtered = SHOP_ITEMS.filter(item => {
    if (category === 'All') return true;
    if (category === 'Skins') return item.type === 'skin';
    if (category === 'Backgrounds') return item.type === 'background';
    if (category === 'Accessories') return item.type === 'accessory';
    if (category === 'Themes') return item.type === 'theme';
    if (category === 'Companions') return item.type === 'companion';
    return true;
  });

  const buy = (item: typeof SHOP_ITEMS[0]) => {
    if (profile.moodCoins < item.price) return;
    setOwned(o => [...o, item.id]);
    onUpdateProfile({ moodCoins: profile.moodCoins - item.price });
    setPurchaseAnim(item.id);
    setConfirmItem(null);
    setTimeout(() => setPurchaseAnim(null), 2000);
  };

  return (
    <FloatingWorld mood={profile.currentMood}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>MoodShop</h1>
              <p className="text-gray-500 mt-1">Spend your MoodCoins</p>
            </div>
            <div className="flex items-center gap-3 glass-card rounded-2xl px-5 py-3">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-xl font-bold text-gray-900">{profile.moodCoins}</p>
              </div>
            </div>
          </div>

          {/* Featured Item */}
          <div className="bento-card rounded-3xl p-6 mb-8 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white animate-sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    fontSize: `${2 + Math.random() * 3}px`,
                  }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
              <div className="text-6xl animate-float">🌌</div>
              <div className="flex-1 text-center lg:text-left">
                <div className="text-xs font-bold text-amber-400 mb-1">Featured This Week</div>
                <h3 className="text-2xl font-bold text-white mb-1">Starry Night Bundle</h3>
                <p className="text-gray-300">Background + Star theme + Cosmic hat</p>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-xs text-gray-400 line-through mb-0.5">600 🪙</div>
                <div className="text-3xl font-bold text-amber-400">399 🪙</div>
                <button className="mt-3 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-gray-900 hover:bg-amber-300 transition-colors" onClick={() => buy({ id: 'starry-bundle', name: 'Starry Night Bundle', emoji: '🌌', type: 'theme', price: 399, color: '#f59e0b', rare: true })}>
                  Buy Bundle
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  category === cat ? 'text-white scale-105' : 'glass text-gray-600 hover:bg-gray-50'
                }`}
                style={category === cat ? { background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' } : {}}>
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {filtered.map(item => {
              const isOwned = owned.includes(item.id);
              const canAfford = profile.moodCoins >= item.price;
              const justBought = purchaseAnim === item.id;

              return (
                <div key={item.id}
                  className={`bento-card glass-card rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${justBought ? 'animate-bounce_soft' : ''}`}>
                  <div className="p-6 flex flex-col items-center gap-2 text-center"
                    style={{ background: `${item.color}15` }}>
                    <div className="text-5xl animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                      {item.emoji}
                    </div>
                    {item.rare && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                        RARE
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-800 text-sm mb-0.5 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mb-3 capitalize">{item.type}</p>
                    {isOwned ? (
                      <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-100 text-green-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold">Owned</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmItem(item)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          canAfford
                            ? 'hover:scale-105 active:scale-95 text-white'
                            : 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100'
                        }`}
                        style={canAfford ? { background: `linear-gradient(135deg, ${item.color}, ${item.color}aa)` } : {}}>
                        {canAfford ?
                          <>{item.price} 🪙</> :
                          <><Lock className="w-3 h-3 inline mr-1" />{item.price} 🪙</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* How to Earn */}
          <div className="bento-card glass-card rounded-3xl p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Earn MoodCoins</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { action: 'Log mood daily', coins: '+5 🪙', emoji: '🎭' },
                { action: 'Journal entry', coins: '+10 🪙', emoji: '✍️' },
                { action: 'Complete game', coins: '+10-18 🪙', emoji: '🎮' },
                { action: '7-day streak', coins: '+50 🪙', emoji: '🔥' },
                { action: 'All missions', coins: '+25 🪙', emoji: '✅' },
              ].map(e => (
                <div key={e.action} className="text-center p-3 rounded-xl bg-white/60">
                  <span className="text-2xl">{e.emoji}</span>
                  <p className="text-sm text-gray-700 mt-2">{e.action}</p>
                  <p className="text-sm font-bold text-amber-600 mt-1">{e.coins}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirm Modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setConfirmItem(null)}>
          <div className="bento-card glass-card rounded-3xl p-8 w-full max-w-md animate-scale-in"
            onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{confirmItem.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900">{confirmItem.name}</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">{confirmItem.price} 🪙</p>
              <p className="text-sm text-gray-500 mt-2">
                Balance after: {profile.moodCoins - confirmItem.price} 🪙
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setConfirmItem(null)}
                className="flex-1 py-4 rounded-2xl glass text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={() => buy(confirmItem)}
                className="flex-1 py-4 rounded-2xl text-white font-bold transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 8px 24px rgba(251,191,36,0.4)' }}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </FloatingWorld>
  );
};

export default Shop;
