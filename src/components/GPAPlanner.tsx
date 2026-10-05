import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Calculator
} from 'lucide-react';
import { Course } from '../types/index.ts';

interface GPAPlannerProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export const GPAPlanner: React.FC<GPAPlannerProps> = ({ courses, onUpdateCourses }) => {
  const [priorCredits, setPriorCredits] = useState(48);
  const [priorGPA, setPriorGPA] = useState(3.82);
  const [targetCumulativeGPA, setTargetCumulativeGPA] = useState(3.88);

  // New course form
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(4);
  const [newGrade, setNewGrade] = useState('A');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate Term GPA
  const totalTermCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalTermPoints = courses.reduce((sum, c) => {
    const pts = GRADE_POINTS[c.currentGrade] ?? 4.0;
    return sum + pts * c.credits;
  }, 0);

  const termGPA = totalTermCredits > 0 ? (totalTermPoints / totalTermCredits).toFixed(2) : '4.00';

  // Calculate Projected Cumulative GPA
  const totalCumulativeCredits = priorCredits + totalTermCredits;
  const totalCumulativePoints = (priorGPA * priorCredits) + totalTermPoints;
  const projectedCumulativeGPA = totalCumulativeCredits > 0 ? (totalCumulativePoints / totalCumulativeCredits).toFixed(2) : priorGPA.toFixed(2);

  // Scenario Calculation: Needed points in term to reach target cumulative
  // target = (priorPts + neededTermPts) / (priorCred + termCred)
  const neededTermPoints = (targetCumulativeGPA * totalCumulativeCredits) - (priorGPA * priorCredits);
  const neededTermGPA = totalTermCredits > 0 ? (neededTermPoints / totalTermCredits).toFixed(2) : 'N/A';

  const handleGradeChange = (courseId: string, grade: string) => {
    const updated = courses.map((c) => (c.id === courseId ? { ...c, currentGrade: grade } : c));
    onUpdateCourses(updated);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      credits: newCredits,
      gradeTarget: 'A',
      currentGrade: newGrade,
      term: 'Fall 2026',
      color: '#6366F1',
      syllabusSnippet: `${newName} course overview.`,
    };

    onUpdateCourses([...courses, newCourse]);
    setNewCode('');
    setNewName('');
    setShowAddModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    onUpdateCourses(courses.filter((c) => c.id !== id));
  };

  // Workload rating
  let workloadRating = 'Balanced (12-16 credits)';
  if (totalTermCredits >= 18) workloadRating = 'Heavy / Accelerated (>18 credits)';
  else if (totalTermCredits < 12) workloadRating = 'Part-Time / Light (<12 credits)';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-slate-900">
              GPA & Semester Strategist
            </span>
            <span className="text-xs text-indigo-600 font-mono">Forecasting Engine</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Scenario Simulator & Honors Standing Projection</span>
            <span aria-hidden="true">·</span>
            <span>Real-time credit load calculation</span>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Add Course</span>
        </button>
      </div>

      {/* GPA Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Projected Term GPA
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {termGPA}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Based on {courses.length} active courses
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Cumulative GPA
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {projectedCumulativeGPA}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalCumulativeCredits} total graded credits
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Current Term Load
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalTermCredits} <span className="text-sm font-normal text-slate-500">Credits</span>
          </div>
          <div className="text-[11px] text-indigo-600 mt-0.5">
            {workloadRating}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Target Cumulative
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
            {targetCumulativeGPA.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Dean's Honors Distinction Tier
          </div>
        </div>
      </div>

      {/* Main Grid: Course Gradebook Table & What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Gradebook */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Active Enrolled Coursework
            </span>
            <span className="text-xs text-slate-500">
              Change grades below to simulate final outcomes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="pb-3 px-2">Course</th>
                  <th className="pb-3 px-3">Course Name</th>
                  <th className="pb-3 px-3">Credits</th>
                  <th className="pb-3 px-3">Projected Grade</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-slate-900">{c.code}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{c.credits} cr</td>
                    <td className="py-3 px-3">
                      <select
                        value={c.currentGrade}
                        onChange={(e) => handleGradeChange(c.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-800"
                      >
                        {Object.keys(GRADE_POINTS).map((g) => (
                          <option key={g} value={g}>
                            {g} ({GRADE_POINTS[g].toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What-If Academic Simulator */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Target Scenario Simulator</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Specify your prior historical credits and overall target GPA to determine required term performance.
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">
                Completed Credits Before This Term
              </label>
              <input
                type="number"
                value={priorCredits}
                onChange={(e) => setPriorCredits(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">
                Prior Cumulative GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={priorGPA}
                onChange={(e) => setPriorGPA(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">
                Desired Cumulative Target GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={targetCumulativeGPA}
                onChange={(e) => setTargetCumulativeGPA(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Required Term Outcome
              </span>
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-950 font-medium">Needed Term GPA:</span>
                  <span className="font-mono font-bold text-sm text-indigo-700">
                    {neededTermGPA}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {Number(neededTermGPA) > 4.0
                    ? '⚠️ Mathematically impossible this term. Lower target or complete more credits next semester.'
                    : Number(neededTermGPA) <= 3.7
                    ? '✅ Very achievable with solid A-/B+ consistency across enrolled courses.'
                    : '🎯 Requires maintaining straight A grades in enrolled coursework.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Enroll New Collegiate Course
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. STAT 134"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Concepts of Probability"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Target Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
                >
                  Add Course to Planner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
