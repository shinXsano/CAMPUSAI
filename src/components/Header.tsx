import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Flame, 
  BookOpen, 
  ChevronDown, 
  Search, 
  Sparkles,
  Command
} from 'lucide-react';
import { UNIVERSITIES } from '../data/sampleData.ts';

interface HeaderProps {
  currentCampus: string;
  onCampusChange: (campus: string) => void;
  streakCount: number;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCampus,
  onCampusChange,
  streakCount,
  activeTab,
  onSelectTab,
  onOpenQuickSearch,
}) => {
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);

  const tabs = [
    { id: 'copilot', label: 'Study Copilot', icon: Sparkles },
    { id: 'flashcards', label: 'Active Recall Decks', icon: BookOpen },
    { id: 'auditor', label: 'Academic Lab', icon: GraduationCap },
    { id: 'syllabus', label: 'Syllabus Architect', icon: BookOpen },
    { id: 'campus', label: 'Campus Life & Advisor', icon: MapPin },
    { id: 'gpa', label: 'GPA Strategist', icon: GraduationCap },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Campus Selector */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('copilot')}>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-title text-xl font-bold tracking-tight text-slate-900">
                    Campus AI
                  </span>
                  <span className="text-xs text-slate-400 font-mono">v2.6</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Collegiate Suite</span>
                  <span aria-hidden="true">·</span>
                  <span>Fall 2026</span>
                </div>
              </div>
            </div>

            {/* University Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                aria-expanded={showCampusDropdown}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">{currentCampus}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCampusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowCampusDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-30 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Select University Campus
                    </div>
                    {UNIVERSITIES.map((campus) => (
                      <button
                        key={campus}
                        onClick={() => {
                          onCampusChange(campus);
                          setShowCampusDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                          currentCampus === campus
                            ? 'bg-indigo-50 text-indigo-900 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{campus}</span>
                        {currentCampus === campus && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions & Meta */}
          <div className="flex items-center gap-4">
            {/* Quick Command Trigger */}
            <button
              onClick={onOpenQuickSearch}
              className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/70 rounded-lg text-xs text-slate-500 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search study materials, prompt tutor...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Streak Counter - Unboxed clean text */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 font-medium">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{streakCount} Day Study Streak</span>
            </div>

            {/* Academic Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4">
              <span>Term GPA: <strong className="text-slate-900">3.88</strong></span>
              <span aria-hidden="true">·</span>
              <span>16 Credits</span>
            </div>
          </div>
        </div>

        {/* Primary Segmented Navigation Bar */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
