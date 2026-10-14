import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface IProject {
  title: string;
  description: string;
  technologies?: string[];
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash?: string;
  education?: string;
  skills: ISkill[];
  experience?: string;
  projects?: IProject[];
  careerInterests?: string[];
  targetRole: string;
  rawResumeText?: string;
  resumeParsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String },
    education: { type: String, default: '' },
    skills: { type: [SkillSchema], default: [] },
    experience: { type: String, default: '' },
    projects: { type: [ProjectSchema], default: [] },
    careerInterests: { type: [String], default: [] },
    targetRole: { type: String, required: true, default: 'Full Stack Developer' },
    rawResumeText: { type: String, default: '' },
    resumeParsedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in hot-reload environments
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
