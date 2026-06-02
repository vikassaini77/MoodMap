import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Heart, Sparkles, Star, User, Mail, Lock, Eye, EyeOff, Shield, AlertTriangle, Volume2, Globe } from 'lucide-react';
import type { CompanionType, Mood, UserProfile } from '../types';
import { COMPANIONS } from '../types';
import { MOOD_THEMES } from '../moodTheme';
import { LOADING_MESSAGES } from '../moodTheme';
import AnimatedCompanion from './AnimatedCompanion';
import { register } from '../api';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onLogin?: () => void;
}

const GOALS = [
  { id: 'stress', label: 'Manage Stress', emoji: '😮‍💨' },
  { id: 'anxiety', label: 'Reduce Anxiety', emoji: '💆' },
  { id: 'burnout', label: 'Beat Burnout', emoji: '🔋' },
  { id: 'sleep', label: 'Better Sleep', emoji: '😴' },
  { id: 'productivity', label: 'Boost Productivity', emoji: '⚡' },
  { id: 'focus', label: 'Improve Focus', emoji: '🎯' },
  { id: 'happiness', label: 'Find Happiness', emoji: '🌟' },
  { id: 'relationships', label: 'Better Relationships', emoji: '💞' },
  { id: 'confidence', label: 'Build Confidence', emoji: '💪' },
  { id: 'motivation', label: 'Stay Motivated', emoji: '🔥' },
];

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: 'happy', label: 'Good', emoji: '😊' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'neutral', label: 'Okay', emoji: '😐' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'sad', label: 'Low', emoji: '😢' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
];

const COUNTRIES = ['United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'Other'];

const WELLNESS_QUESTIONS = [
  { q: 'How often do you feel overwhelmed?', options: ['Rarely', 'Sometimes', 'Often', 'Almost always'], key: 'overwhelmed' },
  { q: 'How would you rate your sleep?', options: ['Excellent', 'Good', 'Fair', 'Poor'], key: 'sleep' },
  { q: 'How often do you practice self-care?', options: ['Daily', 'A few times/week', 'Rarely', 'Never'], key: 'selfcare' },
  { q: 'What describes your emotional state?', options: ['Thriving', 'Coping', 'Struggling', 'Crisis'], key: 'state' },
];

const EMOTIONAL_QUESTIONS = [
  { q: 'How often do you feel happy?', options: ['Daily', 'Most days', 'Sometimes', 'Rarely'], key: 'happy' },
  { q: 'How often do you feel stressed?', options: ['Rarely', 'Sometimes', 'Often', 'Constantly'], key: 'stressed' },
  { q: 'How often do you feel motivated?', options: ['Always', 'Often', 'Sometimes', 'Rarely'], key: 'motivated' },
  { q: 'How often do you feel lonely?', options: ['Never', 'Rarely', 'Sometimes', 'Often'], key: 'lonely' },
];

const HABIT_QUESTIONS = [
  { q: 'Average sleep hours per night?', options: ['8+ hours', '6-8 hours', '4-6 hours', '<4 hours'], key: 'sleepHours' },
  { q: 'Daily screen time?', options: ['<2 hours', '2-4 hours', '4-6 hours', '6+ hours'], key: 'screenTime' },
  { q: 'Exercise frequency?', options: ['Daily', '3-5x/week', '1-2x/week', 'Rarely'], key: 'exercise' },
  { q: 'Water intake daily?', options: ['8+ glasses', '4-6 glasses', '1-3 glasses', '<1 glass'], key: 'water' },
];

const SUPPORT_QUESTIONS = [
  { q: 'Do you have family support?', options: ['Yes, very supportive', 'Somewhat', 'Not really', 'No'], key: 'family' },
  { q: 'Do you have close friends?', options: ['Yes, many', 'A few', 'One or two', 'No'], key: 'friends' },
  { q: 'Do you have a mentor or counselor?', options: ['Yes', 'Sometimes', 'Looking for one', 'No'], key: 'mentor' },
];

type OnboardingStep =
  | 'welcome'
  | 'goals'
  | 'habits'
  | 'emotions'
  | 'support'
  | 'companion'
  | 'terms'
  | 'account'
  | 'loading'
  | 'welcome-done';

const STEPS: OnboardingStep[] = ['welcome', 'goals', 'habits', 'emotions', 'support', 'companion', 'terms', 'account', 'loading', 'welcome-done'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLogin }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    country: 'United States',
    occupation: '',
    goals: [] as string[],
    companion: 'fox' as CompanionType,
    currentMood: 'neutral' as Mood,
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    wellnessAnswers: {} as Record<string, string>,
    emotionalAnswers: {} as Record<string, string>,
    habitAnswers: {} as Record<string, string>,
    supportAnswers: {} as Record<string, string>,
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    newsletter: false,
    backendUserId: '',
  });

  const stepIndex = STEPS.indexOf(step);
  const totalMainSteps = 8; // Steps before loading
  const progress = step === 'loading' || step === 'welcome-done' ? 100 : ((stepIndex + 1) / totalMainSteps) * 100;
  const companion = COMPANIONS[form.companion];

  // Loading message rotation
  useEffect(() => {
    if (step !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  // Transition from loading to welcome-done
  useEffect(() => {
    if (step !== 'loading') return;
    const timeout = setTimeout(() => {
      setStep('welcome-done');
      setShowConfetti(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [step]);

  const nextStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
    }
  };

  const toggleGoal = (id: string) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(id) ? f.goals.filter(g => g !== id) : [...f.goals, id],
    }));
  };

  const validateAccount = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      id: form.backendUserId,
      email: form.email,
      name: form.name || 'Friend',
      age: form.age,
      country: form.country,
      occupation: form.occupation,
      goals: form.goals,
      companion: form.companion,
      currentMood: form.currentMood,
      xp: 150,
      level: 1,
      moodCoins: 75,
      streakDays: 1,
      moodHistory: [{
        date: new Date().toISOString(),
        mood: form.currentMood,
        note: 'First day on MoodMap X!',
        energy: 7,
      }],
      achievements: [{
        id: 'first-step',
        title: 'First Step',
        description: 'Started your wellness journey',
        icon: '🌱',
        unlockedAt: new Date().toISOString(),
      }],
      emergencyContacts: form.emergencyName ? [{
        name: form.emergencyName,
        phone: form.emergencyPhone,
        relation: form.emergencyRelation,
      }] : [],
    };
    onComplete(profile);
  };

  const canProceed = (): boolean => {
    if (step === 'goals') return form.goals.length > 0;
    if (step === 'terms') return form.terms1 && form.terms2 && form.terms3 && form.terms4;
    if (step === 'account') {
      return !!(form.name.trim() && form.email.trim() && form.password && form.password.length >= 6 && form.password === form.confirmPassword);
    }
    return true;
  };

  const handleNextClick = async () => {
    if (step === 'welcome-done') {
      handleComplete();
      return;
    }
    if (step === 'account') {
      if (validateAccount()) {
        setStep('loading');
        try {
          const data = await register(form.email, form.password, form.name);
          if (data.token) localStorage.setItem('token', data.token);
          setForm(f => ({ ...f, backendUserId: data.user.id }));
        } catch (err) {
          console.error(err);
          setErrors({ email: 'Registration failed. Email might already exist.' });
          setStep('account');
        }
      }
      return;
    }
    if (step === 'terms' && canProceed()) {
      setStep('account');
      return;
    }
    nextStep();
  };

  // Render loading screen
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center px-8 animate-fade-in">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #22c55e)',
              animation: 'breathe 3s ease-in-out infinite',
            }}>
            <Heart className="w-12 h-12 text-white" fill="currentColor" />
          </div>
          <div className="animate-spin w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full mx-auto mb-6" />
          <p key={loadingMessage} className="text-lg font-semibold text-gray-700 animate-fade-in">
            {LOADING_MESSAGES[loadingMessage]}
          </p>
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto mt-4">
            <div className="h-full bg-gradient-to-r from-sky-500 to-green-500 rounded-full animate-pulse_soft" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  // Render welcome completion
  if (step === 'welcome-done') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white flex items-center justify-center relative overflow-hidden">
        {showConfetti && <ConfettiEffect />}
        <div className="text-center px-8 max-w-md animate-scale-in">
          <div className="text-6xl mb-6 animate-bounce_soft">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome to MoodMap X!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your emotional companion is ready. Your emotional DNA has been created. Your wellness journey begins now.
          </p>

          <div className="glass-card rounded-3xl p-6 mb-6">
            <div className="flex justify-center mb-4">
              <AnimatedCompanion type={form.companion} mood="excited" size="xl" showSpeech
                message={`Hi ${form.name}! I'm ${companion.name}. Let's grow together!`} />
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold gradient-text-sky">+150 XP</div>
                <div className="text-xs text-gray-500">Starting</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold gradient-text-mint">Level 1</div>
                <div className="text-xs text-gray-500">Seedling</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold gradient-text-warm">75</div>
                <div className="text-xs text-gray-500">Coins</div>
              </div>
            </div>
          </div>

          <button onClick={handleComplete}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 8px 24px rgba(14,165,233,0.4)' }}>
            <Sparkles className="w-5 h-5 inline mr-2" />
            Enter MoodMap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute animate-float opacity-20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.2}s`,
              fontSize: '40px',
            }}>
            {['🌸', '✨', '🍃', '💫', '🌟', '🦋'][i]}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress bar */}
        {step !== 'welcome' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Step {Math.min(stepIndex + 1, totalMainSteps)} of {totalMainSteps}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-sky-500 to-green-500"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="glass-card rounded-3xl p-8 shadow-float animate-scale-in">
          {/* Welcome */}
          {step === 'welcome' && (
            <div className="text-center">
              <AnimatedCompanion type="fox" mood="excited" size="xl" showSpeech
                message="Hi there! I'm Kira. Let's create your personalized wellness journey!" />
              <h1 className="text-3xl font-bold text-gray-900 mb-3 mt-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Welcome to MoodMap X
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Answer a few questions so we can personalize your emotional wellness journey.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8 text-center">
                {[{ icon: '🧠', t: 'AI Powered' }, { icon: '🌍', t: 'Living World' }, { icon: '💎', t: 'Private' }].map(i => (
                  <div key={i.t} className="bg-sky-50 rounded-2xl p-3">
                    <div className="text-2xl mb-1">{i.icon}</div>
                    <p className="text-xs font-medium text-gray-600">{i.t}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {step === 'goals' && (
            <div>
              <div className="flex justify-center mb-5">
                <AnimatedCompanion type="fox" mood="happy" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">What matters to you?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Select all that apply.</p>
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-2">
                {GOALS.map(g => (
                  <button key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      form.goals.includes(g.id)
                        ? 'border-sky-400 bg-sky-50 scale-[1.02]'
                        : 'border-gray-200 bg-white/60 hover:border-sky-200'
                    }`}>
                    <span className="text-xl">{g.emoji}</span>
                    <span className="text-sm font-semibold text-gray-700">{g.label}</span>
                    {form.goals.includes(g.id) && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Habits */}
          {step === 'habits' && (
            <div>
              <div className="flex justify-center mb-5">
                <AnimatedCompanion type="fox" mood="calm" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Daily Habits</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Helps us understand your lifestyle.</p>
              <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
                {HABIT_QUESTIONS.map((item) => (
                  <div key={item.key}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{item.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options.map(opt => (
                        <button key={opt}
                          onClick={() => setForm(f => ({ ...f, habitAnswers: { ...f.habitAnswers, [item.key]: opt } }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 ${
                            form.habitAnswers[item.key] === opt
                              ? 'border-sky-400 bg-sky-50 text-sky-700'
                              : 'border-gray-200 bg-white/60 text-gray-600 hover:border-sky-200'
                          }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emotions */}
          {step === 'emotions' && (
            <div>
              <div className="flex justify-center mb-5">
                <AnimatedCompanion type="fox" mood="calm" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Emotional Patterns</h2>
              <p className="text-sm text-gray-500 text-center mb-6">How often do you feel...</p>
              <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
                {EMOTIONAL_QUESTIONS.map((item) => (
                  <div key={item.key}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{item.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options.map(opt => (
                        <button key={opt}
                          onClick={() => setForm(f => ({ ...f, emotionalAnswers: { ...f.emotionalAnswers, [item.key]: opt } }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 ${
                            form.emotionalAnswers[item.key] === opt
                              ? 'border-sky-400 bg-sky-50 text-sky-700'
                              : 'border-gray-200 bg-white/60 text-gray-600 hover:border-sky-200'
                          }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support */}
          {step === 'support' && (
            <div>
              <div className="flex justify-center mb-5">
                <AnimatedCompanion type="fox" mood="calm" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Your Support System</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Understanding your network helps us help you.</p>
              <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
                {SUPPORT_QUESTIONS.map((item) => (
                  <div key={item.key}>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{item.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options.map(opt => (
                        <button key={opt}
                          onClick={() => setForm(f => ({ ...f, supportAnswers: { ...f.supportAnswers, [item.key]: opt } }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border-2 ${
                            form.supportAnswers[item.key] === opt
                              ? 'border-sky-400 bg-sky-50 text-sky-700'
                              : 'border-gray-200 bg-white/60 text-gray-600 hover:border-sky-200'
                          }`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companion Selection */}
          {step === 'companion' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Choose your companion</h2>
              <p className="text-sm text-gray-500 text-center mb-6">They'll grow with you forever.</p>
              <div className="grid grid-cols-2 gap-3 mb-6 max-h-[280px] overflow-y-auto pr-2">
                {(Object.entries(COMPANIONS) as [CompanionType, typeof COMPANIONS[CompanionType]][]).map(([type, info]) => (
                  <button key={type}
                    onClick={() => setForm(f => ({ ...f, companion: type }))}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      form.companion === type
                        ? 'border-sky-400 bg-sky-50 scale-[1.02]'
                        : 'border-gray-200 bg-white/60 hover:border-sky-200'
                    }`}>
                    <div className="w-12 h-12">
                      <AnimatedCompanion type={type} mood="happy" size="sm" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-800 text-sm">{info.name}</p>
                      <p className="text-xs text-gray-500">{info.personality}</p>
                    </div>
                    {form.companion === type && (
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <AnimatedCompanion type={form.companion} mood="excited" size="lg" showSpeech
                  message={`Hi! I'm ${companion.name}. I'll be your wellness companion!`} />
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {step === 'terms' && (
            <div>
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-sky-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Terms & Privacy</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Please review and agree to continue.</p>
              <div className="space-y-3 mb-6">
                {[
                  { key: 'terms1', label: 'I agree to the Terms of Service', required: true },
                  { key: 'terms2', label: 'I agree to the Privacy Policy', required: true },
                  { key: 'terms3', label: 'I consent to MoodMap storing wellness data securely', required: true },
                  { key: 'terms4', label: 'I understand MoodMap is not a medical treatment replacement', required: true },
                  { key: 'newsletter', label: 'Send me wellness tips and updates', required: false },
                ].map(item => (
                  <label key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      form[item.key as keyof typeof form] ? 'bg-green-50 border border-green-200' : 'bg-white/60 hover:bg-white/80'
                    }`}>
                    <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                      form[item.key as keyof typeof form] ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {form[item.key as keyof typeof form] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={form[item.key as keyof typeof form] as boolean}
                      onChange={(e) => setForm(f => ({ ...f, [item.key]: e.target.checked }))}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-700 flex-1">
                      {item.label}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </label>
                ))}
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Required fields must be checked to continue
              </div>
            </div>
          )}

          {/* Account Creation */}
          {step === 'account' && (
            <div>
              <div className="flex justify-center mb-5">
                <AnimatedCompanion type={form.companion} mood="happy" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Create Your Account</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Almost there! Set up your account.</p>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                        errors.name ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Your name"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                        errors.password ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Confirm password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Optional fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                      className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Country</label>
                    <select
                      value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    >
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button onClick={onLogin}
                  className="text-sm text-sky-600 hover:underline font-medium">
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={`flex gap-3 mt-8 ${step === 'welcome' ? 'justify-center' : 'justify-between'}`}>
            {step !== 'welcome' && (
              <button onClick={prevStep}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-gray-600 font-medium transition-all hover:bg-gray-100 glass">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={handleNextClick}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all ${
                canProceed() || step === 'welcome' || step === 'loading'
                  ? 'hover:scale-105 active:scale-95'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                boxShadow: canProceed() || step === 'welcome' ? '0 4px 16px rgba(14,165,233,0.4)' : 'none',
              }}>
              {step === 'account' ? (
                <><Sparkles className="w-4 h-4" /> Create Account</>
              ) : step === 'welcome-done' ? (
                <><Sparkles className="w-4 h-4" /> Enter MoodMap</>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfettiEffect: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 50 }, (_, i) => (
      <div key={i} className="absolute"
        style={{
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: ['#0ea5e9', '#22c55e', '#fbbf24', '#f43f5e', '#fb923c', '#a855f7'][Math.floor(Math.random() * 6)],
          animation: `particleFloat ${2 + Math.random() * 2}s linear ${Math.random()}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
    ))}
  </div>
);

export default Onboarding;
