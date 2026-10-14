import mongoose, { Schema, Document, Model } from 'mongoose';

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
}

export interface IVerifiedSkillGaps {
  mastered: string[];
  needsImprovement: string[];
  missing: string[];
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

export interface IRoadmap extends Document {
  userEmail: string;
  targetRole: string;
  verifiedSkillGaps: IVerifiedSkillGaps;
  marketSkillFrequencies: IMarketSkillFrequency[];
  fastTrackCourse: IFastTrackCourse;
  recommendedCourses: IRecommendedCourse[];
  savedJobs: ISavedJob[];
  createdAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    via: { type: String, default: '' },
    applyLink: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    qualifications: { type: [String], default: [] },
    postedAt: { type: String, default: '' },
    salary: { type: String, default: '' },
  },
  { _id: false }
);

const FastTrackCourseSchema = new Schema<IFastTrackCourse>(
  {
    skill: { type: String, required: true },
    courseTitle: { type: String, required: true },
    provider: { type: String, required: true },
    url: { type: String, required: true },
    estimatedHours: { type: Number, default: 20 },
    hiringImpact: { type: String, default: 'High' },
    jobMatchesCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const RecommendedCourseSchema = new Schema<IRecommendedCourse>(
  {
    skill: { type: String, required: true },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    url: { type: String, required: true },
    level: { type: String, default: 'Intermediate' },
    estimatedHours: { type: Number, default: 15 },
  },
  { _id: false }
);

const MarketSkillFrequencySchema = new Schema<IMarketSkillFrequency>(
  {
    skill: { type: String, required: true },
    frequency: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userEmail: { type: String, required: true, index: true },
    targetRole: { type: String, required: true },
    verifiedSkillGaps: {
      mastered: { type: [String], default: [] },
      needsImprovement: { type: [String], default: [] },
      missing: { type: [String], default: [] },
    },
    marketSkillFrequencies: { type: [MarketSkillFrequencySchema], default: [] },
    fastTrackCourse: { type: FastTrackCourseSchema, required: true },
    recommendedCourses: { type: [RecommendedCourseSchema], default: [] },
    savedJobs: { type: [SavedJobSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Roadmap: Model<IRoadmap> =
  mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;
