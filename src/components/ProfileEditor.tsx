import React, { useState } from 'react';
import {
  Plus,
  X,
  Briefcase,
  GraduationCap,
  Code2,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  MapPin,
  Building2,
  Globe,
  User,
  Sliders,
  AlignLeft,
} from 'lucide-react';
import { IUserProfile, ISkill } from '../types';

interface ProfileEditorProps {
  profile: IUserProfile;
  onChange: (updated: IUserProfile) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const POPULAR_SKILLS = [
  'TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL',
  'Docker', 'AWS', 'Python', 'Tailwind CSS', 'GraphQL', 'MongoDB', 'Git'
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onChange,
  onAnalyze,
  isAnalyzing,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const handleAddSkill = (nameToAdd?: string) => {
    const targetName = (nameToAdd || newSkillName).trim();
    if (!targetName) return;

    if (profile.skills.some((s) => s.name.toLowerCase() === targetName.toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const updatedSkills: ISkill[] = [
      ...profile.skills,
      { name: targetName, proficiency: newSkillProficiency },
    ];

    onChange({ ...profile, skills: updatedSkills });
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    const updated = profile.skills.filter((_, i) => i !== index);
    onChange({ ...profile, skills: updated });
  };

  const handleProficiencyChange = (index: number, newProf: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const updated = profile.skills.map((s, i) => (i === index ? { ...s, proficiency: newProf } : s));
    onChange({ ...profile, skills: updated });
  };

  const currentCountry = profile.country || 'United States';
  const currentCity = profile.city || '';
  const currentArrangement = profile.jobTypePreference || 'onsite';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-7">
      {/* Header and Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Candidate Profile & Target Qualifications</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review and adjust your credentials. Click below to analyze your skills against verified live job market postings.
          </p>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing || !profile.targetRole.trim()}
          className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Market Gaps...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Market Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Section 1: Candidate & Target Role Credentials */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>1. Personal & Target Career Credentials</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Full Name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => onChange({ ...profile, fullName: e.target.value })}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Career Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => onChange({ ...profile, targetRole: e.target.value })}
                placeholder="e.g. Full Stack Developer, DevOps..."
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Education & Degrees
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={profile.education || ''}
                onChange={(e) => onChange({ ...profile, education: e.target.value })}
                placeholder="e.g. B.S. in Computer Science • UC Berkeley"
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Location and Work Preference */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800">
              Target Location & Arrangement Filter
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Searches live employer positions matching your chosen country and work mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Country
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={currentCountry}
                onChange={(e) => onChange({ ...profile, country: e.target.value })}
                placeholder="United States, Canada, Germany..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              City / Metro Region (Optional)
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={currentCity}
                onChange={(e) => onChange({ ...profile, city: e.target.value })}
                placeholder="e.g. San Francisco, Austin, London..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Work Arrangement Preference
            </label>
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/70 rounded-lg text-[10px] font-bold">
              {[
                { id: 'onsite', label: 'Onsite' },
                { id: 'hybrid', label: 'Hybrid' },
                { id: 'remote', label: 'Remote' },
                { id: 'all', label: 'All' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...profile,
                      jobTypePreference: item.id as any,
                    })
                  }
                  className={`py-1 rounded-md transition-all ${
                    currentArrangement === item.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Technical Skills Management */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800">
              Current Technical Skills ({profile.skills.length})
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Click Beg / Int / Adv buttons on any chip to change your proficiency level
          </span>
        </div>

        {/* Existing skill chips */}
        <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 min-h-[85px] items-start">
          {profile.skills.length === 0 ? (
            <div className="m-auto text-center py-3 text-xs text-slate-400">
              No technical skills recorded yet. Add skills below or upload your resume above.
            </div>
          ) : (
            profile.skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs hover:border-slate-300 transition-colors"
              >
                <span className="font-semibold text-slate-800">{skill.name}</span>

                {/* Proficiency toggle buttons */}
                <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-[10px]">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => {
                    const isCurrent = skill.proficiency === level;
                    let activeStyle = 'bg-blue-600 text-white font-bold';
                    if (level === 'Beginner') activeStyle = 'bg-amber-600 text-white font-bold';
                    if (level === 'Advanced') activeStyle = 'bg-emerald-600 text-white font-bold';

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleProficiencyChange(index, level)}
                        className={`px-1.5 py-0.5 rounded transition-all ${
                          isCurrent
                            ? activeStyle
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title={`Set ${skill.name} to ${level}`}
                      >
                        {level.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Skill Adder Input */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add new technical skill (e.g. Kubernetes, Redis, Rust)..."
            className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />

          <select
            value={newSkillProficiency}
            onChange={(e) => setNewSkillProficiency(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            type="button"
            onClick={() => handleAddSkill()}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Popular suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">Quick Add:</span>
          {POPULAR_SKILLS.filter(
            (ps) => !profile.skills.some((s) => s.name.toLowerCase() === ps.toLowerCase())
          )
            .slice(0, 8)
            .map((ps) => (
              <button
                key={ps}
                type="button"
                onClick={() => handleAddSkill(ps)}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors"
              >
                + {ps}
              </button>
            ))}
        </div>
      </div>

      {/* Section 4: Work Experience Highlights */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Work Experience Highlights</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Formatted bullet points extracted from your resume
          </span>
        </div>

        <textarea
          rows={4}
          value={profile.experience || ''}
          onChange={(e) => onChange({ ...profile, experience: e.target.value })}
          placeholder="• Built scalable client portals using React and TypeScript...&#10;• Designed RESTful microservices in Node.js connected to PostgreSQL...&#10;• Implemented automated CI/CD unit testing pipelines with GitHub Actions..."
          className="w-full p-3.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
