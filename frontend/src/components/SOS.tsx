import React, { useState } from 'react';
import { Phone, MapPin, MessageCircle, Shield, Heart, AlertTriangle, ExternalLink } from 'lucide-react';
import type { UserProfile } from '../types';
import AnimatedCompanion from './AnimatedCompanion';
import { useToast } from './ToastContext';

interface SOSProps {
  profile: UserProfile;
  onNavigate?: (page: any) => void;
}

const CRISIS_RESOURCES = [
  { name: 'National Suicide Prevention', number: '988', type: 'call', desc: '24/7 crisis support', emoji: '🆘', color: '#ef4444' },
  { name: 'Crisis Text Line', number: 'HOME to 741741', type: 'text', desc: 'Text-based support', emoji: '💬', color: '#0ea5e9' },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', type: 'call', desc: 'Mental health & substance use', emoji: '🏥', color: '#22c55e' },
  { name: 'The Trevor Project', number: '1-866-488-7386', type: 'call', desc: 'LGBTQ+ youth support', emoji: '🌈', color: '#f97316' },
];

const SELF_HELP = [
  { title: 'Box Breathing', desc: 'Inhale 4, hold 4, exhale 4, hold 4', emoji: '🫁' },
  { title: 'Ground Yourself', desc: 'Name 5 things you can see right now', emoji: '🌱' },
  { title: 'Safe Space', desc: 'Visualize your safest, calmest place', emoji: '🏡' },
  { title: 'Companion Comfort', desc: 'Let your companion be with you', emoji: '🤗' },
];

const SOS: React.FC<SOSProps> = ({ profile }) => {
  const { showToast } = useToast();
  const [alertSent, setAlertSent] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationDetails, setLocationDetails] = useState('');

  const handleShareLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationDetails(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setLocationShared(true);
          setIsLocating(false);
          showToast('Location fetched successfully', 'success');
        },
        (error) => {
          console.error(error);
          setIsLocating(false);
          showToast('Failed to get location. Please enable location services.', 'error');
        }
      );
    } else {
      setIsLocating(false);
      showToast('Geolocation is not supported by your browser', 'error');
    }
  };

  const handleAlertContact = () => {
    setIsAlerting(true);
    setTimeout(() => {
      setAlertSent(true);
      setIsAlerting(false);
      showToast('Emergency contact has been alerted', 'success');
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fce4ec 0%, #e8f5e9 50%, #e3f2fd 100%)' }}>
      <div className="lg:pl-56 xl:pl-64 min-h-screen pb-24 lg:pb-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>SOS Shield</h1>
              <p className="text-gray-500">You are safe. Help is here.</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Emergency Actions */}
              <div className="bento-card rounded-3xl overflow-hidden"
                style={{ background: 'rgba(254, 226, 226, 0.5)', border: '2px solid #fca5a5' }}>
                <div className="p-6 border-b border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Emergency Actions</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {/* Call 988 */}
                  <a href="tel:988"
                    className="flex items-center gap-5 p-5 rounded-2xl text-white transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 24px rgba(239,68,68,0.4)' }}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xl">Call 988</p>
                      <p className="text-sm opacity-90">Suicide & Crisis Lifeline — Free, 24/7</p>
                    </div>
                    <ExternalLink className="w-6 h-6 opacity-60" />
                  </a>

                  {/* Alert Contact */}
                  {profile.emergencyContacts.length > 0 ? (
                    <button onClick={handleAlertContact}
                      disabled={isAlerting || alertSent}
                      className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all ${
                        alertSent ? 'bg-green-100 border-2 border-green-400' : 'bg-white/80 hover:bg-white'
                      } ${isAlerting ? 'opacity-70' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${alertSent ? 'bg-green-200' : 'bg-red-100'}`}>
                        {alertSent ? (
                          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : isAlerting ? (
                          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <MessageCircle className="w-7 h-7 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-bold text-lg ${alertSent ? 'text-green-700' : 'text-gray-800'}`}>
                          {alertSent ? 'Alert Sent!' : isAlerting ? 'Sending Alert...' : `Alert ${profile.emergencyContacts[0].name}`}
                        </p>
                        <p className={`text-sm ${alertSent ? 'text-green-600' : 'text-gray-500'}`}>
                          {alertSent ? 'They know you need support.' : isAlerting ? 'Connecting to network...' : profile.emergencyContacts[0].phone}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                      <p className="text-sm text-amber-700 text-center">
                        No emergency contact saved.
                        <button className="font-bold underline ml-1" onClick={() => onNavigate?.('settings')}>Add one in Settings</button>
                      </p>
                    </div>
                  )}

                  {/* Share Location */}
                  <button onClick={handleShareLocation}
                    disabled={isLocating || locationShared}
                    className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all ${
                      locationShared ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white/80 hover:bg-white'
                    } ${isLocating ? 'opacity-70' : ''}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${locationShared ? 'bg-blue-200' : 'bg-sky-100'}`}>
                      {isLocating ? (
                        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MapPin className={`w-7 h-7 ${locationShared ? 'text-blue-600' : 'text-sky-500'}`} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-lg text-gray-800">{locationShared ? 'Location Shared' : isLocating ? 'Locating...' : 'Share My Location'}</p>
                      <p className="text-sm text-gray-500">
                        {locationShared ? `Active: ${locationDetails}` : isLocating ? 'Acquiring GPS signal...' : 'Send to emergency contacts'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Self-Help */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
                  <h3 className="font-bold text-gray-800 text-lg">Right Now, Try This</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {SELF_HELP.map(item => (
                    <button key={item.title}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 hover:bg-white/80 transition-all text-left">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Companion */}
              <div className="bento-card glass-card rounded-3xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <AnimatedCompanion
                    type={profile.companion}
                    mood="sad"
                    size="lg"
                    showSpeech
                    message={`${profile.name || 'Friend'}, I'm here. You are not alone.`}
                    interactive
                  />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Whatever you're going through, you matter. This feeling will pass.
                </p>
              </div>

              {/* Crisis Resources */}
              <div className="bento-card glass-card rounded-3xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Crisis Helplines</h3>
                <div className="space-y-3">
                  {CRISIS_RESOURCES.map(r => (
                    <a key={r.name}
                      href={r.type === 'call' ? `tel:${r.number.replace(/\D/g, '')}` : '#'}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-all">
                      <span className="text-2xl">{r.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: r.color }}>{r.number}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* You Matter */}
              <div className="bento-card rounded-3xl p-6 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(254,232,232,0.8), rgba(232,244,254,0.8))' }}>
                <div className="text-4xl mb-3">💙</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  You Matter
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your life has value. Reach out for help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOS;
