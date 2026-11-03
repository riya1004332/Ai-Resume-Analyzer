import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800 text-sm">AI Resume Analyzer</span>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Advisory career intelligence
          </span>
          <Link to="/profile" className="hover:text-indigo-600 transition-colors">Privacy & Data Security</Link>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
        </div>
      </div>
    </footer>
  );
};

