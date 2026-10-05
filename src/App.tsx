import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Search, 
  Command, 
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { StudyCopilot } from './components/StudyCopilot.tsx';
import { FlashcardsDeck } from './components/FlashcardsDeck.tsx';
import { AcademicAuditor } from './components/AcademicAuditor.tsx';
import { SyllabusArchitect } from './components/SyllabusArchitect.tsx';
import { CampusAdvisor } from './components/CampusAdvisor.tsx';
import { GPAPlanner } from './components/GPAPlanner.tsx';
import { INITIAL_COURSES, INITIAL_FLASHCARDS, UNIVERSITIES } from './data/sampleData.ts';
import { Course, Flashcard } from './types/index.ts';

export default function App() {
  const [campus, setCampus] = useState<string>(() => {
    return localStorage.getItem('campus_ai_campus') || 'UC Berkeley';
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('campus_ai_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [activeCourse, setActiveCourse] = useState<Course>(courses[0] || INITIAL_COURSES[0]);

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('campus_ai_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [activeTab, setActiveTab] = useState<string>('copilot');
  const [streakCount] = useState<number>(14);
  const [showQuickSearch, setShowQuickSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('campus_ai_campus', campus);
  }, [campus]);

  useEffect(() => {
    localStorage.setItem('campus_ai_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('campus_ai_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickSearch((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowQuickSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchCommands = [
    { title: 'Study Copilot: Socratic Tutor', tab: 'copilot', icon: Sparkles, desc: 'Ask questions with step-by-step guidance' },
    { title: 'Flashcards: Active Recall Deck', tab: 'flashcards', icon: BookOpen, desc: 'Review spaced-repetition study cards' },
    { title: 'Academic Lab: Code & Essay Auditor', tab: 'auditor', icon: GraduationCap, desc: 'Pre-submission rubric and logic check' },
    { title: 'Syllabus Architect: Workload Roadmap', tab: 'syllabus', icon: BookOpen, desc: 'Analyze course deadlines & grade weights' },
    { title: 'Campus Life & Faculty Email Drafter', tab: 'campus', icon: MapPin, desc: 'Etiquette-checked research & office hour emails' },
    { title: 'GPA & Honors Simulator', tab: 'gpa', icon: GraduationCap, desc: 'Calculate term standing and required grades' },
  ];

  const filteredCommands = searchCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Primary Navigation & Header */}
      <Header
        currentCampus={campus}
        onCampusChange={setCampus}
        streakCount={streakCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickSearch={() => setShowQuickSearch(true)}
      />

      {/* Main Viewport Container (Desktop baseline 1440px friendly max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'copilot' && (
          <StudyCopilot
            courses={courses}
            activeCourse={activeCourse}
            onSelectCourse={setActiveCourse}
            campusName={campus}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsDeck
            cards={flashcards}
            onUpdateCards={setFlashcards}
            activeCourse={activeCourse}
          />
        )}

        {activeTab === 'auditor' && (
          <AcademicAuditor activeCourse={activeCourse} />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusArchitect
            courses={courses}
            activeCourse={activeCourse}
            onSelectCourse={setActiveCourse}
          />
        )}

        {activeTab === 'campus' && (
          <CampusAdvisor campusName={campus} />
        )}

        {activeTab === 'gpa' && (
          <GPAPlanner
            courses={courses}
            onUpdateCourses={setCourses}
          />
        )}
      </main>

      {/* Editorial Footer (Clean, unboxed, zero-slop discipline) */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                C
              </div>
              <span className="font-serif-title font-semibold text-sm text-slate-900">
                Campus AI
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                Empowering university students with ethical, rigorous academic copilots
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="hover:text-slate-900 cursor-pointer">Collegiate Honor Code</span>
              <span aria-hidden="true">·</span>
              <span className="hover:text-slate-900 cursor-pointer">Syllabus Integrations</span>
              <span aria-hidden="true">·</span>
              <span className="hover:text-slate-900 cursor-pointer">FERPA & Student Privacy</span>
              <span aria-hidden="true">·</span>
              <span>© {new Date().getFullYear()} Campus AI</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Command Palette Modal (Cmd+K) */}
      {showQuickSearch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Search className="w-4 h-4 text-slate-400 ml-2" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command, course code, or tool name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 py-1"
              />
              <button
                onClick={() => setShowQuickSearch(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Academic Tools & Views
              </div>
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.tab}
                  onClick={() => {
                    setActiveTab(cmd.tab);
                    setShowQuickSearch(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-slate-100 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-700">
                      <cmd.icon className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{cmd.title}</div>
                      <div className="text-[11px] text-slate-500">{cmd.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}

              <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-2">
                Active Courses
              </div>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setActiveCourse(course);
                    setActiveTab('copilot');
                    setShowQuickSearch(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800">
                    {course.code} · {course.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{course.credits} Credits</span>
                </button>
              ))}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">ESC</kbd> to close
              </span>
              <span>Campus AI Universal Command Palette</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
