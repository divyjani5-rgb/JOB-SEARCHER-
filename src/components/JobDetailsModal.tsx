import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  DollarSign,
  Clock,
  CheckCircle2,
  Video,
  ExternalLink,
  Sparkles,
  Share2,
  Bookmark,
  Check,
  Flame,
  Send,
} from 'lucide-react';
import { Job } from '../types';
import { formatSalary } from '../utils/jobMatching';

interface JobDetailsModalProps {
  job: (Job & { distance: number; matchScore: number }) | null;
  onClose: () => void;
  userSkills: string[];
  onApply: (job: Job & { distance: number; matchScore: number }) => void;
  onOpenScheduleMeet: (job: Job) => void;
  hasApplied: boolean;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  userSkills,
  onApply,
  onOpenScheduleMeet,
  hasApplied,
}) => {
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [customCoverLetter, setCustomCoverLetter] = useState<string | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);

  if (!job) return null;

  const handleGenerateCoverLetter = async () => {
    setCoverLetterLoading(true);
    try {
      const res = await fetch('/api/gemini/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: `Skills: ${userSkills.join(', ')}`,
          jobTitle: job.title,
          companyName: job.company,
          jobDescription: job.description,
          tone: 'Direct, enthusiastic, and highly professional',
        }),
      });
      const data = await res.json();
      setCustomCoverLetter(data.coverLetter || '');
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (customCoverLetter) {
      navigator.clipboard.writeText(customCoverLetter);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
              {job.matchScore}% Skill Match
            </span>
            <span className="text-xs font-semibold text-emerald-300 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              ~{job.distance} miles away
            </span>
            {job.urgent && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-lg">
                <Flame className="w-3.5 h-3.5" /> Urgent Hiring
              </span>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-white">{job.title}</h2>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Building className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-white">{job.company}</span>
            <span className="text-slate-600">·</span>
            <span>{job.location} ({job.city})</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-emerald-300 pt-1">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{job.type}</span>
            </div>
          </div>
        </div>

        {/* Skill matching breakdown */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            Required Technical Competencies:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => {
              const isMatched = userSkills.some(
                (u) => u.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1 ${
                    isMatched
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {isMatched && <Check className="w-3 h-3 text-emerald-400" />}
                  <span>{skill}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Role Overview & Responsibilities
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* AI Cover Letter Generator preview */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                Generate Instant Cover Letter for this Role
              </span>
            </div>
            <button
              onClick={handleGenerateCoverLetter}
              disabled={coverLetterLoading}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${coverLetterLoading ? 'animate-spin' : ''}`} />
              <span>{coverLetterLoading ? 'Generating...' : 'Draft with Gemini'}</span>
            </button>
          </div>

          {customCoverLetter && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Personalized Draft:</span>
                <button
                  onClick={handleCopyCoverLetter}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  {copiedLetter ? <Check className="w-3 h-3" /> : null}
                  <span>{copiedLetter ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                </button>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto whitespace-pre-line">
                {customCoverLetter}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenScheduleMeet(job)}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Schedule Google Meet</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => onApply(job)}
              disabled={hasApplied}
              className={`py-2.5 px-6 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all ${
                hasApplied
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>1-Click Apply Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
