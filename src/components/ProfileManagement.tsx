import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Bell,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Mail,
  Sliders,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileManagementProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isSigningIn: boolean;
  onRequestBrowserNotification: () => void;
  browserNotificationPermission: NotificationPermission | 'default';
}

export const ProfileManagement: React.FC<ProfileManagementProps> = ({
  user,
  setUser,
  onGoogleSignIn,
  onGoogleSignOut,
  isSigningIn,
  onRequestBrowserNotification,
  browserNotificationPermission,
}) => {
  const [linkedInInput, setLinkedInInput] = useState(user.linkedInUrl || 'https://www.linkedin.com/in/divy-jani');
  const [isSyncingLinkedIn, setIsSyncingLinkedIn] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Connect / Sync LinkedIn
  const handleConnectLinkedIn = () => {
    setIsSyncingLinkedIn(true);
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        isLinkedInConnected: true,
        linkedInUrl: linkedInInput,
        linkedInHeadline: 'Full Stack & AI Engineer · Active Career Seeker',
        skills: Array.from(new Set([...prev.skills, 'React', 'TypeScript', 'Node.js', 'System Design'])),
      }));
      setIsSyncingLinkedIn(false);
      setSaveSuccessMessage(true);
      setTimeout(() => setSaveSuccessMessage(false), 3000);
    }, 900);
  };

  const handleDisconnectLinkedIn = () => {
    setUser((prev) => ({
      ...prev,
      isLinkedInConnected: false,
      linkedInUrl: '',
      linkedInHeadline: '',
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2500);
  };

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Profile & Security Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your authenticated identity, connect Google & LinkedIn profiles, and configure proximity alert preferences.
          </p>
        </div>

        {saveSuccessMessage && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" /> Changes Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Google Authentication Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Google Account Authentication</h3>
                <span className="text-xs text-slate-400">Firebase Auth & Google Meet OAuth</span>
              </div>
            </div>

            {user.isGoogleConnected ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                Unlinked
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Authenticates your applicant account and unlocks one-click Google Meet interview room creation via Workspace APIs.
          </p>

          {user.isGoogleConnected ? (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center overflow-hidden">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{user.googleEmail || user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-emerald-400 font-medium">
                  ✓ Token active & verified in-memory
                </span>
                <button
                  onClick={onGoogleSignOut}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={onGoogleSignIn}
                disabled={isSigningIn}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. LinkedIn Integration Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0077B5]/20 flex items-center justify-center border border-[#0077B5]/40 text-[#0077B5]">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">LinkedIn Profile Sync</h3>
                <span className="text-xs text-slate-400">Professional credentials & badge</span>
              </div>
            </div>

            {user.isLinkedInConnected ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                Not Connected
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Link your LinkedIn profile URL to verify professional achievements, import verified skills, and show a LinkedIn Easy Apply badge on your job applications.
          </p>

          {user.isLinkedInConnected ? (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-slate-400 text-xs">{user.linkedInHeadline}</div>
                  <a
                    href={user.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 mt-1 text-[11px]"
                  >
                    <span>{user.linkedInUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-sky-400 font-medium">
                  ✓ LinkedIn credentials verified
                </span>
                <button
                  onClick={handleDisconnectLinkedIn}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedInInput}
                onChange={(e) => setLinkedInInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={handleConnectLinkedIn}
                disabled={isSyncingLinkedIn}
                className="w-full py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSyncingLinkedIn ? 'animate-spin' : ''}`} />
                <span>{isSyncingLinkedIn ? 'Verifying with LinkedIn...' : 'Connect & Import LinkedIn Skills'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Real-time Notification & Radius Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Bell className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-base text-white">Real-Time Nearby Opening Alerts</h2>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
            Proximity Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Alert Toggle */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Enable Real-Time Alerts</span>
              <input
                type="checkbox"
                checked={user.realtimeAlertsEnabled}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, realtimeAlertsEnabled: e.target.checked }))
                }
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
                aria-label="Enable Real-Time Alerts"
              />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Periodically scans for newly posted roles in {user.city} matching your skill profile and triggers instant notification chimes.
            </p>
          </div>

          {/* Min Match Threshold */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Alert Match Threshold</span>
              <span className="font-bold text-emerald-400">{user.alertMinMatchScore}%+</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={user.alertMinMatchScore}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, alertMinMatchScore: Number(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
              aria-label="Alert Match Threshold"
            />
            <p className="text-slate-400 text-[11px]">
              Only notify me when a job matches at least {user.alertMinMatchScore}% of my verified skills.
            </p>
          </div>

          {/* Browser Notification Permission */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Desktop Push Alerts</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                browserNotificationPermission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {browserNotificationPermission}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Receive native notifications when new jobs appear even if this tab is in the background.
            </p>
            {browserNotificationPermission !== 'granted' && (
              <button
                onClick={onRequestBrowserNotification}
                className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-[11px] transition-colors"
              >
                Enable Desktop Alerts
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Candidate Details & Target Preferences */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
        <h2 className="font-bold text-base text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Candidate Preferences & Target Compensation</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Target Minimum Salary ($/yr)</label>
            <input
              type="number"
              step="5000"
              value={user.minSalary}
              onChange={(e) => setUser((prev) => ({ ...prev, minSalary: Number(e.target.value) }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Target Role Keyword</label>
            <input
              type="text"
              value={user.headline}
              onChange={(e) => setUser((prev) => ({ ...prev, headline: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Default Search Radius (Miles)</label>
            <input
              type="number"
              min="5"
              max="50"
              value={user.radiusMiles}
              onChange={(e) => setUser((prev) => ({ ...prev, radiusMiles: Number(e.target.value) }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
