import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { RadarView } from './components/RadarView';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ApplicationsTracker } from './components/ApplicationsTracker';
import { InterviewsView } from './components/InterviewsView';
import { ProfileManagement } from './components/ProfileManagement';
import { GroundingSection } from './components/GroundingSection';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ScheduleMeetModal } from './components/ScheduleMeetModal';
import { NotificationToast } from './components/NotificationToast';

import {
  UserProfile,
  Job,
  Application,
  ScheduledInterview,
  JobNotification,
  ResumeData,
} from './types';
import {
  BASE_JOBS,
  CITIES,
  WORLDWIDE_METROS,
  generateNearbyJobsForLocation,
} from './data/seedJobs';
import { filterJobsByRadiusAndSkills } from './utils/jobMatching';
import { playNotificationChime } from './utils/audioChime';
import { initAuth, googleSignIn, logout } from './utils/firebaseAuth';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'radar' | 'resume' | 'applications' | 'interviews' | 'profile'
  >('radar');

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    id: 'user_1',
    name: 'Divy Jani',
    email: 'divyjani5@gmail.com',
    headline: 'Senior Full Stack & AI Systems Engineer',
    city: 'Austin, USA',
    state: 'USA',
    lat: 30.2672,
    lng: -97.7431,
    radiusMiles: 25,
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'Gemini API',
      'Tailwind CSS',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GraphQL',
    ],
    targetRoles: ['Senior Full Stack Engineer', 'AI Solutions Architect', 'Frontend Lead'],
    minSalary: 135000,
    isGoogleConnected: false,
    googleEmail: undefined,
    isLinkedInConnected: true,
    linkedInUrl: 'https://www.linkedin.com/in/divy-jani',
    linkedInHeadline: 'Full Stack & AI Engineer · Scaling High-Throughput Web Apps',
    realtimeAlertsEnabled: true,
    alertMinMatchScore: 80,
  });

  // Resume Data
  const [resume, setResume] = useState<ResumeData>({
    fullName: 'Divy Jani',
    email: 'divyjani5@gmail.com',
    phone: '+1 (512) 843-9201',
    location: 'Austin, TX (Open to Local & Hybrid)',
    summary:
      'Passionate Senior Full Stack Engineer with 6+ years designing real-time, high-performance web applications, multimodal AI workflows, and cloud-native microservices. Proven success leading architectural migrations, improving page performance by 45%, and crafting responsive user-centric products.',
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'Gemini API',
      'Tailwind CSS',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GraphQL',
    ],
    experiences: [
      {
        id: 'exp_1',
        role: 'Senior Full Stack Engineer',
        company: 'Vanguard Cloud Technologies',
        location: 'Austin, TX',
        period: '2023 - Present',
        highlights: [
          'Architected real-time WebSocket dashboard handling 120k concurrent telemetry events with zero latency degradation.',
          'Integrated Gemini multimodal models for automated document synthesis, saving 350+ operational hours monthly.',
          'Migrated monolithic frontend to modular Vite + React architecture, reducing bundle size by 42%.',
        ],
      },
      {
        id: 'exp_2',
        role: 'Full Stack Developer',
        company: 'Nexus Software Systems',
        location: 'San Francisco, CA (Remote)',
        period: '2021 - 2023',
        highlights: [
          'Engineered resilient REST and GraphQL APIs serving 3M active web and mobile users.',
          'Collaborated with design squads to establish strict accessibility (WCAG AA) standards across 50+ reusable components.',
        ],
      },
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Science',
        institution: 'University of Texas at Austin',
        year: '2020',
      },
    ],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Developer'],
  });

  // Applications Pipeline State
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app_1',
      jobId: 'job-1',
      jobTitle: 'Senior Full Stack Engineer',
      company: 'CloudScale Systems',
      location: 'Downtown (0.8 mi)',
      appliedDate: 'Yesterday',
      status: 'interviewing',
      matchScore: 95,
      notes: 'Initial technical phone screen passed. Moving to architecture interview via Google Meet.',
      resumeVersion: 'FullStack_ATS_v2.pdf',
    },
    {
      id: 'app_2',
      jobId: 'job-2',
      jobTitle: 'Frontend React Specialist',
      company: 'Fintech Velocity',
      location: 'Tech Corridor (3.4 mi)',
      appliedDate: '3 days ago',
      status: 'applied',
      matchScore: 90,
      notes: 'Applied with tailored cover letter highlighting high-frequency dashboard experience.',
      resumeVersion: 'FullStack_ATS_v2.pdf',
    },
  ]);

  // Scheduled Google Meet Interviews
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([
    {
      id: 'interview_1',
      jobTitle: 'Senior Full Stack Engineer',
      companyName: 'CloudScale Systems',
      scheduledTime: 'Tomorrow at 2:00 PM CST',
      meetUri: 'https://meet.google.com/qmv-ytpk-wdg',
      meetCode: 'qmv-ytpk-wdg',
      interviewerName: 'Sarah Chen, VP of Engineering',
      notes: 'System design deep dive and collaborative React architecture session.',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Real-Time Notifications State
  const [notifications, setNotifications] = useState<JobNotification[]>([
    {
      id: 'notif_1',
      jobId: 'job-1',
      jobTitle: 'Senior Full Stack Engineer',
      company: 'CloudScale Systems',
      location: 'Downtown Austin',
      distanceMiles: 0.8,
      matchScore: 95,
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif_2',
      jobId: 'job-2',
      jobTitle: 'Frontend React Specialist',
      company: 'Fintech Velocity',
      location: 'Austin Tech Corridor',
      distanceMiles: 3.4,
      matchScore: 90,
      timestamp: '32 mins ago',
      read: false,
    },
  ]);

  const [activeToast, setActiveToast] = useState<JobNotification | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<
    NotificationPermission | 'default'
  >(typeof Notification !== 'undefined' ? Notification.permission : 'default');

  // Modals & Selection
  const [selectedJob, setSelectedJob] = useState<
    (Job & { distance: number; matchScore: number }) | null
  >(null);
  const [isScheduleMeetOpen, setIsScheduleMeetOpen] = useState(false);
  const [scheduleMeetPrefill, setScheduleMeetPrefill] = useState<
    { title: string; company: string } | undefined
  >(undefined);

  // GPS State
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Initialize Firebase Google Auth listener on mount
  useEffect(() => {
    initAuth(
      (firebaseUser, token) => {
        setUser((prev) => ({
          ...prev,
          isGoogleConnected: true,
          googleEmail: firebaseUser.email || prev.email,
          name: firebaseUser.displayName || prev.name,
          photoUrl: firebaseUser.photoURL || undefined,
        }));
      },
      () => {
        // User logged out or unauthenticated
        setUser((prev) => ({
          ...prev,
          isGoogleConnected: false,
        }));
      }
    );
  }, []);

  // Request Desktop Notification Permission
  const handleRequestBrowserNotification = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setBrowserNotificationPermission(perm);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser((prev) => ({
          ...prev,
          isGoogleConnected: true,
          name: result.user.displayName || prev.name,
          email: result.user.email || prev.email,
          googleEmail: result.user.email || undefined,
          photoUrl: result.user.photoURL || undefined,
        }));
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logout();
    setUser((prev) => ({
      ...prev,
      isGoogleConnected: false,
      googleEmail: undefined,
    }));
  };

  // Find active metro configuration if matched
  const activeMetro = useMemo(() => {
    return WORLDWIDE_METROS.find(
      (m) => m.name === user.city || m.city === user.city || user.city.includes(m.city)
    );
  }, [user.city]);

  // Generate dynamic jobs list relative to user location and local currency
  const allRawJobs = useMemo(() => {
    const currency = activeMetro?.currency || '$';
    const salaryRange = activeMetro
      ? ([activeMetro.salaryMinBase, activeMetro.salaryMaxBase] as [number, number])
      : undefined;
    const dynamicLocal = generateNearbyJobsForLocation(
      user.lat,
      user.lng,
      user.city,
      currency,
      salaryRange
    );
    return dynamicLocal;
  }, [user.lat, user.lng, user.city, activeMetro]);

  // Compute distances & skill match scores using pure utility
  const rankedJobs = useMemo(() => {
    return filterJobsByRadiusAndSkills(
      allRawJobs,
      user.lat,
      user.lng,
      user.radiusMiles,
      user.skills,
      0
    );
  }, [allRawJobs, user.lat, user.lng, user.radiusMiles, user.skills]);

  // Change City to any Worldwide Metro
  const handleCityChange = (cityName: string) => {
    const found = WORLDWIDE_METROS.find(
      (c) => c.name === cityName || c.city === cityName
    );
    if (found) {
      setUser((prev) => ({
        ...prev,
        city: found.name,
        country: found.country,
        lat: found.lat,
        lng: found.lng,
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        city: cityName,
      }));
    }
  };

  // GPS Auto-Detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUser((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          city: `GPS Area (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
        }));
        setIsDetectingGPS(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setIsDetectingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Quick 1-Click Apply
  const handleQuickApply = (job: Job & { distance: number; matchScore: number }) => {
    if (applications.some((a) => a.jobId === job.id)) {
      return; // Already applied
    }

    const newApp: Application = {
      id: 'app_' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      appliedDate: 'Just now',
      status: 'applied',
      matchScore: job.matchScore,
      notes: `Applied with tailored ${user.headline} resume.`,
      resumeVersion: `${user.name.replace(/\s+/g, '_')}_Resume.pdf`,
    };

    setApplications((prev) => [newApp, ...prev]);

    // Show temporary feedback toast
    setActiveToast({
      id: 'applied_' + Date.now(),
      jobId: job.id,
      jobTitle: `Applied to ${job.title}!`,
      company: job.company,
      location: job.location,
      distanceMiles: job.distance,
      matchScore: job.matchScore,
      timestamp: 'Just now',
      read: true,
    });
  };

  // Real-Time Notification Trigger (Simulated or Push)
  const triggerNewJobAlert = useCallback(() => {
    const sampleTitles = [
      'Senior Cloud & React Architect',
      'AI Applications Lead',
      'Full Stack Software Engineer',
      'Frontend Solutions Specialist',
    ];
    const sampleCompanies = [
      'Apex Horizon Labs',
      'Beacon AI Technologies',
      'QuantumScale Systems',
      'Rivian Mobility Tech',
    ];

    const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const randomCompany = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];
    const randomDist = Math.round((Math.random() * 8 + 0.8) * 10) / 10;
    const randomScore = Math.floor(Math.random() * 12 + 88);

    const newAlert: JobNotification = {
      id: 'notif_' + Date.now(),
      jobId: 'local-job-1',
      jobTitle: randomTitle,
      company: randomCompany,
      location: `Near ${user.city}`,
      distanceMiles: randomDist,
      matchScore: randomScore,
      timestamp: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newAlert, ...prev]);
    setActiveToast(newAlert);

    if (isSoundEnabled) {
      playNotificationChime();
    }

    // Native browser notification
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted' &&
      document.hidden
    ) {
      new Notification(`New Opening in ${user.city}!`, {
        body: `${randomTitle} at ${randomCompany} (${randomDist} mi away · ${randomScore}% match)`,
        icon: '/favicon.ico',
      });
    }
  }, [user.city, isSoundEnabled]);

  // Periodic real-time alert polling simulation (every 45s if enabled)
  useEffect(() => {
    if (!user.realtimeAlertsEnabled) return;

    const interval = setInterval(() => {
      // Trigger subtle real-time notification
      triggerNewJobAlert();
    }, 45000);

    return () => clearInterval(interval);
  }, [user.realtimeAlertsEnabled, triggerNewJobAlert]);

  // Update Application Status
  const handleUpdateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  // Delete Application
  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Open Meet Scheduler for specific job
  const handleOpenScheduleMeetForJob = (job: { title: string; company: string }) => {
    setScheduleMeetPrefill({ title: job.title, company: job.company });
    setIsScheduleMeetOpen(true);
  };

  // Save profile skills when edited in Resume Builder
  const handleSaveProfileSkills = (newSkills: string[]) => {
    setUser((prev) => ({ ...prev, skills: newSkills }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        notifications={notifications}
        onMarkNotificationAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onClearAllNotifications={() => setNotifications([])}
        onSelectJobFromNotification={(jobId) => {
          const found = rankedJobs.find((j) => j.id === jobId) || rankedJobs[0];
          if (found) {
            setSelectedJob(found);
            setActiveTab('radar');
          }
        }}
        onTriggerTestAlert={triggerNewJobAlert}
        isSoundEnabled={isSoundEnabled}
        setIsSoundEnabled={setIsSoundEnabled}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        isSigningIn={isSigningIn}
      />

      {/* Main App Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Tab 1: Proximity Job Radar & Search */}
        {activeTab === 'radar' && (
          <div className="space-y-8">
            <RadarView
              jobs={rankedJobs}
              user={user}
              selectedCity={user.city}
              onCityChange={handleCityChange}
              radiusMiles={user.radiusMiles}
              onRadiusChange={(r) => setUser((prev) => ({ ...prev, radiusMiles: r }))}
              onDetectGPS={handleDetectGPS}
              isDetectingGPS={isDetectingGPS}
              onSelectJob={(j) => setSelectedJob(j)}
              onQuickApply={handleQuickApply}
              onOpenScheduleMeet={handleOpenScheduleMeetForJob}
            />

            {/* Grounding Intelligence Section (Google Search & Maps Grounding) */}
            <GroundingSection
              currentCity={user.city}
              userLat={user.lat}
              userLng={user.lng}
            />
          </div>
        )}

        {/* Tab 2: Resume Studio & Gemini ATS Audit */}
        {activeTab === 'resume' && (
          <ResumeBuilder
            resume={resume}
            setResume={setResume}
            user={user}
            setUser={setUser}
            onSaveProfileSkills={handleSaveProfileSkills}
          />
        )}

        {/* Tab 3: Applications Pipeline & Status Tracking */}
        {activeTab === 'applications' && (
          <ApplicationsTracker
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
            onDeleteApplication={handleDeleteApplication}
            onOpenScheduleMeet={handleOpenScheduleMeetForJob}
            onNavigateToMeetTab={() => setActiveTab('interviews')}
          />
        )}

        {/* Tab 4: Google Meet Interview Management */}
        {activeTab === 'interviews' && (
          <InterviewsView
            interviews={interviews}
            onOpenCreateModal={() => {
              setScheduleMeetPrefill(undefined);
              setIsScheduleMeetOpen(true);
            }}
            user={user}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        {/* Tab 5: Profile & Security Management */}
        {activeTab === 'profile' && (
          <ProfileManagement
            user={user}
            setUser={setUser}
            onGoogleSignIn={handleGoogleSignIn}
            onGoogleSignOut={handleGoogleSignOut}
            isSigningIn={isSigningIn}
            onRequestBrowserNotification={handleRequestBrowserNotification}
            browserNotificationPermission={browserNotificationPermission}
          />
        )}
      </main>

      {/* Floating Real-Time Notification Toast */}
      <NotificationToast
        notification={activeToast}
        onClose={() => setActiveToast(null)}
        onViewJob={(jobId) => {
          const found = rankedJobs.find((j) => j.id === jobId) || rankedJobs[0];
          if (found) {
            setSelectedJob(found);
            setActiveTab('radar');
          }
        }}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        userSkills={user.skills}
        onApply={handleQuickApply}
        onOpenScheduleMeet={(job) => {
          setSelectedJob(null);
          handleOpenScheduleMeetForJob(job);
        }}
        hasApplied={Boolean(selectedJob && applications.some((a) => a.jobId === selectedJob.id))}
      />

      {/* Schedule Google Meet Space Modal */}
      <ScheduleMeetModal
        isOpen={isScheduleMeetOpen}
        onClose={() => setIsScheduleMeetOpen(false)}
        prefillJob={scheduleMeetPrefill}
        onInterviewCreated={(newInterview) => {
          setInterviews((prev) => [newInterview, ...prev]);
        }}
      />
    </div>
  );
}
