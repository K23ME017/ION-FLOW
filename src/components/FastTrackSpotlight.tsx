import React from 'react';
import { Zap, ExternalLink, Clock, TrendingUp, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import { IFastTrackCourse } from '../types';

interface FastTrackSpotlightProps {
  course: IFastTrackCourse;
  targetRole: string;
}

export const FastTrackSpotlight: React.FC<FastTrackSpotlightProps> = ({ course, targetRole }) => {
  return (
    <div className="bg-white rounded-2xl border border-blue-200/90 p-6 sm:p-7 shadow-xs mb-8 transition-all">
      {/* Top Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>#1 Highest Hiring Impact</span>
          </span>
          <span className="text-xs font-semibold text-slate-500">
            · Verified Market Grounded
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Derived from Live Google Jobs Listings</span>
        </div>
      </div>

      {/* Main Grid: Explanation vs Course Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left Column: Analysis & Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-blue-600">
              Primary Skill Gap for {targetRole}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Master {course.skill} to Unlock Qualified Positions
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Based on qualifications extracted across live employer job postings, <strong className="text-slate-900">{course.skill}</strong> appears
            as the single most frequent requirement currently missing from your profile. Bridging this specific deficit
            yields the highest statistical boost in ATS screening and interview invitation rates.
          </p>

          {/* Structured Metrics Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-slate-700">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{course.hiringImpact}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-slate-700">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>~{course.estimatedHours} hrs estimated effort</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-slate-700">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Provider: {course.provider}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Recommendation Card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/90 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md inline-block mb-2">
              Recommended Fast-Track Course
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {course.courseTitle}
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Curated syllabus from {course.provider} with hands-on projects and recognized certification.
            </p>
          </div>

          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Enroll / View Certification</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
