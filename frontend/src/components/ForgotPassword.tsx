import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { forgotPassword } from '../api';
import { useToast } from './ToastContext';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSent(true);
      showToast('Password reset instructions sent!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to request password reset', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Login</span>
        </button>

        <div className="glass-card rounded-3xl p-8 shadow-xl border border-white/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Reset Password
            </h2>
            <p className="text-gray-500">
              {isSent 
                ? "Check your email for reset instructions." 
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/60 border border-white focus:bg-white rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-sky-500/30 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl">
                ✨
              </div>
              <button
                onClick={onBack}
                className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
