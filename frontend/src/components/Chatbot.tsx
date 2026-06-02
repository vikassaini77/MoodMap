import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus, MessageSquare, Share, Mic, Image as ImageIcon, X, Settings as SettingsIcon, LogOut, User, Bell, Grid, CreditCard, Database, HardDrive, Shield, Users, UserCheck, Keyboard, Lock } from 'lucide-react';
import { UserProfile, COMPANIONS } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import { MoodWorld } from './MoodWorld';
import AnimatedCompanion from './AnimatedCompanion';
import { sendChatMessage, getChatSessions, createChatSession, getSessionHistory } from '../api';
import { useToast } from './ToastContext';

interface ChatbotProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onSignOut?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'companion';
  text: string;
  image_url?: string;
}

interface ChatSession {
  id: string;
  title: string;
}

const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'personalization', label: 'Personalization', icon: Sparkles },
  { id: 'apps', label: 'Apps', icon: Grid },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'data_controls', label: 'Data controls', icon: Database },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'parental_controls', label: 'Parental controls', icon: Users },
  { id: 'trusted_contact', label: 'Trusted contact', icon: UserCheck },
  { id: 'account', label: 'Account', icon: User },
  { id: 'keyboard', label: 'Keyboard', icon: Keyboard }
];

const Chatbot: React.FC<ChatbotProps> = ({ profile, onUpdateProfile, onSignOut }) => {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>('general');
  const [instructionsInput, setInstructionsInput] = useState(profile.customInstructions || '');
  const [showAppStore, setShowAppStore] = useState(false);
  const [chatHistoryMB, setChatHistoryMB] = useState(2.4);
  const [filesMB, setFilesMB] = useState(14.2);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showMfaWizard, setShowMfaWizard] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const settings = profile.settings || {
    theme: 'System',
    contrast: 'System',
    accentColor: 'Green',
    language: 'Auto-detect',
    dictationEnabled: true,
    spokenLanguage: 'English',
    mfaEnabled: false,
    subscription: 'free'
  };

  const isDark = settings.theme === 'Dark' || (settings.theme === 'System' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const themeAccent = settings.accentColor === 'Green' ? '#10b981' : settings.accentColor === 'Blue' ? '#3b82f6' : '#ec4899';
  
  const companion = COMPANIONS[profile.companion];
  const originalMoodTheme = MOOD_THEMES[profile.currentMood];
  
  const moodTheme = isDark ? {
    ...originalMoodTheme,
    cardBg: '#1e293b',
    cardBorder: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: themeAccent
  } : {
    ...originalMoodTheme,
    accent: themeAccent
  };

  const handleUpdateSetting = (key: keyof typeof settings, value: any) => {
    onUpdateProfile({ settings: { ...settings, [key]: value } });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { sessions } = await getChatSessions();
      setSessions(sessions);
      if (sessions.length > 0 && !currentSessionId) {
        loadSession(sessions[0].id);
      } else if (sessions.length === 0) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const loadSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    try {
      const { history } = await getSessionHistory(sessionId);
      if (history && history.length > 0) {
        setMessages(history.map((h: any, i: number) => ({
          id: `hist-${i}`,
          role: h.role,
          text: h.text,
          image_url: h.image_url
        })));
      } else {
        setMessages([{
          id: Date.now().toString(),
          role: 'companion',
          text: companion.greeting
        }]);
      }
    } catch (err) {
      console.error("Failed to load session history:", err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createChatSession(`Chat ${new Date().toLocaleDateString()}`);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([{
        id: Date.now().toString(),
        role: 'companion',
        text: companion.greeting
      }]);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice recognition is not supported in this browser.", "error");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSaveInstructions = () => {
    onUpdateProfile({ customInstructions: instructionsInput });
    setShowSettingsModal(false);
  };

  const handleShare = () => {
    const textToShare = messages.map(m => `${m.role === 'user' ? 'You' : companion.name}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(`MoodMap Conversation:\n\n${textToShare}`);
    showToast("Chat copied to clipboard!", "success");
  };

  const handleSend = async () => {
    if ((!input.trim() && !imageBase64) || isLoading || !currentSessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      image_url: imageBase64 || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImageBase64(null);
    setIsLoading(true);

    try {
      const historyToSend = messages.map(m => ({ role: m.role, text: m.text }));
      historyToSend.push({ role: 'user', text: userMessage.text });
      
      const response = await sendChatMessage(
        currentSessionId, 
        historyToSend, 
        profile.companion, 
        profile.currentMood, 
        userMessage.image_url,
        profile.customInstructions
      );
      
      const companionMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        text: response.reply
      };
      
      setMessages(prev => [...prev, companionMessage]);
      fetchSessions(); // Refresh title dates etc if needed
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'companion',
        text: "I'm having a little trouble connecting right now, but I'm still here for you."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${profile.name}_moodmap_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <MoodWorld mood={profile.currentMood}>
      <div className="lg:pl-56 xl:pl-64 h-screen flex">
        {/* Sidebar for Chat History */}
        <div className="w-64 border-r bg-white/40 backdrop-blur-md hidden md:flex flex-col h-full z-10 relative shadow-sm" style={{ borderColor: moodTheme.cardBorder }}>
          <div className="p-4 border-b" style={{ borderColor: moodTheme.cardBorder }}>
            <button 
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium shadow hover:shadow-md transition-all active:scale-95"
              style={{ background: moodTheme.accent }}
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${currentSessionId === session.id ? 'bg-white/80 shadow-sm scale-100 ring-1' : 'hover:bg-white/50'}`}
                style={{ ringColor: currentSessionId === session.id ? moodTheme.accent : 'transparent' }}
              >
                <MessageSquare className={`w-4 h-4 ${currentSessionId === session.id ? 'opacity-100' : 'opacity-60'}`} style={{ color: moodTheme.accent }} />
                <span className="text-sm font-medium truncate flex-1" style={{ color: currentSessionId === session.id ? moodTheme.textPrimary : moodTheme.textSecondary }}>{session.title}</span>
              </button>
            ))}
          </div>
          {/* User Profile Bottom Area */}
          <div className="p-3 border-t relative" style={{ borderColor: moodTheme.cardBorder }}>
            {showProfileMenu && (
              <div className="absolute bottom-full left-3 w-56 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                <div className="p-1">
                  <button 
                    onClick={() => { setShowProfileMenu(false); setSettingsTab('personalization'); setShowSettingsModal(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Personalization
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); setSettingsTab('general'); setShowSettingsModal(true); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  <button 
                    onClick={() => { setShowProfileMenu(false); if (onSignOut) onSignOut(); }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/60"
            >
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sm font-bold shadow-sm" style={{ color: moodTheme.textPrimary }}>
                 {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : profile.name[0]?.toUpperCase()}
              </div>
              <span className="font-semibold text-sm truncate flex-1 text-left" style={{ color: moodTheme.textPrimary }}>{profile.name}</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 max-w-5xl w-full mx-auto p-0 md:p-4 lg:p-6 flex flex-col h-full pb-20 lg:pb-6 relative z-0">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-4 md:px-0 mt-4 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg"
                   style={{ background: `${moodTheme.cardBg}`, border: `1px solid ${moodTheme.cardBorder}` }}>
                <AnimatedCompanion type={profile.companion} mood={profile.currentMood} size="sm" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: moodTheme.textPrimary }}>
                  Chat with {companion.name}
                </h1>
                <p className="text-xs md:text-sm font-medium" style={{ color: moodTheme.textSecondary }}>
                  {companion.personality}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="p-2 rounded-xl bg-white/60 hover:bg-white transition-all shadow-sm flex items-center gap-2" title="Share Chat">
                <Share className="w-4 h-4" style={{ color: moodTheme.accent }} />
                <span className="text-xs font-semibold hidden sm:inline" style={{ color: moodTheme.textPrimary }}>Share</span>
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 bento-card rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-xl"
               style={{ background: moodTheme.cardBg, border: `1px solid ${moodTheme.cardBorder}` }}>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'companion' && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-1 shadow-sm"
                         style={{ background: `${companion.color}20` }}>
                      <span className="text-lg">{companion.emoji}</span>
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'rounded-tr-sm text-white shadow-md' 
                        : 'rounded-tl-sm shadow-sm'
                    }`}
                    style={{ 
                      background: msg.role === 'user' 
                        ? `linear-gradient(135deg, ${moodTheme.accent}, ${moodTheme.accent}dd)` 
                        : 'rgba(255, 255, 255, 0.7)',
                      color: msg.role === 'user' ? '#fff' : moodTheme.textPrimary,
                      border: msg.role === 'user' ? 'none' : `1px solid ${moodTheme.cardBorder}`
                    }}
                  >
                    {msg.image_url && (
                      <img src={msg.image_url} alt="Attached" className="max-w-full rounded-lg mb-2 shadow-sm" />
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-1"
                       style={{ background: `${companion.color}20` }}>
                    <span className="text-lg">{companion.emoji}</span>
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2"
                       style={{ background: 'rgba(255, 255, 255, 0.7)', border: `1px solid ${moodTheme.cardBorder}` }}>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: moodTheme.accent }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: moodTheme.accent, animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: moodTheme.accent, animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 border-t" style={{ borderColor: moodTheme.cardBorder, background: 'rgba(255,255,255,0.4)' }}>
              {imageBase64 && (
                <div className="mb-2 relative inline-block">
                  <img src={imageBase64} alt="Preview" className="h-16 rounded-md shadow-sm border border-gray-200" />
                  <button onClick={() => setImageBase64(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-md transition-transform hover:scale-110">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="relative flex items-center gap-1 bg-white/90 rounded-2xl shadow-inner border p-1" style={{ borderColor: moodTheme.cardBorder }}>
                
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all" title="Attach Image">
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                {settings.dictationEnabled && (
                  <button onClick={toggleVoice} className={`p-2.5 rounded-xl transition-all ${isListening ? 'text-white bg-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`} title="Voice Dictation">
                    <Mic className="w-5 h-5" />
                  </button>
                )}

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : `Tell ${companion.name}...`}
                  className="flex-1 py-3 px-2 focus:outline-none bg-transparent resize-none font-medium"
                  style={{ minHeight: '48px', maxHeight: '120px', color: moodTheme.textPrimary }}
                  rows={1}
                />
                
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !imageBase64) || isLoading || !currentSessionId}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
                  style={{ background: moodTheme.accent }}
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>

            </div>
            
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[600px] max-h-[85vh] shadow-2xl animate-fade-in relative flex overflow-hidden">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Left Tabs */}
            <div className="w-64 bg-gray-50 border-r border-gray-100 p-4 flex flex-col pt-12 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">Settings</h2>
              <nav className="space-y-1 pb-10">
                {SETTINGS_TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => {
                        setSettingsTab(tab.id);
                        if (tab.id === 'apps') setShowAppStore(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors
                        ${settingsTab === tab.id ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              {settingsTab === 'general' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Secure Account Banner or MFA Wizard */}
                  {!settings.mfaEnabled && !showMfaWizard && (
                    <div className="bg-gray-900 text-white rounded-xl p-5 shadow-lg relative">
                      <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" onClick={() => handleUpdateSetting('mfaEnabled', true)}>
                        <X className="w-4 h-4" />
                      </button>
                      <Lock className="w-5 h-5 mb-3 text-gray-300" />
                      <h4 className="font-bold text-sm mb-1">Secure your account</h4>
                      <p className="text-sm text-gray-300 mb-4 pr-6 leading-relaxed">
                        Add multi-factor authentication (MFA), like a text message or authenticator app, to help protect your account when logging in.
                      </p>
                      <button 
                        onClick={() => setShowMfaWizard(true)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                      >
                        Set up MFA
                      </button>
                    </div>
                  )}

                  {showMfaWizard && (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative animate-fade-in">
                      <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setShowMfaWizard(false)}>
                        <X className="w-4 h-4" />
                      </button>
                      <h4 className="font-bold text-lg mb-2 text-gray-900">Set up authenticator app</h4>
                      <p className="text-sm text-gray-600 mb-4 pr-6">
                        Scan the QR code below with your authenticator app, then enter the 6-digit code it generates.
                      </p>
                      <div className="flex flex-col items-center mb-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <Grid className="w-24 h-24 text-gray-800" />
                        <p className="text-xs text-gray-400 mt-4 font-mono">ASDF-1234-QWER-5678</p>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          maxLength={6} 
                          placeholder="000000"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                          onClick={() => {
                            if(mfaCode.length === 6) {
                              handleUpdateSetting('mfaEnabled', true);
                              setShowMfaWizard(false);
                              showToast("MFA enabled successfully!", "success");
                            } else {
                              showToast("Please enter a valid 6-digit code.", "error");
                            }
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-5 pt-2">
                    {/* Appearance */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Appearance</p>
                      </div>
                      <select 
                        value={settings.theme} 
                        onChange={(e) => handleUpdateSetting('theme', e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer appearance-none text-right w-32 pr-4 bg-no-repeat" style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 0.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                        <option value="Dark">Dark</option>
                        <option value="System">System</option>
                        <option value="Light">Light</option>
                      </select>
                    </div>

                    {/* Contrast */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Contrast</p>
                      </div>
                      <select 
                        value={settings.contrast} 
                        onChange={(e) => handleUpdateSetting('contrast', e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer appearance-none text-right w-32 pr-4 bg-no-repeat" style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 0.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                        <option value="System">System</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    {/* Accent Color */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Accent color</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2.5 h-2.5 rounded-full mr-2 ${settings.accentColor === 'Green' ? 'bg-green-500' : settings.accentColor === 'Blue' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                        <select 
                          value={settings.accentColor} 
                          onChange={(e) => handleUpdateSetting('accentColor', e.target.value)}
                          className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer appearance-none text-right w-24 pr-4 bg-no-repeat" style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 0.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                          <option value="Green">Green</option>
                          <option value="Blue">Blue</option>
                          <option value="Pink">Pink</option>
                        </select>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Language</p>
                      </div>
                      <select 
                        value={settings.language} 
                        onChange={(e) => handleUpdateSetting('language', e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer appearance-none text-right w-32 pr-4 bg-no-repeat" style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 0.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                        <option value="Auto-detect">Auto-detect</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>

                    {/* Enable Dictation */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Enable Dictation</p>
                        <p className="text-xs text-gray-500 mt-0.5">Use dictation in the chat composer.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.dictationEnabled} 
                          onChange={(e) => handleUpdateSetting('dictationEnabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    {/* Spoken Language */}
                    <div className="flex items-center justify-between pt-2 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Spoken language</p>
                      </div>
                      <select 
                        value={settings.spokenLanguage} 
                        onChange={(e) => handleUpdateSetting('spokenLanguage', e.target.value)}
                        className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer appearance-none text-right w-32 pr-4 bg-no-repeat" style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundPosition: 'right 0.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {settingsTab === 'personalization' && (
                <div className="space-y-6 animate-fade-in max-w-2xl">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Personalization</h3>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Custom Instructions</p>
                    <p className="text-sm text-gray-500 mb-4">
                      What would you like Kira to know about you? (e.g., "Call me Captain", "Always respond with a pirate voice")
                    </p>
                    <textarea
                      value={instructionsInput}
                      onChange={(e) => setInstructionsInput(e.target.value)}
                      placeholder="Enter your custom instructions here..."
                      className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 bg-white text-gray-800 resize-none shadow-sm"
                      style={{ focusRing: moodTheme.accent }}
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => {
                        onUpdateProfile({ customInstructions: instructionsInput });
                        setShowSettingsModal(false);
                      }}
                      className="px-6 py-2.5 rounded-xl font-medium text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                      style={{ background: moodTheme.accent }}
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
              {settingsTab === 'notifications' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Notifications</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">App notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">Receive push notifications for important updates.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Email notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">Receive marketing emails and weekly summaries.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'apps' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Connected Apps</h3>
                  
                  {!showAppStore ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Grid className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No apps connected yet</p>
                      <button 
                        onClick={() => setShowAppStore(true)}
                        className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                      >
                        Browse Apps
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">G</div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Google Drive</p>
                            <p className="text-xs text-gray-500">Import files and documents directly.</p>
                          </div>
                        </div>
                        <button 
                          className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${googleConnected ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300 hover:bg-gray-50'}`} 
                          onClick={() => {
                            if (!googleConnected) {
                              showToast('Authenticating with Google...', 'info');
                              setGoogleConnected(true);
                            } else {
                              if(window.confirm('Disconnect Google Drive?')) {
                                setGoogleConnected(false);
                              }
                            }
                          }}
                        >
                          {googleConnected ? 'Connected' : 'Connect'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">S</div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Spotify</p>
                            <p className="text-xs text-gray-500">Share your listening habits with your companion.</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors" onClick={() => showToast('Opening Spotify Auth...', 'info')}>Connect</button>
                      </div>
                      <button className="text-sm text-gray-500 hover:underline mt-4" onClick={() => setShowAppStore(false)}>← Back</button>
                    </div>
                  )}
                </div>
              )}

              {settingsTab === 'billing' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Billing</h3>
                  
                  <div className={`bg-gray-50 border ${settings.subscription === 'plus' ? 'border-green-300 bg-green-50' : 'border-gray-200'} rounded-xl p-5 flex items-center justify-between`}>
                    <div>
                      <p className="font-bold text-gray-900">{settings.subscription === 'plus' ? 'MoodMap Plus' : 'Free Plan'}</p>
                      <p className="text-sm text-gray-500 mt-1">{settings.subscription === 'plus' ? 'Premium access to all models and features.' : 'Basic access to features and models.'}</p>
                    </div>
                    {settings.subscription !== 'plus' ? (
                      <button 
                        onClick={() => setShowCheckoutModal(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
                      >
                        Upgrade to Plus
                      </button>
                    ) : (
                      <div className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-bold">
                        Active
                      </div>
                    )}
                  </div>
                </div>
              )}

              {settingsTab === 'data_controls' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Data Controls</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Chat history & training</p>
                        <p className="text-xs text-gray-500 mt-0.5 max-w-md">Save new chats on this browser to your history and allow them to be used to improve our models.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Shared links</p>
                      </div>
                      <button 
                        onClick={() => showToast("You have 0 shared links.", 'info')}
                        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Export data</p>
                      </div>
                      <button 
                        onClick={handleExportData}
                        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Export
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium text-red-600 text-sm">Delete account</p>
                        <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and data.</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
                            showToast("Account scheduled for deletion. You will be logged out.", 'error');
                            if (onSignOut) onSignOut();
                          }
                        }}
                        className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'storage' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Storage</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Chat history</p>
                          <p className="text-xs text-gray-500 mt-0.5">{chatHistoryMB} MB used</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if(window.confirm("Clear all chat history?")) {
                            setChatHistoryMB(0);
                            setSessions([]);
                            setMessages([]);
                            showToast("Chat history cleared.", "success");
                          }
                        }}
                        className="text-red-500 text-sm font-medium hover:underline"
                      >Clear</button>
                    </div>

                    <div className="flex items-center justify-between pb-4">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Uploaded files & images</p>
                          <p className="text-xs text-gray-500 mt-0.5">{filesMB} MB used</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setFilesMB(0);
                          showToast("All files cleared.", "success");
                        }}
                        className="text-red-500 text-sm font-medium hover:underline"
                      >Clear</button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'security' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Security</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Multi-factor authentication</p>
                        <p className="text-xs text-gray-500 mt-0.5">Require an extra security step when logging in.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const num = prompt("Enter your mobile number to receive an MFA code:");
                          if (num) showToast(`A verification code was sent to ${num}.`, "success");
                        }}
                        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Log out of all devices</p>
                        <p className="text-xs text-gray-500 mt-0.5">Log out of all active sessions across all devices.</p>
                      </div>
                      <button 
                        onClick={() => {
                          showToast("Logging out of all devices...", "info");
                          if (onSignOut) onSignOut();
                        }}
                        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Log out all
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'parental_controls' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Parental Controls</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Require PIN for changes</p>
                        <p className="text-xs text-gray-500 mt-0.5">Set up a 4-digit PIN to restrict changes to settings.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const pin = prompt("Create a new 4-digit PIN:");
                          if (pin) showToast("PIN set successfully!", "success");
                        }}
                        className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Setup PIN
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'trusted_contact' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Trusted Contact</h3>
                  
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-center">
                    <UserCheck className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-900 mb-1">No trusted contacts added</p>
                    <p className="text-xs text-gray-500 max-w-xs mb-4">Add a trusted contact to help you recover your account if you lose access.</p>
                    <button 
                      onClick={() => {
                        prompt("Enter the email address of your trusted contact:");
                        showToast("An invitation has been sent to them!", "success");
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              )}

              {settingsTab === 'account' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Account</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Email Address</p>
                      </div>
                      <p className="text-sm text-gray-600">{profile.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Subscription</p>
                      </div>
                      <p className="text-sm text-gray-600">{settings.subscription === 'plus' ? 'MoodMap Plus' : 'Free Plan'}</p>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'keyboard' && (
                <div className="space-y-6 max-w-2xl animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Keyboard Shortcuts</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Open new chat</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Shift</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">O</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Focus chat input</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Shift</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Esc</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Copy last response</span>
                      <div className="flex gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Ctrl</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">Shift</kbd>
                        <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs text-gray-500 font-mono">C</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Checkout Modal Overlay */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Upgrade to Plus</h3>
                <p className="text-sm text-gray-500 mt-1">Unlock advanced features.</p>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-blue-900">MoodMap Plus</p>
                  <p className="text-xs text-blue-700">Billed monthly</p>
                </div>
                <p className="font-bold text-xl text-blue-900">$20.00</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                  <div className="border border-gray-300 rounded-lg p-3 flex items-center gap-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Card number" className="flex-1 outline-none text-sm font-mono" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input type="text" placeholder="MM / YY" className="w-full outline-none text-sm font-mono" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input type="text" placeholder="CVC" className="w-full outline-none text-sm font-mono" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <input type="text" placeholder="Name on card" className="w-full outline-none text-sm" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsProcessingPayment(true);
                  setTimeout(() => {
                    handleUpdateSetting('subscription', 'plus');
                    setIsProcessingPayment(false);
                    setShowCheckoutModal(false);
                    showToast("Payment successful! Welcome to MoodMap Plus!", "success");
                  }, 2000);
                }}
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MoodWorld>
  );
};

export default Chatbot;
