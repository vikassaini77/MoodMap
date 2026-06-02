import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center animate-bounce_soft">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Oops! Something went wrong
              </h1>
              <p className="text-gray-500 mb-6">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {/* Error Details (collapsible) */}
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 justify-center">
                  <Bug className="w-4 h-4" />
                  View technical details
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-xl overflow-auto">
                  <p className="text-xs font-mono text-red-600 break-all">
                    {this.state.error?.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
                <button
                  onClick={this.handleRefresh}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>

              {/* Help Text */}
              <p className="mt-6 text-xs text-gray-400">
                If this problem persists, please contact support at{' '}
                <a href="mailto:support@moodmapx.app" className="text-sky-500 hover:underline">
                  support@moodmapx.app
                </a>
              </p>
            </div>

            {/* Floating decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute animate-float text-2xl opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                >
                  {['🍂', '💫', '🌟', '🌸', '☁️'][i % 5]}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
