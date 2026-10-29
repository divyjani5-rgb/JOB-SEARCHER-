export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  headline: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  radiusMiles: number;
  skills: string[];
  targetRoles: string[];
  minSalary: number;
  isGoogleConnected: boolean;
  googleEmail?: string;
  isLinkedInConnected: boolean;
  linkedInUrl?: string;
  linkedInHeadline?: string;
  realtimeAlertsEnabled: boolean;
  alertMinMatchScore: number;
}

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
  matchScore?: number;
  companyLogo?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interviewing' | 'offered' | 'rejected';
  matchScore: number;
  notes: string;
  resumeVersion: string;
  coverLetter?: string;
  meetInterviewId?: string;
}

export interface ScheduledInterview {
  id: string;
  jobTitle: string;
  companyName: string;
  scheduledTime: string;
  meetUri: string;
  meetCode: string;
  interviewerName: string;
  notes: string;
  createdAt: string;
}

export interface JobNotification {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  distanceMiles: number;
  matchScore: number;
  timestamp: string;
  read: boolean;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
}

export interface AtsAnalysisResult {
  atsScore: number;
  verdict: 'High Match' | 'Moderate Match' | 'Needs Optimization';
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvementSuggestions: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingPlace {
  title: string;
  uri: string;
}
