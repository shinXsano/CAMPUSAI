import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RotateCw, 
  ChevronRight, 
  Target, 
  PieChart, 
  Flame,
  FileCheck
} from 'lucide-react';
import { SyllabusData, Course } from '../types/index.ts';

interface SyllabusArchitectProps {
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
}

export const SyllabusArchitect: React.FC<SyllabusArchitectProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
}) => {
  const [syllabusInput, setSyllabusInput] = useState(activeCourse.syllabusSnippet || '');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SyllabusData | null>({
    courseTitle: `${activeCourse.code}: ${activeCourse.name}`,
    credits: activeCourse.credits,
    difficultyRating: 'Rigorous / High Workload',
    weeklyWorkloadHours: '10–12 Hours / Week',
    gradeWeighting: [
      { component: 'Midterm Exams (2)', percentage: '35%' },
      { component: 'Comprehensive Final Exam', percentage: '30%' },
      { component: 'Problem Sets & Projects', percentage: '25%' },
      { component: 'Discussion & Quizzes', percentage: '10%' },
    ],
    keyMilestones: [
      { title: 'Foundational Diagnostic Pset', week: 2, weight: '5%', tips: 'Solidify vector algebra & asymptotic notation prerequisites early.' },
      { title: 'Midterm 1 Examination', week: 6, weight: '15%', tips: 'Solve at least 3 historical past exams in quiet exam condition.' },
      { title: 'Midterm 2 Examination', week: 11, weight: '20%', tips: 'Heaviest conceptual weight on graph search & multivariable integration.' },
      { title: 'Final Capstone Project', week: 14, weight: '10%', tips: 'Complete unit tests 48 hours prior to the deadline cutoff.' },
      { title: 'Final Examination', week: 16, weight: '30%', tips: 'Cumulative synthesis. Schedule two 3-hour review blocks.' },
    ],
    studyStrategy: [
      'Pre-read slide decks before each lecture to transform lecture time into active synthesis.',
      'Hold a weekly 90-minute problem set session with your study group 4 days before submission.',
      'Visit professor office hours within the first 3 weeks to clarify ambiguous conceptual models.',
    ],
    weeklyRoadmap: [
      { week: 1, topic: 'Axioms, Set Theory & Invariants', readings: 'Textbook Ch. 1', deliverables: 'Enrollment Quiz' },
      { week: 2, topic: 'Asymptotic Analysis & Growth Orders', readings: 'Textbook Ch. 2', deliverables: 'Problem Set 1' },
      { week: 3, topic: 'Trees, Heaps & Priority Queues', readings: 'Textbook Ch. 3-4', deliverables: 'Problem Set 2' },
      { week: 4, topic: 'Hashing, Collisions & Load Factors', readings: 'Textbook Ch. 5', deliverables: 'Project 1 Checkpoint' },
      { week: 5, topic: 'Graph Representations & Traversals (BFS/DFS)', readings: 'Textbook Ch. 6', deliverables: 'Problem Set 3' },
      { week: 6, topic: 'Midterm 1 Week & Synthesis', readings: 'Past Exam Archive', deliverables: 'Midterm Exam 1' },
    ],
  });

  const handleAnalyzeSyllabus = async () => {
    if (!syllabusInput.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/syllabus-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText: syllabusInput,
          courseName: `${activeCourse.code}: ${activeCourse.name}`,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const parsed: SyllabusData = await response.json();
      setData(parsed);
    } catch (err) {
      console.error('Syllabus analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-slate-900">
              Syllabus & Milestone Architect
            </span>
            <span className="text-xs text-indigo-600 font-mono">Curriculum Parser</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Automated Workload & Milestone Extraction</span>
            <span aria-hidden="true">·</span>
            <span>Prevent deadline surprise crunches</span>
          </div>
        </div>

        {/* Course quick buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelectCourse(c);
                setSyllabusInput(c.syllabusSnippet || '');
              }}
              className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                activeCourse.id === c.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      {/* Input Drawer / Custom Syllabus */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Syllabus Content for {activeCourse.code}
          </span>
          <button
            onClick={() => setSyllabusInput(activeCourse.syllabusSnippet || '')}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Load Course Defaults
          </button>
        </div>

        <textarea
          value={syllabusInput}
          onChange={(e) => setSyllabusInput(e.target.value)}
          rows={3}
          placeholder="Paste grading policy, exam dates, or weekly schedule from your course syllabus..."
          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyzeSyllabus}
            disabled={isLoading || !syllabusInput.trim()}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-colors shadow-xs"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Workload...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extract Strategic Roadmap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Structured Roadmap & Breakdown */}
      {data && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Expected Workload</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {data.weeklyWorkloadHours}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Target: {data.credits} Academic Credit Units
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Course Rigor Level</span>
              </div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {data.difficultyRating || 'Rigorous Standard'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Requires continuous weekly active recall
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Target Grade Outcome</span>
              </div>
              <div className="text-lg font-bold text-emerald-600 mt-1">
                Grade: {activeCourse.gradeTarget}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Currently tracking at: {activeCourse.currentGrade}
              </div>
            </div>
          </div>

          {/* Grade Distribution & Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grade Weighting */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <span>Grading Allocation</span>
              </div>
              <div className="space-y-3">
                {data.gradeWeighting.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700">{item.component}</span>
                      <span className="font-mono text-slate-900">{item.percentage}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-slate-900 h-1.5 rounded-full"
                        style={{
                          width: item.percentage.includes('%') ? item.percentage : '25%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Study Strategy */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Curriculum Strategy
                </span>
                <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
                  {data.studyStrategy.map((strat, i) => (
                    <li key={i}>{strat}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* High Stakes Milestones Timeline */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>High-Stakes Milestones & Deadlines</span>
              </div>

              <div className="space-y-3">
                {data.keyMilestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{ms.title}</span>
                        <span className="text-[11px] font-mono text-slate-400">·</span>
                        <span className="text-xs font-semibold text-indigo-600">Week {ms.week}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>Preparation Heuristic:</strong> {ms.tips}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold bg-white border border-slate-200 text-slate-900 rounded-md shadow-2xs">
                        {ms.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Roadmap Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Weekly Course Syllabus & Deliverables</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-2">Week</th>
                    <th className="pb-3 px-3">Lecture & Core Topics</th>
                    <th className="pb-3 px-3">Assigned Readings</th>
                    <th className="pb-3 px-3">Weekly Deliverable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.weeklyRoadmap.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-slate-900 whitespace-nowrap">
                        W{item.week}
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-medium">{item.topic}</td>
                      <td className="py-3 px-3 text-slate-500">{item.readings}</td>
                      <td className="py-3 px-3">
                        <span className="text-slate-700 font-medium">{item.deliverables}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
