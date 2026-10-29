/**
 * Pure utility functions for job matching, distance calculations, and notifications
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  distanceMiles?: number;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  skills: string[];
  description: string;
  postedDate: string;
  source: 'direct' | 'google_search' | 'linkedin' | 'verified_partner';
  url?: string;
  urgent?: boolean;
}

/**
 * Calculates Haversine distance between two coordinates in miles
 */
export function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Normalizes a skill string for comparison (lowercase, trimmed, no punctuation)
 */
export function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/[#+.]/g, (char) => (char === '#' ? 'sharp' : char === '+' ? 'plus' : ''))
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates match percentage between candidate skills and required job skills
 */
export function calculateSkillMatchScore(
  userSkills: string[],
  jobSkills: string[]
): number {
  if (!jobSkills || jobSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedUserSkills = new Set(userSkills.map(normalizeSkill));
  let matchedCount = 0;

  for (const skill of jobSkills) {
    const norm = normalizeSkill(skill);
    if (normalizedUserSkills.has(norm)) {
      matchedCount++;
    } else {
      // Check partial match (e.g. 'react native' vs 'react')
      for (const uSkill of normalizedUserSkills) {
        if (norm.includes(uSkill) || uSkill.includes(norm)) {
          matchedCount += 0.75;
          break;
        }
      }
    }
  }

  const score = Math.round((matchedCount / jobSkills.length) * 100);
  return Math.min(100, Math.max(0, score));
}

/**
 * Filters jobs by location radius and minimum skill match threshold
 */
export function filterJobsByRadiusAndSkills(
  jobs: Job[],
  userLat: number,
  userLon: number,
  radiusMiles: number,
  skills: string[],
  minMatchScore: number = 0
): Array<Job & { matchScore: number; distance: number }> {
  return jobs
    .map((job) => {
      const distance = calculateDistanceMiles(userLat, userLon, job.lat, job.lng);
      const matchScore = calculateSkillMatchScore(skills, job.skills);
      return {
        ...job,
        distance,
        distanceMiles: distance,
        matchScore,
      };
    })
    .filter((job) => {
      const withinRadius = job.distance <= radiusMiles || job.type === 'Remote';
      const meetsScore = job.matchScore >= minMatchScore;
      return withinRadius && meetsScore;
    })
    .sort((a, b) => {
      // Sort primarily by match score, secondarily by distance
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.distance - b.distance;
    });
}

/**
 * Formats salary range into a human-friendly string
 */
export function formatSalary(min: number, max: number, currency: string = '$'): string {
  if (min === 0 && max === 0) return 'Competitive';
  const formatVal = (val: number) => {
    if (val >= 1000000) {
      const m = (val / 1000000).toFixed(1).replace('.0', '');
      return `${currency}${m}M`;
    }
    if (val >= 1000) {
      return `${currency}${Math.round(val / 1000)}k`;
    }
    return `${currency}${val}`;
  };
  return `${formatVal(min)} - ${formatVal(max)} / yr`;
}
