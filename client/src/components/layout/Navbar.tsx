import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, User, Bell, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 text-slate-500 hover:text-slate-800 md:hidden rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 font-bold text-slate-900 text-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            ResumeAI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {user ? (
          <>
            <Link to="/analyzer">
              <Button size="sm" variant="primary" leftIcon={<FileText className="w-4 h-4" />}>
                Analyze Resume
              </Button>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-3 border-l border-slate-200 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-semibold text-xs">
                {user.email ? user.email.slice(0, 2).toUpperCase() : 'ME'}
              </div>
              <span className="hidden sm:inline-block max-w-[120px] truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

