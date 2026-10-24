import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, UploadCloud, UserCircle } from 'lucide-react';

export type NavTab = 'dashboard' | 'predictor' | 'districts' | 'diagnostics' | 'register';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onQuickUploadClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onQuickUploadClick }) => {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            AgriYield AI
          </span>
        </button>

        {/* Zone 2: 4–5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('predictor')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'predictor'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Yield Predictor (CSV)
          </button>

          <button
            onClick={() => setActiveTab('districts')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'districts'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            District Statistics
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'diagnostics'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Research Plots & Ablation
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'register'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            {currentUser ? 'User Profile' : 'Register / Login'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('predictor');
              if (onQuickUploadClick) onQuickUploadClick();
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setActiveTab('register')}
              className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors rounded-lg"
              title={`${currentUser.name} (${currentUser.role})`}
              aria-label="User Account"
            >
              <UserCircle className="w-6 h-6" />
            </button>
          )}
        </div>

      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('predictor')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'predictor' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Predictor (CSV)
        </button>
        <button
          onClick={() => setActiveTab('districts')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'districts' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Districts
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'diagnostics' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Research
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${activeTab === 'register' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : ''}`}
        >
          Account
        </button>
      </div>
    </header>
  );
};
