import React from 'react';
import { Radar, X, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { JobNotification } from '../types';

interface NotificationToastProps {
  notification: JobNotification | null;
  onClose: () => void;
  onViewJob: (jobId: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onViewJob,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping" />
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Radar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Live Proximity Alert
            </span>
            <span className="text-[10px] text-slate-400 ml-1.5">{notification.timestamp}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5 rounded-lg focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5">
        <h4 className="font-bold text-sm text-white line-clamp-1">{notification.jobTitle}</h4>
        <div className="flex items-center justify-between text-xs text-slate-300 mt-0.5">
          <span>{notification.company}</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            ~{notification.distanceMiles} mi
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
          {notification.matchScore}% Skill Match
        </span>

        <button
          onClick={() => {
            onViewJob(notification.jobId);
            onClose();
          }}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow transition-colors"
        >
          <span>View Opening</span>
        </button>
      </div>
    </div>
  );
};
