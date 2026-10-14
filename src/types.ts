export interface ISkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface IProject {
  title: string;
  description: string;
  technologies?: string[];
}

export interface IUserProfile {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  education?: string;
  skills: ISkill[];
  experience?: string;
  projects?: IProject[];
  careerInterests?: string[];
  targetRole: string;
  country?: string;
  city?: string;
  jobTypePreference?: 'all' | 'onsite' | 'hybrid' | 'remote';
  rawResumeText?: string;
}

export interface ISavedJob {
  title: string;
  company: string;
  location: string;
  via?: string;
  applyLink: string;
  thumbnail?: string;
  qualifications: string[];
  postedAt?: string;
  salary?: string;
  workArrangement?: 'Onsite' | 'Hybrid' | 'Remote';
}

export interface IFastTrackCourse {
  skill: string;
  courseTitle: string;
  provider: string;
  url: string;
  estimatedHours: number;
  hiringImpact: string;
  jobMatchesCount: number;
}

export interface IRecommendedCourse {
  skill: string;
  title: string;
  provider: string;
  url: string;
  level: string;
  estimatedHours?: number;
}

export interface IMarketSkillFrequency {
  skill: string;
  frequency: number;
  percentage: number;
}

export interface IRoadmap {
  _id?: string;
  userEmail: string;
  targetRole: string;
  verifiedSkillGaps: {
    mastered: string[];
    needsImprovement: string[];
    missing: string[];
  };
  marketSkillFrequencies: IMarketSkillFrequency[];
  fastTrackCourse: IFastTrackCourse;
  recommendedCourses: IRecommendedCourse[];
  savedJobs: ISavedJob[];
  createdAt: string;
}

export interface INotification {
  _id: string;
  userEmail: string;
  type: 'job_alert' | 'course_cert';
  title: string;
  description: string;
  actionUrl: string;
  badge?: string;
  isRead: boolean;
  createdAt: string;
}
