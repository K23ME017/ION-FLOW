import React, { useState } from 'react';
import {
  Bell,
  User,
  LogOut,
  CheckCircle,
  FileText,
  Zap,
  Briefcase,
  Compass,
  Layers,
  Menu,
  X,
  Compass as NavCompass,
} from 'lucide-react';
import { IUserProfile } from '../types';

interface NavbarProps {
  user: IUserProfile | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab: 'profile' | 'fast-track' | 'jobs' | 'timeline' | 'all';
  onSelectTab: (tab: 'profile' | 'fast-track' | 'jobs' | 'timeline' | 'all') => void;
  hasAnalyzed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenAuth,
  onLogout,
  activeTab,
  onSelectTab,
  hasAnalyzed,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'profile' as const,
      label: '1. Profile & Resume',
      icon: FileText,
      ready: true,
    },
    {
      id: 'fast-track' as const,
      label: '2. Market Gaps & Fast-Track',
      icon: Zap,
      ready: hasAnalyzed,
    },
    {
      id: 'jobs' as const,
      label: '3. Live Jobs',
      icon: Briefcase,
      ready: hasAnalyzed,
    },
    {
      id: 'timeline' as const,
      label: '4. Action Roadmap',
      icon: Compass,
      ready: hasAnalyzed,
    },
    {
      id: 'all' as const,
      label: 'All-in-One View',
      icon: Layers,
      ready: hasAnalyzed,
    },
  ];

  const handleNavClick = (tab: 'profile' | 'fast-track' | 'jobs' | 'timeline' | 'all') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-blue-700 transition-colors">
              <NavCompass className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                Career & Skill-Gap Navigator
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                Live Google Jobs Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Single Authoritative Stage Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.ready && item.id !== 'profile' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="Analyzed & Ready" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <>
              {/* Notifications */}
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                title="View Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Account Capsule */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[130px]">
                    {user.fullName || 'Candidate'}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none mt-1 truncate max-w-[130px]">
                    {user.targetRole || 'Developer'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Responsive Stage Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 animate-fade-in shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Workflow Stages
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2 px-3 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.ready && item.id !== 'profile' && (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    Ready
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
