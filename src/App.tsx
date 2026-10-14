/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Briefcase,
  Zap,
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
  Bell,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers,
  Building2,
  MapPin,
  Globe,
  Award,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ResumeUploadBanner } from './components/ResumeUploadBanner';
import { ProfileEditor } from './components/ProfileEditor';
import { FastTrackSpotlight } from './components/FastTrackSpotlight';
import { SkillGapChart } from './components/SkillGapChart';
import { SkillGapBreakdown } from './components/SkillGapBreakdown';
import { JobGrid } from './components/JobGrid';
import { ActionTimeline } from './components/ActionTimeline';
import { MarketIntelligenceCard } from './components/MarketIntelligenceCard';
import { IUserProfile, IRoadmap, INotification } from './types';

type ActiveTab = 'profile' | 'fast-track' | 'jobs' | 'timeline' | 'all';

const DEFAULT_DEMO_USER: IUserProfile = {
  _id: 'demo-user-1',
  fullName: 'Alex Rivera',
  email: 'demo.candidate@career-nav.ai',
  education: 'B.S. in Computer Science • UC Berkeley (2023)',
  targetRole: 'Full Stack Engineer',
  country: 'United States',
  city: 'San Francisco',
  jobTypePreference: 'onsite',
  skills: [
    { name: 'JavaScript', proficiency: 'Advanced' },
    { name: 'React', proficiency: 'Advanced' },
    { name: 'HTML5', proficiency: 'Advanced' },
    { name: 'CSS3', proficiency: 'Advanced' },
    { name: 'Node.js', proficiency: 'Intermediate' },
    { name: 'Git', proficiency: 'Intermediate' },
    { name: 'REST APIs', proficiency: 'Intermediate' },
  ],
  experience: '2 years building web apps and distributed interfaces at early stage tech startups.',
  careerInterests: ['High Scale Frontend', 'Full Stack TypeScript', 'Cloud Architecture'],
};

export default function App() {
  // Authentication & User State
  const [user, setUser] = useState<IUserProfile | null>(() => {
    const saved = localStorage.getItem('career_nav_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_USER;
      }
    }
    return DEFAULT_DEMO_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Active stage tab: Defaults strictly to 'profile'
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  // Candidate Profile State
  const [profile, setProfile] = useState<IUserProfile>(() => {
    const base = user || DEFAULT_DEMO_USER;
    return {
      fullName: base.fullName || 'Alex Rivera',
      email: base.email || 'demo.candidate@career-nav.ai',
      education: base.education || 'B.S. in Computer Science • UC Berkeley (2023)',
      targetRole: base.targetRole || 'Full Stack Engineer',
      country: base.country || 'United States',
      city: base.city || 'San Francisco',
      jobTypePreference: base.jobTypePreference || 'onsite',
      skills: base.skills && base.skills.length > 0 ? base.skills : DEFAULT_DEMO_USER.skills,
      experience: base.experience || DEFAULT_DEMO_USER.experience,
      careerInterests: base.careerInterests || DEFAULT_DEMO_USER.careerInterests,
    };
  });

  // Roadmap & Market Analysis State
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync profile when authenticated user changes
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        education: user.education || prev.education,
        targetRole: user.targetRole || prev.targetRole,
        country: user.country || prev.country,
        city: user.city || prev.city,
        jobTypePreference: user.jobTypePreference || prev.jobTypePreference,
        skills: user.skills && user.skills.length > 0 ? user.skills : prev.skills,
        experience: user.experience || prev.experience,
        careerInterests: user.careerInterests || prev.careerInterests,
      }));

      fetchNotifications(user.email);
      fetchLatestRoadmap(user.email);
    }
  }, [user?.email]);

  // Initial auto-load of roadmap if none exists yet
  useEffect(() => {
    const activeEmail = user?.email || profile.email || DEFAULT_DEMO_USER.email;
    fetchNotifications(activeEmail);
    fetchLatestRoadmap(activeEmail);

    const timer = setTimeout(() => {
      setRoadmap((current) => {
        if (!current) {
          runCareerAnalysis(false);
        }
        return current;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const fetchNotifications = async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.warn('Could not fetch notifications:', e);
    }
  };

  const fetchLatestRoadmap = async (email: string) => {
    if (!email) return;
    try {
      const res = await fetch(`/api/roadmaps/latest?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (e) {
      console.warn('Could not load roadmap:', e);
    }
  };

  // Run Career & Skill-Gap Analysis for Onsite / Local Jobs
  const runCareerAnalysis = async (moveToNextTab = true) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const activeEmail = profile.email || user?.email || DEFAULT_DEMO_USER.email;
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, email: activeEmail }),
      });

      const res = await fetch('/api/analyze-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: profile.targetRole || 'Full Stack Engineer',
          skills: profile.skills,
          email: activeEmail,
          country: profile.country || 'United States',
          city: profile.city || '',
          jobType: profile.jobTypePreference || 'onsite',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze career data');
      }

      setRoadmap(data.roadmap);
      fetchNotifications(activeEmail);

      if (moveToNextTab) {
        setActiveTab('fast-track');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Career analysis error:', err);
      setAnalysisError(err.message || 'Analysis temporarily unavailable. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAuthSuccess = (authUser: IUserProfile, existingRoadmap?: IRoadmap) => {
    setUser(authUser);
    localStorage.setItem('career_nav_user', JSON.stringify(authUser));
    if (existingRoadmap) {
      setRoadmap(existingRoadmap);
    } else {
      runCareerAnalysis(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('career_nav_user');
    setUser(null);
    setProfile({
      fullName: 'Guest Candidate',
      email: 'guest@career-nav.ai',
      education: 'Self-Directed Software Engineering',
      targetRole: 'Full Stack Developer',
      country: 'United States',
      city: '',
      jobTypePreference: 'onsite',
      skills: [
        { name: 'JavaScript', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Intermediate' },
      ],
      experience: '',
      careerInterests: ['Full Stack Development'],
    });
  };

  const handleMarkAllRead = async () => {
    const activeEmail = user?.email || profile.email;
    if (!activeEmail) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeEmail }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    const activeEmail = user?.email || profile.email;
    if (!activeEmail) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeEmail, notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Single Unified Navigation Header */}
      <Navbar
        user={user}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasAnalyzed={!!roadmap}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        {analysisError && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">Notice:</span>
              <span>{analysisError}</span>
            </div>
            <button
              onClick={() => setAnalysisError(null)}
              className="px-2 py-1 rounded-md bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}
        {/* ======================================================== */}
        {/* STAGE 1: PROFILE & RESUME */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <section className="space-y-6">
            {/* Stage 1 Welcome Hero */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md w-fit border border-blue-200/60">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Stage 1 of 4 · Candidate Profile & Resume</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {profile.fullName || 'Candidate'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upload your CV in <strong>PDF, Word, or Image</strong> format to auto-extract your skills using Google AI Studio.
                  Configure your target role and location to benchmark your qualifications against live job listings.
                </p>
              </div>

              {/* Location Badge */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 shrink-0 text-xs space-y-1.5 min-w-[210px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Search Location Filter</span>
                </div>
                <p className="text-slate-600 font-medium">
                  {profile.city ? `${profile.city}, ` : ''}{profile.country || 'United States'}
                </p>
                <div className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {profile.jobTypePreference === 'onsite'
                    ? 'Physical In-Office / Onsite'
                    : profile.jobTypePreference === 'hybrid'
                    ? 'Hybrid Arrangement'
                    : profile.jobTypePreference === 'remote'
                    ? 'Remote Arrangement'
                    : 'All Arrangements'}
                </div>
              </div>
            </div>

            {/* Instant Resume Upload Banner */}
            <ResumeUploadBanner
              onParsed={(parsed) => {
                setProfile((prev) => ({
                  ...prev,
                  fullName: parsed.fullName || prev.fullName,
                  targetRole: parsed.targetRole || prev.targetRole,
                  education: parsed.education || prev.education,
                  skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : prev.skills,
                  experience: parsed.experience || prev.experience,
                }));
              }}
            />

            {/* Candidate Profile & Skill Editor */}
            <ProfileEditor
              profile={profile}
              onChange={setProfile}
              onAnalyze={() => runCareerAnalysis(true)}
              isAnalyzing={isAnalyzing}
            />

            {/* Stage 1 Footer Progression CTA */}
            <div className="p-6 rounded-2xl bg-white border border-blue-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ready to benchmark qualifications against live jobs?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Targeting: <strong className="text-blue-700">{profile.targetRole}</strong> in {profile.country || 'your area'} with {profile.skills.length} technical skills.
                </p>
              </div>

              <button
                type="button"
                onClick={() => runCareerAnalysis(true)}
                disabled={isAnalyzing}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span>Analyzing Live Jobs...</span>
                ) : (
                  <>
                    <span>Proceed to Stage 2: Market Gaps</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: MARKET GAPS & FAST-TRACK */}
        {/* ======================================================== */}
        {activeTab === 'fast-track' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    Stage 2 · Market Gap Analysis & Fast-Track
                  </h2>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    Verified Requirements vs. AI Recommendations
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated against employer qualifications for <strong>{profile.targetRole}</strong> in {profile.country || 'your country'}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => runCareerAnalysis(false)}
                disabled={isAnalyzing}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>Re-Analyze Market</span>
              </button>
            </div>

            {roadmap ? (
              <>
                <FastTrackSpotlight
                  course={roadmap.fastTrackCourse}
                  targetRole={roadmap.targetRole}
                />

                <SkillGapChart
                  marketSkills={roadmap.marketSkillFrequencies}
                  userProfile={profile}
                  verifiedGaps={roadmap.verifiedSkillGaps}
                />

                <SkillGapBreakdown
                  verifiedGaps={roadmap.verifiedSkillGaps}
                  recommendedCourses={roadmap.recommendedCourses}
                />

                <MarketIntelligenceCard targetRole={profile.targetRole} />

                {/* Stage 2 Footer Progression CTA */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Explore Live Openings in Your Area
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View {roadmap.savedJobs?.length || 0} verified employer job postings with direct application links.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('jobs');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Proceed to Stage 3: Live Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 shadow-xs space-y-3">
                <Zap className="w-10 h-10 mx-auto text-amber-500" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">Analysis not generated yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Run the career gap analysis to view live market gaps and fast-track recommendations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => runCareerAnalysis(false)}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Gap Analysis Now'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: LIVE JOBS */}
        {/* ======================================================== */}
        {activeTab === 'jobs' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Stage 3 · Live Job Opportunities
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified listings in {profile.country || 'your country'} from Google Jobs with direct employer portals.
                </p>
              </div>
            </div>

            {roadmap ? (
              <>
                <JobGrid jobs={roadmap.savedJobs} targetRole={roadmap.targetRole} />

                {/* Stage 3 Footer Progression CTA */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Ready to build your career progression roadmap?
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Synthesize qualifications into a 4-step actionable timeline to bridge your skills into job readiness.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('timeline');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Proceed to Stage 4: Action Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 shadow-xs space-y-3">
                <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-800 text-sm">No live jobs loaded yet</h4>
                <button
                  type="button"
                  onClick={() => runCareerAnalysis(false)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
                >
                  Fetch Live Jobs
                </button>
              </div>
            )}
          </section>
        )}

        {/* ======================================================== */}
        {/* STAGE 4: ACTION ROADMAP */}
        {/* ======================================================== */}
        {activeTab === 'timeline' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Stage 4 · Action Plan Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological milestones bridging your verified skill gaps into offer readiness.
                </p>
              </div>
            </div>

            {roadmap ? (
              <>
                <ActionTimeline roadmap={roadmap} />

                {/* Stage 4 Footer Progression CTA */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      View the Complete Executive Summary
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review all 4 stages combined in the All-in-One Executive Dashboard for hackathon evaluation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>View All-in-One Executive View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 shadow-xs space-y-3">
                <Compass className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="font-bold text-slate-800 text-sm">Roadmap timeline not generated</h4>
                <button
                  type="button"
                  onClick={() => runCareerAnalysis(false)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl"
                >
                  Generate Roadmap
                </button>
              </div>
            )}
          </section>
        )}

        {/* ======================================================== */}
        {/* ALL-IN-ONE VIEW: EXECUTIVE DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'all' && (
          <section className="space-y-8 animate-fade-in">
            {/* Executive Overview Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                      All-in-One Executive Dashboard
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      · Complete Hackathon Overview
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Candidate Profile & Career Navigation Summary
                  </h1>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => runCareerAnalysis(false)}
                    disabled={isAnalyzing}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Refresh Data</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-semibold block">Target Role</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 truncate block mt-0.5">
                    {profile.targetRole || 'Full Stack Developer'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {profile.city ? `${profile.city}, ` : ''}{profile.country || 'USA'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-semibold block">Verified Skills</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 truncate block mt-0.5">
                    {profile.skills.length} Technical Skills
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    Extracted from CV
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-semibold block">#1 Fast-Track Deficit</span>
                  <span className="text-sm sm:text-base font-bold text-blue-700 truncate block mt-0.5">
                    {roadmap?.fastTrackCourse?.skill || 'Analysis Pending'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {roadmap?.fastTrackCourse?.hiringImpact || 'High leverage'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-semibold block">Live Job Matches</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 truncate block mt-0.5">
                    {roadmap?.savedJobs?.length || 0} Openings
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Google Jobs Grounded
                  </span>
                </div>
              </div>

              {/* Quick Jump Anchor Links */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-slate-400 text-[11px]">Jump to Section:</span>
                <a
                  href="#overview-profile"
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  1. Candidate Profile
                </a>
                <a
                  href="#overview-gaps"
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  2. Market Gaps & Fast-Track
                </a>
                <a
                  href="#overview-jobs"
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  3. Live Job Openings
                </a>
                <a
                  href="#overview-roadmap"
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  4. Action Roadmap
                </a>
              </div>
            </div>

            {/* Section 1: Candidate Profile & Credentials */}
            <div id="overview-profile" className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Candidate Profile & Credentials
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit in Stage 1</span>
                </button>
              </div>

              {/* Compact Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block">Candidate</span>
                    <span className="font-bold text-slate-900 text-sm">{profile.fullName || 'Candidate'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block">Target Career</span>
                    <span className="font-bold text-slate-900 text-sm">{profile.targetRole}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block">Education</span>
                    <span className="font-semibold text-slate-800">{profile.education || 'Not specified'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">
                    Verified Skills ({profile.skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-medium"
                      >
                        <span>{s.name}</span>
                        <span
                          className={`text-[9px] px-1 rounded font-semibold ${
                            s.proficiency === 'Advanced'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.proficiency === 'Intermediate'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.proficiency}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {profile.experience && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                      Experience Highlights:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {profile.experience}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Market Gaps & Fast-Track */}
            <div id="overview-gaps" className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Market Gaps & Fast-Track Pathway
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('fast-track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Detailed Stage 2 View →</span>
                </button>
              </div>

              {roadmap ? (
                <>
                  <FastTrackSpotlight
                    course={roadmap.fastTrackCourse}
                    targetRole={roadmap.targetRole}
                  />
                  <SkillGapChart
                    marketSkills={roadmap.marketSkillFrequencies}
                    userProfile={profile}
                    verifiedGaps={roadmap.verifiedSkillGaps}
                  />
                  <SkillGapBreakdown
                    verifiedGaps={roadmap.verifiedSkillGaps}
                    recommendedCourses={roadmap.recommendedCourses}
                  />
                </>
              ) : (
                <div className="p-6 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  Analysis not loaded yet.
                </div>
              )}
            </div>

            {/* Section 3: Live Job Openings */}
            <div id="overview-jobs" className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Live Verified Job Opportunities
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('jobs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Stage 3 Job Board →</span>
                </button>
              </div>

              {roadmap ? (
                <JobGrid jobs={roadmap.savedJobs} targetRole={roadmap.targetRole} />
              ) : (
                <div className="p-6 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  No live jobs loaded yet.
                </div>
              )}
            </div>

            {/* Section 4: Action Roadmap */}
            <div id="overview-roadmap" className="space-y-4 pt-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Action Roadmap & Milestone Progression
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('timeline');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Stage 4 Timeline →</span>
                </button>
              </div>

              {roadmap ? (
                <ActionTimeline roadmap={roadmap} />
              ) : (
                <div className="p-6 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  Roadmap not generated yet.
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              C
            </div>
            <span className="font-bold text-slate-900">
              Career and Skill-Gap Navigator
            </span>
            <span className="text-slate-400">· University Hackathon Edition</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => {
                setActiveTab('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              1. Profile & Resume
            </button>
            <button
              onClick={() => {
                setActiveTab('fast-track');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              2. Market Gaps
            </button>
            <button
              onClick={() => {
                setActiveTab('jobs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              3. Live Jobs
            </button>
            <button
              onClick={() => {
                setActiveTab('timeline');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors"
            >
              4. Action Roadmap
            </button>
            <button
              onClick={() => {
                setActiveTab('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-blue-600 transition-colors font-bold text-blue-600"
            >
              All-in-One View
            </button>
          </div>
        </div>
      </footer>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkSingleRead={handleMarkSingleRead}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
