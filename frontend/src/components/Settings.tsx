import React, { useState, useRef } from 'react';
import { User, Palette, Bell, Shield, AlertTriangle, FileText, ChevronRight, Camera, Moon, Sun, Check, Volume2, Globe } from 'lucide-react';
import type { UserProfile, Mood, EmergencyContact } from '../types';
import { COMPANIONS } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import { PageLoading } from './LoadingScreen';
import { useToast } from './ToastContext';
import AnimatedCompanion from './AnimatedCompanion';
import { MoodWorld } from './MoodWorld';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (page: any) => void;
}

type SettingsSection = 'personal' | 'appearance' | 'notifications' | 'security' | 'emergency' | 'data';

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<EmergencyContact>({ name: '', phone: '', relation: '' });

  const [formData, setFormData] = useState({
    name: profile.name,
    email: 'user@example.com',
    age: profile.age,
    country: profile.country,
    occupation: profile.occupation,
    selectedCompanion: profile.companion,
    defaultMood: profile.currentMood,
    dailyReminder: true,
    reminderTime: '09:00',
    weeklySummary: true,
    soundEffects: true,
    animations: true,
    theme: 'light',
    avatarUrl: profile.avatarUrl,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(f => ({ ...f, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      onUpdateProfile({
        name: formData.name,
        age: formData.age,
        country: formData.country,
        occupation: formData.occupation,
        companion: formData.selectedCompanion,
        currentMood: formData.defaultMood,
        avatarUrl: formData.avatarUrl,
        settings: {
          ...profile.settings,
          theme: formData.theme === 'dark' ? 'Dark' : 'Light',
          contrast: 'System'
        }
      });
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const theme = MOOD_THEMES[formData.defaultMood];

  const sections: { id: SettingsSection; icon: React.FC<{ className?: string }>; label: string }[] = [
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency' },
    { id: 'data', icon: FileText, label: 'Data & Privacy' },
  ];

  return (
    <MoodWorld mood={formData.defaultMood}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        {loading && <PageLoading message="Saving your settings..." />}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Settings</h1>
              <p className="text-gray-500 mt-1">Customize your experience</p>
            </div>
            {saved && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl animate-fade-in">
                <Check className="w-5 h-5" />
                <span className="font-medium">Saved!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3">
              <nav className="space-y-1">
                {sections.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === id
                        ? 'glass-card text-gray-800'
                        : 'hover:bg-white/40 text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        activeSection === id ? 'shadow-sm' : ''
                      }`}
                      style={{
                        background: activeSection === id ? `${theme.accent}15` : 'transparent',
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: activeSection === id ? theme.accent : '#94a3b8' }}
                      />
                    </div>
                    <span className="font-medium">{label}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto ${activeSection === id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <div className="rounded-3xl p-6 lg:p-8 transition-all" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                {/* Personal Section */}
                {activeSection === 'personal' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="w-6 h-6" style={{ color: theme.accent }} />
                      Personal Information
                    </h2>

                    {/* Avatar */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center text-4xl border-2 border-white shadow-lg overflow-hidden">
                          {formData.avatarUrl ? (
                            <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            formData.name ? formData.name[0].toUpperCase() : '😊'
                          )}
                        </div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">Profile Photo</p>
                        <p className="text-sm text-gray-500 mb-3">This will be shown on your profile</p>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-sky-600 hover:underline">Upload Photo</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(f => ({ ...f, age: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData(f => ({ ...f, country: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        >
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>India</option>
                          <option>Canada</option>
                          <option>Australia</option>
                          <option>Germany</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData(f => ({ ...f, occupation: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                          placeholder="Student, Developer, Teacher..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Section */}
                {activeSection === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Palette className="w-6 h-6" style={{ color: theme.accent }} />
                      Appearance
                    </h2>

                    {/* Companion Selection */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4">Your Companion</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {(Object.entries(COMPANIONS) as [keyof typeof COMPANIONS, typeof COMPANIONS[keyof typeof COMPANIONS]][]).map(([type, info]) => (
                          <button
                            key={type}
                            onClick={() => setFormData(f => ({ ...f, selectedCompanion: type }))}
                            className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${
                              formData.selectedCompanion === type
                                ? 'ring-2 ring-offset-2 shadow-lg'
                                : 'bg-white/60 hover:bg-white/80'
                            }`}
                            style={{
                              ringColor: info.color,
                              background: formData.selectedCompanion === type ? `${info.color}15` : undefined,
                            }}
                          >
                            <AnimatedCompanion type={type} mood="happy" size="sm" />
                            <p className="text-xs font-semibold text-gray-700 mt-1">{info.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Default Mood Theme */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4">Default Mood Theme</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {(Object.entries(MOOD_THEMES) as [Mood, typeof MOOD_THEMES[Mood]][]).map(([mood, t]) => (
                          <button
                            key={mood}
                            onClick={() => setFormData(f => ({ ...f, defaultMood: mood }))}
                            className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${
                              formData.defaultMood === mood ? 'ring-2 ring-offset-2' : ''
                            }`}
                            style={{
                              background: t.cardBg,
                              ringColor: t.accent,
                            }}
                          >
                            <div className="text-2xl mb-1">{t.particles[0]}</div>
                            <p className="text-xs font-medium capitalize" style={{ color: t.textPrimary }}>{mood}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Theme Mode */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-4">Color Mode</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFormData(f => ({ ...f, theme: 'light' }))}
                          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl transition-all ${
                            formData.theme === 'light' ? 'ring-2 ring-sky-400 bg-white shadow-lg' : 'bg-white/60 hover:bg-white/80'
                          }`}
                        >
                          <Sun className="w-5 h-5 text-amber-500" />
                          <span className="font-medium">Light</span>
                        </button>
                        <button
                          onClick={() => setFormData(f => ({ ...f, theme: 'dark' }))}
                          className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl transition-all ${
                            formData.theme === 'dark' ? 'ring-2 ring-sky-400 bg-gray-800 shadow-lg text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Moon className="w-5 h-5" />
                          <span className="font-medium">Dark</span>
                        </button>
                      </div>
                    </div>

                    {/* Animations Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/60">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-700">Animations</p>
                          <p className="text-sm text-gray-500">Enable floating and parallax effects</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData(f => ({ ...f, animations: !f.animations }))}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          formData.animations ? 'bg-sky-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            formData.animations ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Bell className="w-6 h-6" style={{ color: theme.accent }} />
                      Notifications
                    </h2>

                    <div className="space-y-4">
                      {[
                        { key: 'dailyReminder', icon: '⏰', title: 'Daily Reminder', desc: 'Get reminded to log your mood', time: true },
                        { key: 'weeklySummary', icon: '📊', title: 'Weekly Summary', desc: 'Receive your progress overview' },
                        { key: 'soundEffects', icon: '🔊', title: 'Sound Effects', desc: 'Play sounds for achievements' },
                        { key: 'animations', icon: '✨', title: 'Animations', desc: 'Enable smooth transitions and effects' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/60">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <p className="font-medium text-gray-700">{item.title}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                          {item.time ? (
                            <input
                              type="time"
                              value={formData.reminderTime}
                              onChange={(e) => setFormData(f => ({ ...f, reminderTime: e.target.value }))}
                              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
                            />
                          ) : (
                            <button
                              onClick={() => setFormData(f => ({ ...f, [item.key]: !f[item.key as keyof typeof f] }))}
                              className={`w-12 h-7 rounded-full transition-colors ${
                                formData[item.key as keyof typeof formData] ? 'bg-sky-500' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                  formData[item.key as keyof typeof formData] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Shield className="w-6 h-6" style={{ color: theme.accent }} />
                      Security
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/60">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white mb-3"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white mb-3"
                        />
                        <button 
                          onClick={() => showToast('Password update disabled in demo mode.', 'info')}
                          className="px-6 py-2 rounded-xl text-white font-medium"
                          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                          Update Password
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-white/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">🔐</div>
                            <div>
                              <p className="font-medium text-gray-700">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-500">Add extra security to your account</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => showToast('Two-Factor Authentication is currently in beta.', 'info')}
                            className="text-sm font-medium text-sky-600 hover:underline"
                          >
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Section */}
                {activeSection === 'emergency' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" style={{ color: theme.accent }} />
                      Emergency Contacts
                    </h2>

                    {profile.emergencyContacts.length > 0 ? (
                      <div className="space-y-3 mb-6">
                        {profile.emergencyContacts.map((contact, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/60">
                            <div>
                              <p className="font-medium text-gray-700">{contact.name}</p>
                              <p className="text-sm text-gray-500">{contact.relation} • {contact.phone}</p>
                            </div>
                            <button 
                              onClick={() => onUpdateProfile({ emergencyContacts: profile.emergencyContacts.filter((_, idx) => idx !== i) })}
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white/40 rounded-xl mb-6">
                        <p className="text-gray-500">No emergency contacts added yet</p>
                      </div>
                    )}

                    {isAddingContact ? (
                      <div className="p-4 rounded-xl bg-white/60 space-y-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newContact.name}
                          onChange={(e) => setNewContact(c => ({ ...c, name: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={newContact.phone}
                          onChange={(e) => setNewContact(c => ({ ...c, phone: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Relation (e.g. Parent, Friend)"
                          value={newContact.relation}
                          onChange={(e) => setNewContact(c => ({ ...c, relation: e.target.value }))}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (newContact.name && newContact.phone) {
                                onUpdateProfile({ emergencyContacts: [...profile.emergencyContacts, newContact] });
                                setNewContact({ name: '', phone: '', relation: '' });
                                setIsAddingContact(false);
                                showToast('Emergency contact added successfully', 'success');
                              } else {
                                showToast('Please provide at least a name and phone number', 'error');
                              }
                            }}
                            className="flex-1 py-2 rounded-xl text-white font-medium bg-sky-500 hover:bg-sky-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingContact(false);
                              setNewContact({ name: '', phone: '', relation: '' });
                            }}
                            className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingContact(true)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-medium hover:border-sky-400 hover:text-sky-600 transition-colors"
                      >
                        + Add Emergency Contact
                      </button>
                    )}
                  </div>
                )}

                {/* Data Section */}
                {activeSection === 'data' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <FileText className="w-6 h-6" style={{ color: theme.accent }} />
                      Data & Privacy
                    </h2>

                    <div className="space-y-4">
                      <button 
                        onClick={() => showToast('Data export will be sent to your email shortly.', 'success')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📤</span>
                          <div>
                            <p className="font-medium text-gray-700">Export Your Data</p>
                            <p className="text-sm text-gray-500">Download all your journal entries, moods, and insights</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>

                      <button 
                        onClick={() => showToast('Privacy settings updated.', 'success')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🔒</span>
                          <div>
                            <p className="font-medium text-gray-700">Privacy Settings</p>
                            <p className="text-sm text-gray-500">Control what data is collected and stored</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>

                      <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">⚠️</span>
                            <div>
                              <p className="font-medium text-red-700">Delete Account</p>
                              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => showToast('Account deletion is disabled in demo mode.', 'warning')}
                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}aa)`, boxShadow: `0 8px 24px ${theme.accentGlow}` }}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MoodWorld>
  );
};

export default Settings;
