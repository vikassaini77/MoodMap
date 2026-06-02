import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import type { CompanionType } from '../types';
import { COMPANIONS } from '../types';
import { useToast } from './ToastContext';
import { login, forgotPassword } from '../api';

interface LoginProps {
  onLogin: (user: any) => void;
  onCreateAccount: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCreateAccount, onBack }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const companionTypes: CompanionType[] = ['panda', 'fox', 'bunny', 'otter', 'cat', 'penguin', 'shiba'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const { login } = await import('../api');
      const data = await login(email, password);
      if (data.token) localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false);
      // In real app, this would redirect to OAuth
      showToast(`Redirecting to ${provider} OAuth...`, 'info');
    }, 1000);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showToast('Please enter your email to reset password', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      await forgotPassword(email);
      showToast('Password reset instructions sent to your email!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to request password reset', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 flex">
      {/* Left Side - Branding & Companion Preview */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                fontSize: `${16 + Math.random() * 24}px`,
                opacity: 0.4,
              }}
            >
              {['🌸', '⭐', '🍃', '💫', '🦋'][i % 5]}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              MoodMap X
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Your Emotional Wellness Companion</p>
          </div>

          {/* Floating Companions */}
          <div className="flex justify-center gap-6 mb-8">
            {companionTypes.slice(0, 5).map((type, i) => (
              <div
                key={type}
                className="text-5xl animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {COMPANIONS[type].emoji}
              </div>
            ))}
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { emoji: '🧠', title: 'Mood Tracking', desc: 'Understand your emotions' },
              { emoji: '🌿', title: 'Wellness', desc: 'Build healthy habits' },
              { emoji: '💝', title: 'Companionship', desc: 'Never feel alone' },
            ].map((item, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white/60 backdrop-blur-sm">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">Sign in to continue your wellness journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all bg-white"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all bg-white"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-200"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/60 text-sm text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </button>
          </div>

          {/* Create Account Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onCreateAccount}
                className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                Create one now
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-gray-400 leading-relaxed">
            By signing in, you agree to our{' '}
            <button className="text-gray-500 hover:text-sky-600 underline transition-colors" onClick={() => showToast('Terms of Service: Prioritize your mental well-being!', 'info')}>Terms of Service</button>
            <span className="mx-1">&bull;</span>
            <button className="text-gray-500 hover:text-sky-600 underline transition-colors" onClick={() => showToast('Privacy Policy: Your data is secure and completely private.', 'info')}>Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
