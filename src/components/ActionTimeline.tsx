import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Award,
  Code,
  Send,
  BookOpen,
  ExternalLink,
  Check,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { IRoadmap } from '../types';

interface ActionTimelineProps {
  roadmap: IRoadmap;
}

export const ActionTimeline: React.FC<ActionTimelineProps> = ({ roadmap }) => {
  const storageKey = `roadmap_progress_${roadmap.userEmail || 'default'}_${roadmap.targetRole}`;

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    } catch {
      // ignore
    }
  }, [completedSteps, storageKey]);

  const toggleStep = (stepIdx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx],
    }));
  };

  const fastTrackSkill = roadmap.fastTrackCourse?.skill || 'Primary Skill';
  const secondarySkills = (roadmap.verifiedSkillGaps?.missing || [])
    .filter((s) => s.toLowerCase() !== fastTrackSkill.toLowerCase())
    .slice(0, 2);

  const steps = [
    {
      title: `Complete Fast-Track Certification: ${fastTrackSkill}`,
      type: 'verified' as const,
      badgeLabel: 'Verified Requirement',
      timeEstimate: 'Weeks 1 – 3',
      description: `Target the single missing qualification unlocking ${roadmap.fastTrackCourse?.hiringImpact || 'key positions'}. Complete the accredited ${roadmap.fastTrackCourse?.provider || 'verified provider'} curriculum.`,
      icon: Award,
      actionText: 'Open Course Syllabus',
      actionUrl: roadmap.fastTrackCourse?.url,
    },
    {
      title: `Solidify Secondary Qualifications: ${
        secondarySkills.length > 0 ? secondarySkills.join(' & ') : 'Cloud & Microservices'
      }`,
      type: 'verified' as const,
      badgeLabel: 'Verified Requirement',
      timeEstimate: 'Weeks 4 – 6',
      description: `Close secondary gaps cited across live job postings to eliminate automated filtering flags during ATS resume screenings.`,
      icon: BookOpen,
      actionText: 'Review Gap Details',
      actionUrl: '#fast-track',
    },
    {
      title: `Build Portfolio Capstone Demonstrating ${fastTrackSkill} in Production`,
      type: 'ai' as const,
      badgeLabel: 'AI Recommendation',
      timeEstimate: 'Weeks 7 – 8',
      description: `Construct an end-to-end repository synthesizing your mastered skills with ${fastTrackSkill}. Include automated tests, containerization, and clean documentation.`,
      icon: Code,
      actionText: 'Review Profile Skills',
      actionUrl: '#profile',
    },
    {
      title: `Deploy Verified Applications to ${roadmap.targetRole} Openings`,
      type: 'verified' as const,
      badgeLabel: 'Verified Requirement',
      timeEstimate: 'Week 9 & Beyond',
      description: `Apply directly to verified employer listings from Google Jobs using your updated resume credentials and capstone proof points.`,
      icon: Send,
      actionText: 'View Verified Job Links',
      actionUrl: '#jobs',
    },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs mb-8 transition-all space-y-6">
      {/* Header and Progress Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Action Roadmap & Career Progression
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step milestones bridging your verified qualifications into job offer readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified Requirement</span>
          </span>
          <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Recommendation</span>
          </span>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700">Milestone Completion Progress</span>
          <span className="text-slate-900 tabular-nums">
            {completedCount} of {steps.length} milestones finished ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Vertical Progression Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 ml-3 my-2">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          const Icon = step.icon;

          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Marker */}
              <button
                type="button"
                onClick={() => toggleStep(idx)}
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400 hover:border-blue-600 hover:text-blue-600'
                }`}
                title={isDone ? 'Mark as Incomplete' : 'Mark Milestone Complete'}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5" />}
              </button>

              {/* Milestone Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-slate-50/80 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        step.type === 'verified'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      }`}
                    >
                      {step.badgeLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{step.timeEstimate}</span>
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    Step {idx + 1} of {steps.length}
                  </span>
                </div>

                {/* Title & Description */}
                <h4
                  className={`text-sm font-bold text-slate-900 leading-snug mb-1.5 ${
                    isDone ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {step.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-4">
                  {step.description}
                </p>

                {/* Actions Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStep(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </button>

                  {step.actionUrl && (
                    <a
                      href={step.actionUrl}
                      target={step.actionUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>{step.actionText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
