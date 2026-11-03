import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  GitCompare,
  TrendingUp,
  FileCheck2,
  Compass,
  Briefcase,
  CheckSquare,
  History,
  UserCheck
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Resume Analyzer', path: '/analyzer', icon: FileSearch },
    { label: 'Skill Gap Analyzer', path: '/skill-gap', icon: GitCompare },
    { label: 'Skill Improvement', path: '/skill-improvement', icon: TrendingUp },
    { label: 'Resume Improvement', path: '/resume-improvement', icon: FileCheck2 },
    { label: 'Career Guidance', path: '/career-guidance', icon: Compass },
    { label: 'Job Preparation', path: '/job-preparation', icon: Briefcase },
    { label: 'Progress Tracker', path: '/progress', icon: CheckSquare },
    { label: 'Analysis History', path: '/history', icon: History },
    { label: 'Profile & Settings', path: '/profile', icon: UserCheck }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/80 bg-white flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col flex-1 px-3 py-4 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-4 h-4', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/60 rounded-xl">
            <h4 className="text-xs font-bold text-indigo-900 mb-1">AI Career Advisor</h4>
            <p className="text-xs text-slate-500 mb-2">Powered by Google Gemini with ATS parsing intelligence.</p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

