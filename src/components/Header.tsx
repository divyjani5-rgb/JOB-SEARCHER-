import React, { useState } from 'react';
import {
  Radar,
  Bell,
  FileText,
  Briefcase,
  Video,
  User as UserIcon,
  MapPin,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  CheckCircle2,
  X,
  PlusCircle,
} from 'lucide-react';
import { UserProfile, JobNotification } from '../types';

interface HeaderProps {
  activeTab: 'radar' | 'resume' | 'applications' | 'interviews' | 'profile';
  setActiveTab: (tab: 'radar' | 'resume' | 'applications' | 'interviews' | 'profile') => void;
  user: UserProfile;
  notifications: JobNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onSelectJobFromNotification: (jobId: string) => void;
  onTriggerTestAlert: () => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (val: boolean) => void;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isSigningIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onSelectJobFromNotification,
  onTriggerTestAlert,
  isSoundEnabled,
  setIsSoundEnabled,
  onGoogleSignIn,
  onGoogleSignOut,
  isSigningIn,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('radar')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <span className="absolute inset-0 bg-emerald-500/10 animate-ping rounded-full pointer-events-none" />
                  <Radar className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    OpportunityRadar
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400 gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-none">{user.city || 'Detecting Area...'}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400/90 font-medium">Within {user.radiusMiles} mi</span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'radar'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>Jobs & Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'resume'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume & AI ATS</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'applications'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('interviews')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'interviews'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Video className="w-4 h-4 text-emerald-300" />
              <span>Google Meet</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Action Tools & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              title={isSoundEnabled ? 'Alert Chime: Enabled' : 'Alert Chime: Muted'}
              className="p-2 rounded-lg bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60"
              aria-label="Toggle sound alerts"
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Test Alert Simulator Button */}
            <button
              onClick={onTriggerTestAlert}
              title="Simulate real-time nearby job alert"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Alert</span>
            </button>

            {/* Real-time Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700/60 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-3 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">Live Job Radar Alerts</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {notifications.length > 0 && (
                        <button
                          onClick={onClearAllNotifications}
                          className="text-slate-400 hover:text-white hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto mt-2 space-y-2 divide-y divide-slate-800/50">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs">
                        <Radar className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                        No alerts yet. Radar is scanning your area within {user.radiusMiles} miles.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`pt-2 p-2 rounded-xl transition-colors cursor-pointer ${
                            item.read ? 'bg-slate-900/60 opacity-70' : 'bg-slate-800/70 border border-emerald-500/20'
                          }`}
                          onClick={() => {
                            onMarkNotificationAsRead(item.id);
                            onSelectJobFromNotification(item.jobId);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-medium text-xs text-white line-clamp-1">{item.jobTitle}</div>
                            <span className="text-[10px] font-semibold text-emerald-400 shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {item.matchScore}% Match
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5 flex items-center justify-between">
                            <span>{item.company}</span>
                            <span className="text-emerald-400 font-medium">~{item.distanceMiles} mi away</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                            <span>{item.location}</span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Button: Real Google Sign In with official GSI layout from skill */}
            {user.isGoogleConnected ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center overflow-hidden">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0) || 'U'
                    )}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                disabled={isSigningIn}
                className="gsi-material-button relative inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white text-slate-800 font-medium text-xs hover:bg-slate-100 shadow-sm transition-all border border-slate-300 disabled:opacity-50"
              >
                <div className="gsi-material-button-icon mr-2">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <span>{isSigningIn ? 'Connecting...' : 'Sign in'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800/80 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'radar' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Radar</span>
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'resume' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'applications' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Tracker</span>
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'interviews' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Meet</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
