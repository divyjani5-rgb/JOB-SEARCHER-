import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Building,
  UserCheck,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ScheduledInterview, UserProfile } from '../types';

interface InterviewsViewProps {
  interviews: ScheduledInterview[];
  onOpenCreateModal: () => void;
  user: UserProfile;
  onGoogleSignIn: () => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  interviews,
  onOpenCreateModal,
  user,
  onGoogleSignIn,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (uri: string, id: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Video className="w-5 h-5 text-emerald-400" />
            </span>
            <h1 className="text-xl font-bold text-white">Google Meet Interview Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate and manage live Google Meet interview spaces for technical screens, hiring manager discussions, and panel rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Google Meet Space</span>
          </button>
        </div>
      </div>

      {/* Google Account Connection Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <span>Google Workspace & Meet API Integration</span>
              {user.isGoogleConnected ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded font-medium border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Connected ({user.googleEmail || user.email})
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  Not Signed In
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Generates authenticated meeting rooms via <code className="text-emerald-300">meetings.space.created</code> with permission from app users.
            </p>
          </div>
        </div>

        {!user.isGoogleConnected && (
          <button
            onClick={onGoogleSignIn}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-sm shrink-0"
          >
            Connect Google Account
          </button>
        )}
      </div>

      {/* Scheduled Interviews Grid */}
      {interviews.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Video className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No Scheduled Meet Interviews</h3>
          <p className="text-xs max-w-md mx-auto">
            Schedule a mock interview practice space or link a real interview room with prospective employers.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Schedule Interview Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Video className="w-3.5 h-3.5" />
                    <span>Google Meet Confirmed</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.meetCode}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{item.jobTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.companyName}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{item.interviewerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{item.scheduledTime}</span>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 italic">
                    &quot;{item.notes}&quot;
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <a
                  href={item.meetUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>

                <button
                  onClick={() => handleCopyLink(item.meetUri, item.id)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  title="Copy meeting link"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Interview Prep Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Google Meet Interview Best Practices & Checklist</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400 block">1. Audio & Camera Setup</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ensure high-speed connection, test microphone gain, and position camera at eye level with front-facing light.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400 block">2. Tailored Projects Ready</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Have 2-3 specific architectural challenges from your resume open in tabs to share screen smoothly when asked.
            </p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400 block">3. Thoughtful Inquiry</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ask about current engineering sprint cadence, upcoming architectural migrations, and team autonomy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
