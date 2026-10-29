import React, { useState } from 'react';
import {
  Video,
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { createGoogleMeetSpace, MeetSpace } from '../utils/meetService';
import { ScheduledInterview } from '../types';

interface ScheduleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillJob?: { title: string; company: string };
  onInterviewCreated: (interview: ScheduledInterview) => void;
}

export const ScheduleMeetModal: React.FC<ScheduleMeetModalProps> = ({
  isOpen,
  onClose,
  prefillJob,
  onInterviewCreated,
}) => {
  const [jobTitle, setJobTitle] = useState(prefillJob?.title || 'Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState(prefillJob?.company || 'CloudScale Systems');
  const [interviewerName, setInterviewerName] = useState('Sarah Chen, Head of Engineering');
  const [scheduledTime, setScheduledTime] = useState('Tomorrow at 2:00 PM CST');
  const [notes, setNotes] = useState('Technical architecture discussion, system design, and live problem solving');

  const [isCreating, setIsCreating] = useState(false);
  const [createdSpace, setCreatedSpace] = useState<MeetSpace | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const space = await createGoogleMeetSpace({
        jobTitle,
        companyName,
        interviewerName,
        scheduledTime,
        notes,
      });

      setCreatedSpace(space);

      // Notify parent to append to scheduled list
      onInterviewCreated({
        id: space.id,
        jobTitle: space.jobTitle,
        companyName: space.companyName,
        scheduledTime: space.scheduledTime,
        meetUri: space.meetingUri,
        meetCode: space.meetingCode,
        interviewerName: space.interviewerName,
        notes: space.notes,
        createdAt: space.createdAt,
      });
    } catch (err) {
      console.error('Failed to create Google Meet space:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (createdSpace?.meetingUri) {
      navigator.clipboard.writeText(createdSpace.meetingUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Schedule Google Meet Interview</h2>
            <p className="text-xs text-slate-400">Generate an authenticated Google Meet space for candidate discussion.</p>
          </div>
        </div>

        {createdSpace ? (
          <div className="space-y-4 py-2 animate-in zoom-in-95 duration-150">
            <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-sm">Google Meet Space Created!</h3>
              <p className="text-xs text-slate-300">
                Your video interview room is ready for <strong>{createdSpace.jobTitle}</strong> at <strong>{createdSpace.companyName}</strong>.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs mt-3">
                <div className="truncate mr-2 font-mono text-emerald-300">
                  {createdSpace.meetingUri}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 shrink-0 font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={createdSpace.meetingUri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Join Google Meet Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateMeet} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Interviewer Name / Lead</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Scheduled Date & Time</label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Interview Agenda / Topics</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                <Video className={`w-3.5 h-3.5 ${isCreating ? 'animate-spin' : ''}`} />
                <span>{isCreating ? 'Provisioning Meet Room...' : 'Create Meet Space'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
