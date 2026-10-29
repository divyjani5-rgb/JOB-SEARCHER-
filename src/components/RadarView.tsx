import React, { useState, useMemo } from 'react';
import {
  Radar,
  MapPin,
  Search,
  Filter,
  Navigation,
  Sparkles,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Globe,
  SlidersHorizontal,
  Building,
  Video,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Job, UserProfile } from '../types';
import { formatSalary } from '../utils/jobMatching';
import { WORLDWIDE_METROS, METRO_REGIONS } from '../data/seedJobs';

interface RadarViewProps {
  jobs: Array<Job & { distance: number; matchScore: number }>;
  user: UserProfile;
  selectedCity: string;
  onCityChange: (cityName: string) => void;
  radiusMiles: number;
  onRadiusChange: (radius: number) => void;
  onDetectGPS: () => void;
  isDetectingGPS: boolean;
  onSelectJob: (job: Job & { distance: number; matchScore: number }) => void;
  onQuickApply: (job: Job & { distance: number; matchScore: number }) => void;
  onOpenScheduleMeet: (job: Job) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  jobs,
  user,
  selectedCity,
  onCityChange,
  radiusMiles,
  onRadiusChange,
  onDetectGPS,
  isDetectingGPS,
  onSelectJob,
  onQuickApply,
  onOpenScheduleMeet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'radar' | 'cards'>('radar');
  const [hoveredJob, setHoveredJob] = useState<(Job & { distance: number; matchScore: number }) | null>(null);

  // Filter jobs based on search term, employment type, and minimum match score
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        selectedType === 'All' ||
        job.type === selectedType ||
        (selectedType === 'Remote' && job.type === 'Remote');

      const matchesScore = job.matchScore >= minMatchScore;

      return matchesSearch && matchesType && matchesScore;
    });
  }, [jobs, searchTerm, selectedType, minMatchScore]);

  // Project coordinates for circular radar visualization
  const radarPoints = useMemo(() => {
    return filteredJobs.map((job) => {
      // Relative dx and dy from user coordinates
      const dy = (job.lat - user.lat) * 69; // ~69 miles per degree latitude
      const dx = (job.lng - user.lng) * 53; // ~53 miles per degree longitude in mid-latitudes
      const actualDist = Math.sqrt(dx * dx + dy * dy);

      // Normalize radius to radar circle percentage (max radius = radiusMiles)
      const rRatio = Math.min(0.9, Math.max(0.12, (job.distance || actualDist) / (radiusMiles || 25)));
      const angle = Math.atan2(dy, dx); // radians

      // Polar to cartesian inside a 100x100 viewBox with center at (50, 50)
      const cx = 50 + rRatio * 44 * Math.cos(angle);
      const cy = 50 - rRatio * 44 * Math.sin(angle); // invert Y for screen coords

      return {
        job,
        cx,
        cy,
        dist: Math.round((job.distance || actualDist) * 10) / 10,
      };
    });
  }, [filteredJobs, user.lat, user.lng, radiusMiles]);

  return (
    <div className="space-y-6">
      {/* Control Banner: City / Location & Radius Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Location & GPS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-700/80">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <label htmlFor="city-select" className="text-xs text-slate-400 font-medium mr-1">
                Global Metro:
              </label>
              <select
                id="city-select"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer max-w-[220px] sm:max-w-[280px]"
              >
                {METRO_REGIONS.map((region) => (
                  <optgroup key={region} label={`🌍 ${region}`} className="bg-slate-900 text-emerald-400 font-bold">
                    {WORLDWIDE_METROS.filter((m) => m.region === region).map((m) => (
                      <option key={m.name} value={m.name} className="bg-slate-900 text-white font-medium">
                        {m.name} ({m.currency})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <button
              onClick={onDetectGPS}
              disabled={isDetectingGPS}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              <span>{isDetectingGPS ? 'Detecting GPS...' : 'Use My Exact GPS'}</span>
            </button>
          </div>

          {/* Radius & View Mode Switch */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs">
              <span className="text-slate-400">Search Radius:</span>
              <span className="font-bold text-emerald-400 min-w-[50px]">{radiusMiles} miles</span>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={radiusMiles}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-24 sm:w-32 accent-emerald-500 cursor-pointer"
                aria-label="Search Radius in miles"
              />
            </div>

            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('radar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'radar'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                <span>Radar Scope</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Cards ({filteredJobs.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, company, or skill (e.g. React, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Work Type:</span>
            {['All', 'Full-time', 'Hybrid', 'Remote'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}

            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-800">
              <span className="text-slate-400">Min Match:</span>
              <select
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-emerald-300 px-2 py-1 rounded-lg focus:outline-none"
              >
                <option value={0}>Any Match</option>
                <option value={50}>50%+</option>
                <option value={75}>75%+</option>
                <option value={90}>90%+ Top</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Radar Layout */}
      {viewMode === 'radar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Circular Radar Scope */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-slate-200">Real-Time Proximity Radar</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> &gt;80% Match
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> 60-79%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> &lt;60%
                </span>
              </div>
            </div>

            {/* Radar Canvas / SVG Container */}
            <div className="relative w-full max-w-[480px] aspect-square rounded-full bg-radial from-slate-950 via-slate-950 to-slate-900 border-4 border-slate-800 shadow-inner flex items-center justify-center overflow-hidden my-2">
              {/* Rotating radar sweep beam */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0) 0deg, rgba(16, 185, 129, 0.22) 45deg, rgba(16, 185, 129, 0) 50deg)',
                  animation: 'spin 5s linear infinite',
                }}
              />

              {/* Concentric Range Rings */}
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 pointer-events-none">
                {/* Distance circle 1 */}
                <circle cx="50" cy="50" r="14" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 1" />
                {/* Distance circle 2 */}
                <circle cx="50" cy="50" r="28" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 1" />
                {/* Distance circle 3 (Outer edge) */}
                <circle cx="50" cy="50" r="44" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.6" />

                {/* Crosshairs */}
                <line x1="50" y1="4" x2="50" y2="96" stroke="#334155" strokeWidth="0.4" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="#334155" strokeWidth="0.4" />

                {/* Range labels */}
                <text x="51" y="37" fill="#64748b" fontSize="2.8" fontWeight="bold">
                  {Math.round(radiusMiles * 0.33)} mi
                </text>
                <text x="51" y="23" fill="#64748b" fontSize="2.8" fontWeight="bold">
                  {Math.round(radiusMiles * 0.66)} mi
                </text>
                <text x="51" y="8" fill="#10b981" fontSize="2.8" fontWeight="bold">
                  {radiusMiles} mi max
                </text>
              </svg>

              {/* Center User Pulse Icon */}
              <div className="absolute z-10 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute" />
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 mt-1 bg-slate-950/80 px-1 rounded shadow">
                  YOU
                </span>
              </div>

              {/* Job Blips on Radar */}
              {radarPoints.map(({ job, cx, cy, dist }) => {
                const isHighMatch = job.matchScore >= 80;
                const isMediumMatch = job.matchScore >= 60 && job.matchScore < 80;
                const blipColor = isHighMatch ? 'bg-emerald-400' : isMediumMatch ? 'bg-cyan-400' : 'bg-amber-400';
                const ringColor = isHighMatch ? 'border-emerald-500' : isMediumMatch ? 'border-cyan-500' : 'border-amber-500';

                return (
                  <div
                    key={job.id}
                    style={{ left: `${cx}%`, top: `${cy}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      onClick={() => onSelectJob(job)}
                      onMouseEnter={() => setHoveredJob(job)}
                      onMouseLeave={() => setHoveredJob(null)}
                      className={`relative flex items-center justify-center p-1 rounded-full transition-transform hover:scale-150 focus:outline-none`}
                      aria-label={`Job opening: ${job.title} at ${job.company}, ${dist} miles away`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${blipColor} shadow-md shadow-emerald-500/50 flex items-center justify-center border-2 border-slate-900`}>
                        {job.urgent && (
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        )}
                      </span>
                      <span className={`absolute -inset-1 rounded-full border ${ringColor} opacity-50 animate-pulse`} />
                    </button>

                    {/* Quick Hover Tooltip */}
                    <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-900/95 border border-slate-700 rounded-xl p-2.5 shadow-2xl z-30 pointer-events-none text-left">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
                        <span>{job.matchScore}% Match</span>
                        <span>{dist} mi</span>
                      </div>
                      <div className="font-semibold text-xs text-white line-clamp-1">{job.title}</div>
                      <div className="text-[11px] text-slate-300">{job.company}</div>
                      <div className="text-[10px] text-emerald-300/80 font-medium mt-1">
                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar Footer stats */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mt-2 px-2">
              <span>Scanning: <strong className="text-white">{filteredJobs.length} active openings</strong></span>
              <span>Center: <strong className="text-emerald-400">{selectedCity}</strong></span>
            </div>
          </div>

          {/* Right Column: Ranked Job List & Details */}
          <div className="lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1 px-1">
              <span>Ranked by Distance & Skills Match</span>
              <span className="text-emerald-400">{filteredJobs.length} results</span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <Radar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="font-medium text-white mb-1">No openings matched your filters</p>
                <p className="text-xs">Try increasing the radius slider or clearing the search terms.</p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isHovered = hoveredJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onMouseEnter={() => setHoveredJob(job)}
                    onMouseLeave={() => setHoveredJob(null)}
                    className={`bg-slate-900 border rounded-2xl p-4 transition-all duration-150 cursor-pointer ${
                      isHovered
                        ? 'border-emerald-500 bg-slate-850 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => onSelectJob(job)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-white group-hover:text-emerald-300">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <Flame className="w-2.5 h-2.5" /> Urgent
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.company}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{job.location}</span>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          <span>{job.matchScore}%</span>
                          <span className="text-[10px] font-normal text-emerald-300">Match</span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-400/90 mt-1 flex items-center justify-end gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>~{job.distance} mi</span>
                        </div>
                      </div>
                    </div>

                    {/* Salary & Type */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{job.type}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{job.postedDate}</span>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-slate-500 text-[10px]">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickApply(job);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                      >
                        1-Click Apply
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenScheduleMeet(job);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        title="Schedule Google Meet Interview"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Meet</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                        }}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        aria-label="View job details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Full Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {job.matchScore}% Skill Match
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    ~{job.distance} mi away
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mt-2 mb-1">{job.title}</h3>
                <p className="text-xs font-medium text-slate-300 mb-2">{job.company} · {job.location}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{job.description}</p>

                <div className="text-xs font-bold text-emerald-300 mb-3">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency)} · {job.type}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {job.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onQuickApply(job)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  Quick Apply
                </button>
                <button
                  onClick={() => onOpenScheduleMeet(job)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Meet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
