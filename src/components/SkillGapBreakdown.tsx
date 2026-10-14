import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, ExternalLink, BookOpen, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { IRecommendedCourse } from '../types';

interface SkillGapBreakdownProps {
  verifiedGaps: {
    mastered: string[];
    needsImprovement: string[];
    missing: string[];
  };
  recommendedCourses: IRecommendedCourse[];
}

export const SkillGapBreakdown: React.FC<SkillGapBreakdownProps> = ({
  verifiedGaps,
  recommendedCourses,
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Visual Header with Verified vs AI Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Categorized Skill Gap Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-referenced against verified job requirements and accredited learning pathways.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified Market Grounding</span>
          </span>
          <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Recommendation</span>
          </span>
        </div>
      </div>

      {/* 3 Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Mastered */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Mastered Skills</h4>
                <p className="text-[11px] text-slate-500">Meets live job requirements</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] pt-1">
              {verifiedGaps.mastered.length === 0 ? (
                <span className="text-xs text-slate-400 italic">None identified yet</span>
              ) : (
                verifiedGaps.mastered.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/70"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
            ✓ Ready for technical interviews
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Needs Improvement</h4>
                <p className="text-[11px] text-slate-500">Foundational familiarity, upgrade needed</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] pt-1">
              {verifiedGaps.needsImprovement.length === 0 ? (
                <span className="text-xs text-slate-400 italic">All current skills are at market level</span>
              ) : (
                verifiedGaps.needsImprovement.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border border-amber-200/70"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
            ⚡ Refine with production projects
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Missing Critical Skills</h4>
                <p className="text-[11px] text-slate-500">Frequently listed in live postings</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] pt-1">
              {verifiedGaps.missing.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No missing critical skills</span>
              ) : (
                verifiedGaps.missing.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-800 rounded-lg border border-rose-200/70"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-rose-700 font-medium">
            🎯 Target these in Action Roadmap
          </div>
        </div>
      </div>

      {/* Recommended Bridge Courses */}
      {recommendedCourses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Curated Skill-Gap Bridge Courses
              </h4>
            </div>
            <span className="text-xs text-slate-500">
              Verified certifications from Google, Meta, IBM, AWS & DeepLearning.AI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recommendedCourses.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all group"
              >
                <div className="pr-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/50">
                      {c.skill}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">· {c.provider}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {c.title}
                  </h5>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{c.level}</span>
                    {c.estimatedHours && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{c.estimatedHours} hrs</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
                >
                  <span>View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
