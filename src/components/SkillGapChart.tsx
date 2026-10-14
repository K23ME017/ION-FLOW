import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { IMarketSkillFrequency, IUserProfile } from '../types';

interface SkillGapChartProps {
  marketSkills: IMarketSkillFrequency[];
  userProfile: IUserProfile;
  verifiedGaps: {
    mastered: string[];
    needsImprovement: string[];
    missing: string[];
  };
}

export const SkillGapChart: React.FC<SkillGapChartProps> = ({
  marketSkills,
  userProfile,
  verifiedGaps,
}) => {
  // Normalize user skills map
  const userMap = new Map<string, number>();
  for (const s of userProfile.skills) {
    let score = 50;
    if (s.proficiency === 'Advanced') score = 100;
    if (s.proficiency === 'Intermediate') score = 65;
    if (s.proficiency === 'Beginner') score = 30;
    userMap.set(s.name.toLowerCase().trim(), score);
  }

  // Prepare chart data (top 7 market requirements)
  const chartData = (marketSkills || []).slice(0, 7).map((item) => {
    const norm = item.skill.toLowerCase().trim();
    const userReadiness =
      userMap.get(norm) ??
      (verifiedGaps.mastered.some((m) => m.toLowerCase() === norm) ? 85 : 0);

    return {
      skill: item.skill,
      'Market Demand': Math.min(100, Math.round(item.percentage)),
      'Your Capability': Math.min(100, Math.round(userReadiness)),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
          <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 text-blue-300">
            <span>Market Demand:</span>
            <span className="font-mono font-bold">{payload[0]?.value}% of jobs</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-emerald-400">
            <span>Your Capability:</span>
            <span className="font-mono font-bold">{payload[1]?.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Market Requirements vs. Your Verified Skills
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis benchmarked against qualification frequencies from live Google Jobs postings.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
            <span>Market Demand (% of postings)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
            <span>Your Capability</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
            <BarChart3 className="w-8 h-8 text-slate-300" />
            <p className="font-semibold text-slate-600">No market skill frequencies calculated yet</p>
            <p>Run the career analysis above to populate comparative requirement data.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 8, right: 24, left: 20, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                type="category"
                dataKey="skill"
                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="Market Demand"
                fill="#2563eb"
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
              <Bar
                dataKey="Your Capability"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
