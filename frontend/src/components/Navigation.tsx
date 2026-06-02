import React, { useState, useEffect } from 'react';
import { Home, BookOpen, MessageCircle, Users, TreePine, Brain, Gamepad2, ShoppingBag, User, AlertTriangle, Settings, Sparkles, Zap, Heart, ChevronLeft, ChevronRight, Bell, LogOut, type LucideIcon } from 'lucide-react';
import { getAuthHeaders } from '../api';
import type { Page } from '../types';
import { COMPANIONS } from '../types';
import type { UserProfile } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import AnimatedCompanion from './AnimatedCompanion';

interface NavItem {
  page: Page;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'home', icon: Home, label: 'Dashboard' },
  { page: 'journal', icon: BookOpen, label: 'Journal' },
  { page: 'chat', icon: MessageCircle, label: 'Chat' },
  { page: 'council', icon: Users, label: 'Council' },
  { page: 'sanctuary', icon: TreePine, label: 'Sanctuary' },
  { page: 'insights', icon: Brain, label: 'Emotional DNA' },
  { page: 'arcade', icon: Gamepad2, label: 'Arcade' },
  { page: 'shop', icon: ShoppingBag, label: 'Shop' },
  { page: 'profile', icon: User, label: 'Profile' },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profile: UserProfile;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, profile, onSignOut }) => {
  const [collapsed, setCollapsed] = useState(false);
  const companion = COMPANIONS[profile.companion];
  const moodTheme = MOOD_THEMES[profile.currentMood];
  const levelProgress = ((profile.xp % 500) / 500) * 100;

  return (
    <aside
      className={`sidebar-desktop fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-500 backdrop-blur-xl border-r`}
      style={{
        width: collapsed ? '72px' : '240px',
        background: `linear-gradient(180deg, ${moodTheme.sidebarBg.includes('from') ? '' : moodTheme.cardBg})`,
        borderColor: moodTheme.cardBorder,
      }}
    >
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b transition-colors
        ${collapsed ? 'justify-center' : ''}`}
        style={{ borderColor: moodTheme.cardBorder }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse_soft"
          style={{
            background: `linear-gradient(135deg, ${moodTheme.accent}, ${moodTheme.accent}aa)`,
            boxShadow: `0 0 20px ${moodTheme.accentGlow}`,
          }}
        >
          <Heart className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in">
            <span
              className="text-lg font-bold whitespace-nowrap"
              style={{ fontFamily: 'Playfair Display, serif', color: moodTheme.textPrimary }}
            >
              MoodMap X
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-xs" style={{ color: moodTheme.textSecondary }}>Level {profile.level}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden ml-2 max-w-16"
                style={{ background: `${moodTheme.accent}30` }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${levelProgress}%`,
                    background: `linear-gradient(90deg, ${moodTheme.accent}, ${moodTheme.accent}88)`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini companion */}
      <div className={`px-3 py-4 border-b transition-colors ${collapsed ? 'flex justify-center' : ''}`}
        style={{ borderColor: moodTheme.cardBorder }}>
        <div
          className={`rounded-xl p-3 ${collapsed ? '' : 'flex items-center gap-3'}`}
          style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
        >
          <div className="animate-float flex-shrink-0">
            <AnimatedCompanion type={profile.companion} mood={moodTheme.companionMood} size="sm" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="font-semibold text-sm truncate" style={{ color: moodTheme.textPrimary }}>{companion.name}</p>
              <p className="text-xs truncate" style={{ color: moodTheme.textSecondary }}>{companion.personality}</p>
            </div>
          )}
        </div>
      </div>

      {/* Current mood indicator */}
      {!collapsed && (
        <div className="px-3 py-3 border-b" style={{ borderColor: moodTheme.cardBorder }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: `${moodTheme.accent}15` }}>
            <div className="text-xl animate-float">{moodTheme.particles[0]}</div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: moodTheme.textSecondary }}>Weather</p>
              <p className="text-xs font-semibold" style={{ color: moodTheme.textPrimary }}>{moodTheme.weather}</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full animate-pulse_soft" style={{ background: moodTheme.accent }} />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ page, icon: Icon, label }) => {
            const isActive = currentPage === page;
            return (
              <li key={page}>
                <button
                  onClick={() => onNavigate(page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                    ${isActive ? 'shadow-sm' : 'hover:bg-white/20'}
                    ${collapsed ? 'justify-center px-0' : ''}`}
                  style={{
                    background: isActive ? `${moodTheme.accent}15` : 'transparent',
                    borderLeft: isActive ? `3px solid ${moodTheme.accent}` : '3px solid transparent',
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'shadow-sm' : 'group-hover:scale-110'
                    }`}
                    style={{ background: isActive ? `${moodTheme.accent}20` : 'transparent' }}
                  >
                    <Icon
                      className="w-4.5 h-4.5 transition-colors"
                      style={{ color: isActive ? moodTheme.accent : moodTheme.textSecondary }}
                    />
                  </div>
                  {!collapsed && (
                    <span
                      className="font-medium text-sm transition-colors animate-fade-in"
                      style={{ color: isActive ? moodTheme.textPrimary : moodTheme.textSecondary }}
                    >
                      {label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 mx-3 border-t" style={{ borderColor: moodTheme.cardBorder }} />

        {/* SOS Button */}
        <button
          onClick={() => onNavigate('sos')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-4
            hover:scale-[1.02]
            ${collapsed ? 'justify-center px-0' : ''}`}
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1))',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse_soft"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-red-600 text-sm animate-fade-in">SOS Shield</span>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate('settings' as Page)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/20 mb-2
            ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Settings className="w-4.5 h-4.5" style={{ color: moodTheme.textSecondary }} />
          </div>
          {!collapsed && (
            <span className="font-medium text-sm animate-fade-in" style={{ color: moodTheme.textSecondary }}>
              Settings
            </span>
          )}
        </button>

        {/* Sign Out */}
        {onSignOut && (
          <button
            onClick={onSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-50 hover:text-red-600
              ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut className="w-4.5 h-4.5" style={{ color: moodTheme.textSecondary }} />
            </div>
            {!collapsed && (
              <span className="font-medium text-sm animate-fade-in" style={{ color: moodTheme.textSecondary }}>
                Sign Out
              </span>
            )}
          </button>
        )}
      </nav>

      {/* User Stats Footer */}
      <div className={`px-3 py-4 border-t`} style={{ borderColor: moodTheme.cardBorder }}>
        <div
          className={`rounded-xl p-3 ${collapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}
          style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}
        >
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs">🪙</span>
              <span className="text-xs font-bold" style={{ color: moodTheme.textPrimary }}>{profile.moodCoins}</span>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold" style={{ color: moodTheme.textSecondary }}>MoodCoins</span>
                </div>
                <div className="text-lg font-bold" style={{ color: moodTheme.textPrimary }}>{profile.moodCoins}</div>
              </div>
              <div className="text-center px-3 border-l" style={{ borderColor: moodTheme.cardBorder }}>
                <div className="text-xs mb-1" style={{ color: moodTheme.textSecondary }}>Streak</div>
                <div className="text-lg font-bold text-amber-600">{profile.streakDays}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all"
        style={{
          background: moodTheme.cardBg,
          borderColor: moodTheme.cardBorder,
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" style={{ color: moodTheme.textSecondary }} />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" style={{ color: moodTheme.textSecondary }} />
        )}
      </button>
    </aside>
  );
};

// Mobile Bottom Navigation
interface MobileNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profile: UserProfile;
  onSignOut?: () => void;
}

const MOBILE_NAV_ITEMS: NavItem[] = [
  { page: 'home', icon: Home, label: 'Home' },
  { page: 'journal', icon: BookOpen, label: 'Journal' },
  { page: 'chat', icon: MessageCircle, label: 'Chat' },
  { page: 'council', icon: Users, label: 'Council' },
  { page: 'sanctuary', icon: TreePine, label: 'Sanctuary' },
  { page: 'insights', icon: Brain, label: 'Insights' },
  { page: 'arcade', icon: Gamepad2, label: 'Arcade' },
  { page: 'shop', icon: ShoppingBag, label: 'Shop' },
  { page: 'profile', icon: User, label: 'Profile' },
];

export const BottomNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate, profile, onSignOut }) => {
  const moodTheme = MOOD_THEMES[profile.currentMood];

  return (
    <nav
      className="mobile-nav fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: moodTheme.cardBg,
        borderColor: moodTheme.cardBorder,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {MOBILE_NAV_ITEMS.map(({ page, icon: Icon, label }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'shadow-sm' : ''
                }`}
                style={{ background: isActive ? `${moodTheme.accent}15` : 'transparent' }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? moodTheme.accent : moodTheme.textSecondary }}
                />
              </div>
              <span
                className="text-xs font-medium transition-colors"
                style={{
                  color: isActive ? moodTheme.accent : moodTheme.textSecondary,
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
        {/* SOS in mobile */}
        <button
          onClick={() => onNavigate('sos')}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center animate-pulse_soft"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium" style={{ fontSize: '10px', color: '#ef4444' }}>SOS</span>
        </button>
        {/* Sign Out in mobile */}
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-xs font-medium text-red-500" style={{ fontSize: '10px' }}>Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
};

// Top Bar for pages
export const TopBar: React.FC<{
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}> = ({ title, subtitle, showBack, onBack, rightContent }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${id}/read`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      fetchNotifications();
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="sticky top-0 z-40 backdrop-blur-lg px-6 py-4 flex items-center gap-3 border-b border-white/60"
      style={{ background: 'rgba(255,255,255,0.8)' }}>
      {showBack && (
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors mr-1">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
               style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div className="px-4 py-2 border-b border-gray-50">
              <h3 className="font-bold text-gray-900">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                    ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {n.title}
                    </h4>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {rightContent}
    </div>
  );
};

export default Sidebar;
