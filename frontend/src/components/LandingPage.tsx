import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Star, ArrowRight, Play, Shield, Brain, Zap, Users, Award, ChevronDown, X } from 'lucide-react';
import AnimatedCompanion from './AnimatedCompanion';

interface LandingPageProps {
  onEnter: () => void;
  onLogin: () => void;
}

const FEATURES = [
  { icon: Brain, title: 'AI Emotional DNA', desc: 'Your unique emotional blueprint, built by AI that learns you.', color: '#0ea5e9' },
  { icon: Heart, title: 'Living Companion', desc: 'A real animated friend who grows with you, day by day.', color: '#f43f5e' },
  { icon: Sparkles, title: 'Mood Weather', desc: 'Your world literally changes based on how you feel.', color: '#fbbf24' },
  { icon: Zap, title: 'Mood Arcade', desc: 'Fun mini-games that heal your mind while you play.', color: '#22c55e' },
  { icon: Shield, title: 'SOS Shield', desc: 'One-tap emergency support when you need it most.', color: '#f97316' },
  { icon: Star, title: 'Growth Journey', desc: 'Level up, earn rewards, and watch yourself blossom.', color: '#a855f7' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Product Designer', text: 'MoodMap X changed how I relate to my emotions. My companion Kira has been with me through everything.', avatar: '👩‍💼', rating: 5 },
  { name: 'James K.', role: 'Software Engineer', text: "The mood weather feature is genius. When I'm anxious, the world turns gentle. It's deeply comforting.", avatar: '👨‍💻', rating: 5 },
  { name: 'Priya S.', role: 'Graduate Student', text: 'I went from burning out to thriving. The AI insights helped me see patterns I never noticed before.', avatar: '👩‍🎓', rating: 5 },
];

const STATS = [
  { value: '2.4M+', label: 'Lives Touched' },
  { value: '98%', label: 'Feel Better' },
  { value: '4.9★', label: 'App Rating' },
  { value: '180+', label: 'Countries' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onLogin }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: scrollY > 50 ? 'rgba(255,255,255,0.9)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.8)' : 'none',
          transition: 'all 0.3s ease' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            MoodMap X
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Companions', 'Stories', 'Science'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin}
            className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors px-4 py-2">
            Sign In
          </button>
          <button onClick={onEnter}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}>
            Begin Journey
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Parallax clouds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute animate-drift-slow opacity-60" style={{ top: '8%' }}>
            <CloudSVG width={200} color="rgba(186,230,253,0.7)" />
          </div>
          <div className="absolute animate-drift opacity-50" style={{ top: '22%', animationDelay: '-12s' }}>
            <CloudSVG width={140} color="rgba(186,230,253,0.5)" />
          </div>
          <div className="absolute animate-drift-slow opacity-40" style={{ top: '55%', animationDelay: '-8s' }}>
            <CloudSVG width={180} color="rgba(186,230,253,0.4)" />
          </div>
          {/* Stars */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="absolute animate-sparkle"
              style={{
                left: `${10 + i * 8}%`,
                top: `${10 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.4}s`,
                fontSize: `${8 + Math.random() * 8}px`,
              }}>
              ✦
            </div>
          ))}
        </div>

        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)' }}>
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium text-sky-600">World's First Living Emotional Ecosystem</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Your emotions deserve<br />
            <span className="gradient-text-sky">a living world</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed font-light">
            Not a dashboard. Not a tracker.
          </p>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            An AI companion ecosystem that <strong>grows with you</strong>, reacts to you, and understands you.
          </p>

          {/* Companion showcase */}
          <div className="flex items-end justify-center gap-4 mb-12">
            {(['fox', 'bunny', 'panda', 'otter', 'cat'] as const).map((type, i) => (
              <div key={type}
                className="animate-float transition-transform hover:scale-110"
                style={{
                  animationDelay: `${i * 0.6}s`,
                  transform: `scale(${i === 2 ? 1.4 : i === 1 || i === 3 ? 1.1 : 0.85})`,
                  zIndex: i === 2 ? 10 : 1,
                  filter: i === 2 ? 'none' : 'blur(0.5px)',
                  opacity: i === 2 ? 1 : 0.8,
                }}>
                <AnimatedCompanion type={type} mood="happy" size={i === 2 ? 'xl' : 'lg'} />
              </div>
            ))}
          </div>

          {/* Speech bubble from center companion */}
          <div className="speech-bubble glass-card inline-block px-6 py-3 mb-10 animate-fade-in"
            style={{ animationDelay: '0.8s' }}>
            <p className="text-base text-gray-700 font-medium">
              "Ready to begin your journey? I'll be with you every step." — Kira the Fox
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onEnter}
              className="group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-glow"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 8px 32px rgba(14,165,233,0.4)' }}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold text-gray-700 glass-card transition-all hover:scale-105" onClick={() => setShowVideoModal(true)}>
              <Play className="w-5 h-5 text-sky-500" fill="currentColor" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce_soft">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text-sky mb-1"
                  style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Weather Preview (Science) */}
      <section id="science" className="py-20 px-6 bg-gradient-to-r from-sky-50 to-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Your world reacts to <span className="gradient-text-sky">how you feel</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When you're happy, sunshine. When you're calm, gentle breezes. When you're sad, your companion comes closer.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { mood: 'happy', bg: 'from-amber-100 to-yellow-50', label: '😊 Happy', desc: 'Sunshine & birds appear' },
              { mood: 'calm', bg: 'from-teal-100 to-green-50', label: '😌 Calm', desc: 'Gentle breeze & leaves' },
              { mood: 'sad', bg: 'from-blue-100 to-slate-100', label: '😢 Sad', desc: 'Soft rain, companion near' },
              { mood: 'excited', bg: 'from-orange-100 to-yellow-50', label: '🤩 Excited', desc: 'Sparkles & confetti' },
              { mood: 'anxious', bg: 'from-blue-100 to-slate-50', label: '😰 Anxious', desc: 'Calm sanctuary opens' },
              { mood: 'neutral', bg: 'from-sky-100 to-blue-50', label: '😐 Neutral', desc: 'Peaceful cloudscape' },
            ].map(item => (
              <div key={item.mood}
                className={`bg-gradient-to-br ${item.bg} rounded-2xl p-6 card-hover glass-card`}>
                <div className="text-2xl mb-2">{item.label}</div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Not an app. An <span className="gradient-text-mint">ecosystem</span>.
            </h2>
            <p className="text-lg text-gray-600">Every feature works together to create a living, breathing world.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="glass-card rounded-2xl p-6 card-hover group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}22` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companions Section */}
      <section id="companions" className="py-20 px-6 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              Meet your <span className="gradient-text-coral">companion</span>
            </h2>
            <p className="text-lg text-gray-600">7 unique personalities. Each one unique. Choose the one that speaks to your soul.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { type: 'fox', name: 'Kira', trait: 'Playful & Clever', color: '#fb923c' },
              { type: 'panda', name: 'Bao', trait: 'Calm & Wise', color: '#4ade80' },
              { type: 'bunny', name: 'Luna', trait: 'Sweet & Gentle', color: '#f9a8d4' },
              { type: 'otter', name: 'Rio', trait: 'Joyful & Free', color: '#7dd3fc' },
              { type: 'cat', name: 'Mochi', trait: 'Cozy & Curious', color: '#fbbf24' },
              { type: 'penguin', name: 'Finn', trait: 'Loyal & Brave', color: '#bae6fd' },
              { type: 'shiba', name: 'Doge', trait: 'Energetic & Loyal', color: '#fde68a' },
            ].map(c => (
              <div key={c.type} className="glass-card rounded-2xl p-5 card-hover text-center w-36">
                <AnimatedCompanion type={c.type as any} mood="happy" size="md" />
                <p className="font-bold text-gray-800 mt-3 text-sm">{c.name}</p>
                <p className="text-xs text-gray-500 mt-1">{c.trait}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="py-20 px-6 bg-gradient-to-r from-teal-50 to-sky-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Real stories, <span className="gradient-text-sky">real growth</span>
          </h2>
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="text-4xl mb-4 text-gray-300">"</div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-medium italic">
              {TESTIMONIALS[currentTestimonial].text}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-3xl">{TESTIMONIALS[currentTestimonial].avatar}</div>
              <div className="text-left">
                <p className="font-bold text-gray-800">{TESTIMONIALS[currentTestimonial].name}</p>
                <p className="text-sm text-gray-500">{TESTIMONIALS[currentTestimonial].role}</p>
              </div>
              <div className="ml-4 flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? 'w-6 bg-sky-500' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-sky-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-float">
            <AnimatedCompanion type="fox" mood="excited" size="xl" showSpeech message="This is the beginning of something beautiful. I'll be here." />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to enter your<br /><span className="gradient-text-sky">living world?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10">It takes 2 minutes. Your companion is waiting.</p>
          <button onClick={onEnter}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full text-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 12px 40px rgba(14,165,233,0.5)' }}>
            Begin Your Journey
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-400 mt-4">Free forever. No credit card. Just growth.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-gray-700" style={{ fontFamily: 'Playfair Display, serif' }}>MoodMap X</span>
        </div>
        <p className="text-sm text-gray-400">Built with love. Designed for growth.</p>
      </footer>
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl animate-scale-in relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center text-white relative">
              <Play className="w-16 h-16 text-white/50 mb-4" />
              <p className="text-lg font-medium text-white/80">MoodMap Introduction Video Placeholder</p>
              <p className="text-sm text-white/50 mt-2">Connect a real video source here.</p>
            </div>
            <div className="p-6 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome to MoodMap X</h3>
                <p className="text-sm text-gray-500">Discover how your emotional ecosystem works.</p>
              </div>
              <button onClick={() => { setShowVideoModal(false); onEnter(); }} className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                Begin Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const CloudSVG: React.FC<{ width: number; color: string }> = ({ width, color }) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 200 100">
    <g fill={color}>
      <ellipse cx="100" cy="70" rx="80" ry="30" />
      <ellipse cx="70" cy="55" rx="50" ry="40" />
      <ellipse cx="130" cy="60" rx="45" ry="35" />
      <ellipse cx="100" cy="50" rx="40" ry="30" />
    </g>
  </svg>
);

export default LandingPage;
