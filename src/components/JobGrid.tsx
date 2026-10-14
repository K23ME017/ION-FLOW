import React from 'react';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Building2,
  Check,
  ShieldCheck,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { ISavedJob } from '../types';

interface JobGridProps {
  jobs: ISavedJob[];
  targetRole: string;
}

export const JobGrid: React.FC<JobGridProps> = ({ jobs, targetRole }) => {
  return (
    <div className="space-y-5 mb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Live Verified Job Opportunities
            </h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
              Live Google Jobs API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real employer postings matching {targetRole || 'your target role'} with direct application links.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{jobs.length} Openings Found</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center text-slate-500 shadow-xs space-y-3">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">No live jobs loaded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit your target role and location preference in Stage 1 to fetch verified job postings from Google Jobs.
            </p>
          </div>
        </div>
      ) : (
        /* Responsive Grid: 3 cols on xl, 2 on md, 1 on mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* 1. Employer & Logo */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {job.thumbnail ? (
                      <img
                        src={job.thumbnail}
                        alt={job.company}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-100 shrink-0">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 truncate max-w-[170px]">
                        {job.company}
                      </p>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {job.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* 2. Location & Work Arrangement */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      job.workArrangement === 'Remote'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : job.workArrangement === 'Hybrid'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {job.workArrangement || 'Onsite'}
                  </span>

                  <div className="flex items-center gap-1 font-medium text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[150px]">{job.location}</span>
                  </div>
                </div>

                {/* 3. Posting Date & Salary (Only when actually available) */}
                {(job.postedAt || job.salary) && (
                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-100 text-slate-500">
                    {job.postedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.postedAt}</span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Most Relevant Qualifications (Concise, not full description) */}
                {job.qualifications && job.qualifications.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Key Qualifications:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {job.qualifications.slice(0, 3).map((q, qIdx) => (
                        <li key={qIdx} className="flex items-start gap-1.5 leading-snug line-clamp-2">
                          <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 5. Footer: Board & Prominent Apply Button */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                  {job.via || 'Direct Portal'}
                </span>

                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
