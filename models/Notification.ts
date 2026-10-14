import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userEmail: string;
  type: 'job_alert' | 'course_cert';
  title: string;
  description: string;
  actionUrl: string;
  badge?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userEmail: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['job_alert', 'course_cert'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    actionUrl: { type: String, required: true },
    badge: { type: String, default: 'New' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
