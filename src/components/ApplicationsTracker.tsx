import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Clock,
  Video,
  ChevronRight,
  ExternalLink,
  Trash2,
  Calendar,
  AlertCircle,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Application, Job } from '../types';

interface ApplicationsTrackerProps {
  applications: Application[];
  onUpdateStatus: (id: string, status: Application['status']) => void;
  onDeleteApplication: (id: string) => void;
  onOpenScheduleMeet: (job: { title: string; company: string }) => void;
  onNavigateToMeetTab: () => void;
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onOpenScheduleMeet,
  onNavigateToMeetTab,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">Applied</span>;
      case 'screening':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">Screening</span>;
      case 'interviewing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Interviewing</span>;
      case 'offered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">Offer Extended</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">Archived</span>;
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header & Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Application Pipeline & Tracker</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track submitted applications, update candidate milestones, and schedule Google Meet interview panels.
          </p>
        </div>

        {/* Quick count pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl border font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilterStatus('applied')}
            className={`px-3 py-1.5 rounded-xl border font-medium transition-colors ${
              filterStatus === 'applied'
                ? 'bg-blue-600 text-white border-blue-500 shadow'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Applied ({applications.filter((a) => a.status === 'applied').length})
          </button>
          <button
            onClick={() => setFilterStatus('interviewing')}
            className={`px-3 py-1.5 rounded-xl border font-medium transition-colors ${
              filterStatus === 'interviewing'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Interviewing ({applications.filter((a) => a.status === 'interviewing').length})
          </button>
          <button
            onClick={() => setFilterStatus('offered')}
            className={`px-3 py-1.5 rounded-xl border font-medium transition-colors ${
              filterStatus === 'offered'
                ? 'bg-amber-600 text-white border-amber-500 shadow'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Offers ({applications.filter((a) => a.status === 'offered').length})
          </button>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-white text-base">No Applications in this View</h3>
          <p className="text-xs max-w-md mx-auto">
            Discover nearby opportunities on the Proximity Radar and apply with 1-click to track them here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-white">{app.jobTitle}</h3>
                  {getStatusBadge(app.status)}
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {app.matchScore}% Match
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.company}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{app.location}</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Applied {app.appliedDate}</span>
                  </span>
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-400 mt-1 italic">&quot;{app.notes}&quot;</p>
                )}
              </div>

              {/* Action Controls & Stage Changer */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <label htmlFor={`status-${app.id}`} className="text-slate-500 pl-2 pr-1 font-medium text-[11px]">
                    Stage:
                  </label>
                  <select
                    id={`status-${app.id}`}
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as Application['status'])}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="applied" className="bg-slate-900">Applied</option>
                    <option value="screening" className="bg-slate-900">Screening</option>
                    <option value="interviewing" className="bg-slate-900">Interviewing</option>
                    <option value="offered" className="bg-slate-900">Offer Extended</option>
                    <option value="rejected" className="bg-slate-900">Archived</option>
                  </select>
                </div>

                {/* Google Meet Schedule / Join Button */}
                <button
                  onClick={() => {
                    onOpenScheduleMeet({ title: app.jobTitle, company: app.company });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  title="Schedule or launch Google Meet video interview"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Meet</span>
                </button>

                <button
                  onClick={() => onDeleteApplication(app.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Application"
                  aria-label="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
