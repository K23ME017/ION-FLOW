import React, { useState } from 'react';
import { X, Briefcase, Award, CheckCircle2, ExternalLink, Bell } from 'lucide-react';
import { INotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: INotification[];
  onMarkAllRead: () => void;
  onMarkSingleRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkSingleRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'jobs' | 'certs'>('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'jobs') return n.type === 'job_alert';
    if (filter === 'certs') return n.type === 'course_cert';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notifications & Alerts</h2>
              <p className="text-xs text-slate-500">Live job openings & certification milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar and Mark All Read */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('jobs')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'jobs'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => setFilter('certs')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === 'certs'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Certs
            </button>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No alerts in this category</p>
              <p className="text-xs mt-1">
                Run a career analysis to trigger live job alerts and fast-track certification notices.
              </p>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item._id}
                className={`p-4 transition-colors ${
                  item.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/30 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                        item.type === 'job_alert'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {item.type === 'job_alert' ? (
                        <Briefcase className="w-4 h-4" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            item.type === 'job_alert'
                              ? 'bg-emerald-100/70 text-emerald-800'
                              : 'bg-purple-100/70 text-purple-800'
                          }`}
                        >
                          {item.badge || (item.type === 'job_alert' ? 'Job Alert' : 'Certification')}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        {item.actionUrl && item.actionUrl.startsWith('http') ? (
                          <a
                            href={item.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onMarkSingleRead(item._id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <a
                            href={item.actionUrl || '#'}
                            onClick={() => {
                              onMarkSingleRead(item._id);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            <span>View Details</span>
                          </a>
                        )}

                        {!item.isRead && (
                          <button
                            onClick={() => onMarkSingleRead(item._id)}
                            className="text-[11px] text-slate-400 hover:text-slate-600"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
