import React, { useState } from 'react';
import { Globe, MapPin, Search, Sparkles, ExternalLink, Building2, RefreshCw } from 'lucide-react';
import { GroundingSource, GroundingPlace } from '../types';

interface GroundingSectionProps {
  currentCity: string;
  userLat: number;
  userLng: number;
}

export const GroundingSection: React.FC<GroundingSectionProps> = ({
  currentCity,
  userLat,
  userLng,
}) => {
  // Search Grounding state
  const [searchRole, setSearchRole] = useState('Full Stack Engineer');
  const [searchSummary, setSearchSummary] = useState('');
  const [searchSources, setSearchSources] = useState<GroundingSource[]>([]);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  // Maps Grounding state
  const [mapsIndustry, setMapsIndustry] = useState('tech and software companies');
  const [mapsSummary, setMapsSummary] = useState('');
  const [mapsPlaces, setMapsPlaces] = useState<GroundingPlace[]>([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);

  // Active sub-tab
  const [activeGroundingTab, setActiveGroundingTab] = useState<'search' | 'maps'>('search');

  // Trigger Google Search Grounding API
  const handleRunSearchGrounding = async () => {
    setIsSearchingWeb(true);
    try {
      const res = await fetch('/api/gemini/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: currentCity,
          role: searchRole,
        }),
      });
      const data = await res.json();
      setSearchSummary(data.summary || 'Search completed.');
      setSearchSources(data.groundingSources || []);
    } catch (err) {
      console.error('Error fetching search grounded data:', err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // Trigger Google Maps Grounding API
  const handleRunMapsGrounding = async () => {
    setIsLoadingMaps(true);
    try {
      const res = await fetch('/api/gemini/nearby-employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLat,
          longitude: userLng,
          city: currentCity,
          industry: mapsIndustry,
        }),
      });
      const data = await res.json();
      setMapsSummary(data.summary || 'Maps discovery completed.');
      setMapsPlaces(data.places || []);
    } catch (err) {
      console.error('Error fetching maps grounded data:', err);
    } finally {
      setIsLoadingMaps(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-base text-white">
              Live Grounded Intelligence for {currentCity}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded directly with real-time Google Search data and Google Maps location intelligence.
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveGroundingTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeGroundingTab === 'search'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Search Grounding</span>
          </button>
          <button
            onClick={() => setActiveGroundingTab('maps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeGroundingTab === 'maps'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps Grounding</span>
          </button>
        </div>
      </div>

      {/* 1. Google Search Grounding View */}
      {activeGroundingTab === 'search' && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Target Role to Search Live on the Web:
              </label>
              <input
                type="text"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                placeholder="e.g. React Developer, Data Scientist..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="self-end">
              <button
                onClick={handleRunSearchGrounding}
                disabled={isSearchingWeb}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSearchingWeb ? 'animate-spin' : ''}`} />
                <span>{isSearchingWeb ? 'Scanning Web...' : 'Fetch Live Openings'}</span>
              </button>
            </div>
          </div>

          {searchSummary && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Grounded Search Synthesis ({currentCity})</span>
              </div>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                {searchSummary}
              </div>

              {searchSources.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Verified Web Sources & Job Links:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 text-xs transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span className="max-w-[220px] truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Google Maps Grounding View */}
      {activeGroundingTab === 'maps' && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Local Sector / Business Hub to Locate:
              </label>
              <input
                type="text"
                value={mapsIndustry}
                onChange={(e) => setMapsIndustry(e.target.value)}
                placeholder="e.g. biotech labs, AI startups, aerospace..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="self-end">
              <button
                onClick={handleRunMapsGrounding}
                disabled={isLoadingMaps}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                <MapPin className={`w-3.5 h-3.5 ${isLoadingMaps ? 'animate-bounce' : ''}`} />
                <span>{isLoadingMaps ? 'Locating Hubs...' : 'Find Major Employers'}</span>
              </button>
            </div>
          </div>

          {mapsSummary && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Verified Employer Campuses & Hubs ({currentCity})</span>
              </div>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                {mapsSummary}
              </div>

              {mapsPlaces.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Google Maps Locations & Directions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {mapsPlaces.map((place, idx) => (
                      <a
                        key={idx}
                        href={place.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 hover:text-emerald-200 text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate font-medium">{place.title}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
