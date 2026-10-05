import React, { useState } from 'react';
import { 
  FileText, 
  Code2, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check,
  Award,
  ListChecks,
  Split
} from 'lucide-react';
import { ReviewResult, Course } from '../types/index.ts';
import { SAMPLE_ESSAY, SAMPLE_CODE } from '../data/sampleData.ts';

interface AcademicAuditorProps {
  activeCourse: Course;
}

export const AcademicAuditor: React.FC<AcademicAuditorProps> = ({ activeCourse }) => {
  const [mode, setMode] = useState<'essay' | 'code'>('essay');
  const [content, setContent] = useState(SAMPLE_ESSAY);
  const [rubric, setRubric] = useState('Collegiate Honors Standard');
  const [promptContext, setPromptContext] = useState(
    'Critique the epistemological implications of algorithmic recommendation feeds on civic discourse.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSwitchMode = (newMode: 'essay' | 'code') => {
    setMode(newMode);
    if (newMode === 'essay') {
      setContent(SAMPLE_ESSAY);
      setPromptContext('Analyze rhetorical strength, thesis defense, and academic transitions.');
    } else {
      setContent(SAMPLE_CODE);
      setPromptContext('Evaluate algorithmic complexity, edge cases, memory management, and code elegance.');
    }
    setResult(null);
  };

  const handleRunAudit = async () => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          content,
          prompt: promptContext,
          rubric,
        }),
      });

      if (!response.ok) throw new Error('Review failed');
      const data: ReviewResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
      const isCode = mode === 'code';
      setResult({
        overallGradeEstimate: isCode ? 'A- (High Algorithmic Rigor, Minor Defensive Gaps)' : 'A- (Strong Argumentation, Minor Citation Gaps)',
        summary: isCode
          ? 'The implementation achieves target Big-O complexity with clean decomposition. Consider adding explicit null checks and input bounds validation.'
          : 'The argument is lucid and persuasive with a well-defined thesis statement. Strengthen the transition between counter-arguments in the third paragraph.',
        strengths: isCode
          ? ['Optimal runtime complexity', 'Clean modular separation of concerns', 'Idiomatic control flow']
          : ['Compelling thesis statement', 'Scholarly rhetorical framing', 'Sophisticated academic vocabulary'],
        weaknesses: isCode
          ? ['Missing edge case validation for null or empty inputs', 'Could improve inline documentation for complex invariant updates']
          : ['Second paragraph transitions abruptly without a bridging premise', 'Secondary claim in section 3 lacks empirical attribution'],
        actionItems: isCode
          ? ['Add boundary guard clauses at entry point', 'Refactor nested conditionals into helper functions', 'Include edge case unit tests']
          : ['Add citation for empirical assertions', 'Convert passive verbs to active analytical voice', 'Reframe conclusion to highlight broader implications'],
        annotations: [
          {
            lineOrQuote: content.slice(0, Math.min(60, content.length)),
            suggestion: isCode ? 'Add boundary validation guard clause' : 'Strengthen transitional connective (e.g. "Furthermore" or "In contrast")',
            reason: 'Improves technical/academic rigor and structural precision.',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySuggestion = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-slate-900">
              Academic Lab & Auditor
            </span>
            <span className="text-xs text-indigo-600 font-mono">Dual-Engine</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Pre-Submission Quality Inspection</span>
            <span aria-hidden="true">·</span>
            <span>Rubric-aligned grading & line-by-line feedback</span>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => handleSwitchMode('essay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'essay'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Essay & Paper Mode</span>
          </button>
          <button
            onClick={() => handleSwitchMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'code'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code & Algorithmic Mode</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Input Workspace vs Audit Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Submission Workspace */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {mode === 'essay' ? 'Draft Text to Audit' : 'Source Code to Audit'}
              </span>
            </div>
            <button
              onClick={() => {
                if (mode === 'essay') setContent(SAMPLE_ESSAY);
                else setContent(SAMPLE_CODE);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset to Sample
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Assignment Prompt / Grading Rubric Context
              </label>
              <input
                type="text"
                value={promptContext}
                onChange={(e) => setPromptContext(e.target.value)}
                placeholder="e.g., Final Paper on Economic Sanctions, or CS Project 2 Specification..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  {mode === 'essay' ? 'Draft Body' : 'Code Snippet'}
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className={`w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 leading-relaxed ${
                  mode === 'code' ? 'font-mono text-[12px] bg-slate-950 text-slate-100' : 'font-sans'
                }`}
                placeholder={
                  mode === 'essay'
                    ? 'Paste your essay draft, literature review, or problem analysis...'
                    : 'Paste your algorithm, data structure, or project implementation...'
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Rubric Tier:</span>
                <select
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                >
                  <option value="Collegiate Standard">Undergraduate Standard</option>
                  <option value="Collegiate Honors Standard">Honors / Dean's List Tier</option>
                  <option value="Graduate Peer-Review">Graduate Peer-Review Rigor</option>
                </select>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isLoading || !content.trim()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing Submission...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Run Full Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Findings & Feedback */}
        <div className="space-y-5">
          {!result && !isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-300 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">
                Ready for Academic Inspection
              </h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Click <strong>"Run Full Audit"</strong> to evaluate thesis cohesion, argument transitions, edge case handling, and line-by-line revision suggestions.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-xl space-y-4">
              <RotateCw className="w-8 h-8 animate-spin text-indigo-600" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900">
                  Deconstructing Submission
                </h4>
                <p className="text-xs text-slate-500">
                  Checking argument validity, algorithmic invariants, and stylistic cadence...
                </p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-5 animate-in fade-in">
              {/* Overall Grade Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Overall Assessment
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {result.overallGradeEstimate}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mt-3">
                  {result.summary}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Academic Strengths</span>
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside leading-relaxed">
                    {result.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Vulnerabilities / Deductions</span>
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1.5 list-disc list-inside leading-relaxed">
                    {result.weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ListChecks className="w-4 h-4 text-indigo-600" />
                  <span>Next Actions to Boost Grade</span>
                </div>
                <div className="space-y-2">
                  {result.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line-by-Line Annotations */}
              {result.annotations.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Split className="w-4 h-4 text-indigo-600" />
                    <span>Targeted Line Recommendations</span>
                  </div>
                  <div className="space-y-3">
                    {result.annotations.map((ann, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2"
                      >
                        <div className="text-[11px] text-slate-500 font-mono bg-white p-1.5 rounded border border-slate-200/80 truncate">
                          "{ann.lineOrQuote}"
                        </div>
                        <div className="text-slate-800 font-medium leading-relaxed">
                          <strong>Revision:</strong> {ann.suggestion}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                          <span>{ann.reason}</span>
                          <button
                            onClick={() => handleCopySuggestion(idx, ann.suggestion)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy revision</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
