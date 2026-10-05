import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  BatteryCharging, 
  Volume2, 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw,
  Send,
  HelpCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { CAMPUS_STUDY_SPOTS } from '../data/sampleData.ts';
import { CampusAdvisorResult } from '../types/index.ts';

interface CampusAdvisorProps {
  campusName: string;
}

export const CampusAdvisor: React.FC<CampusAdvisorProps> = ({ campusName }) => {
  const [activeCategory, setActiveCategory] = useState<'email' | 'spots' | 'focus'>('email');
  
  // Email & Query State
  const [queryInput, setQueryInput] = useState('Email professor asking to join undergraduate AI research lab');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<CampusAdvisorResult | null>({
    title: 'Research Laboratory Outreach Protocol',
    actionPlan: [
      'Read 2 recent publications from the professor\'s lab group before sending.',
      'Explicitly reference a specific project or paper paragraph to demonstrate authentic preparation.',
      'Attach a 1-page academic CV and unofficial transcript as a single PDF.',
      'Send between Tuesday and Thursday at 8:45 AM for optimal faculty inbox visibility.',
    ],
    draftTemplate: `Subject: Undergraduate Research Inquiry: [Lab Name] - [Your Full Name]\n\nDear Professor [Last Name],\n\nI hope your semester is going smoothly. My name is [Your Name], and I am a [Year] studying [Major] here at ${campusName}.\n\nI recently read your lab's publication on [Specific Paper Title / Topic], and was particularly fascinated by your approach to [Specific Method/Mechanism]. Having completed [Relevant Course 1, e.g., CS 61B] and [Relevant Course 2], I am eager to contribute to research at the intersection of [Interest Area].\n\nI would welcome the opportunity to discuss any potential undergraduate openings in your group for this coming semester during your office hours or at your convenience.\n\nI have attached my academic CV and unofficial transcript for your reference. Thank you very much for your time and guidance.\n\nWarm regards,\n[Your Name]\nStudent ID: [Your ID]\nGitHub / Portfolio: [Optional Link]`,
    keyLocationsOrHours: [
      { place: 'Faculty Department Office', note: 'Check office hours posted outside room or on syllabus.' },
    ],
  });

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunAdvisorQuery = async (queryText?: string) => {
    const targetQuery = queryText || queryInput;
    if (!targetQuery.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/campus-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: targetQuery,
          campus: campusName,
          category: activeCategory,
        }),
      });

      if (!response.ok) throw new Error('Query failed');
      const data: CampusAdvisorResult = await response.json();
      setAdvisorResult(data);
    } catch (err) {
      console.error('Advisor query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (!advisorResult?.draftTemplate) return;
    navigator.clipboard.writeText(advisorResult.draftTemplate);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const emailPresets = [
    'Email professor asking to join undergraduate AI research lab',
    'Polite inquiry requesting regrade on Midterm problem 3',
    'Requesting a graduate school letter of recommendation',
    'Scheduling office hours to discuss career & syllabus guidance',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-slate-900">
              Campus Life & Academic Navigator
            </span>
            <span className="text-xs text-indigo-600 font-mono">Synced to {campusName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Faculty Communications & Campus Strategy</span>
            <span aria-hidden="true">·</span>
            <span>Study spaces & deep-work focus timer</span>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveCategory('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeCategory === 'email'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Faculty Drafter</span>
          </button>
          <button
            onClick={() => setActiveCategory('spots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeCategory === 'spots'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Study Spots</span>
          </button>
          <button
            onClick={() => setActiveCategory('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeCategory === 'focus'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus Companion</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Faculty Email Drafter & Academic Scenarios */}
      {activeCategory === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Query & Presets */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Academic Outreach Goal</span>
            </div>

            <p className="text-xs text-slate-500">
              Select a collegiate scenario or enter a custom prompt. Campus AI produces an etiquette-checked, faculty-ready template.
            </p>

            <div className="space-y-2">
              {emailPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQueryInput(preset);
                    handleRunAdvisorQuery(preset);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                    queryInput === preset
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Custom Communication Scenario
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. Email TA asking for extension on emergency..."
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  onClick={() => handleRunAdvisorQuery()}
                  disabled={isLoading || !queryInput.trim()}
                  className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-5">
            {advisorResult && (
              <div className="space-y-5">
                {/* Protocol Checklist */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">
                      {advisorResult.title}
                    </h4>
                    <span className="text-xs text-indigo-600 font-mono">Collegiate Etiquette</span>
                  </div>

                  <div className="space-y-2">
                    {advisorResult.actionPlan.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready-to-use Email Draft */}
                {advisorResult.draftTemplate && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Ready-to-Send Template
                      </span>
                      <button
                        onClick={handleCopyDraft}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {advisorResult.draftTemplate}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Campus Study Spots Directory */}
      {activeCategory === 'spots' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPUS_STUDY_SPOTS.map((spot) => (
              <div
                key={spot.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{spot.name}</h4>
                    <span className="text-xs text-slate-500">{spot.building} · {campusName}</span>
                  </div>
                  <span className="text-xs font-medium text-indigo-600">Verified Spot</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Volume2 className="w-3 h-3" />
                      <span>Noise Level</span>
                    </div>
                    <span className="font-semibold text-slate-800">{spot.noiseLevel}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <BatteryCharging className="w-3 h-3" />
                      <span>Power Outlets</span>
                    </div>
                    <span className="font-semibold text-slate-800">{spot.outlets}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Users className="w-3 h-3" />
                      <span>Crowd Density</span>
                    </div>
                    <span className="font-semibold text-slate-800">{spot.crowdLevel}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Best study window: <strong className="text-slate-700">{spot.bestHours}</strong></span>
                  <span className="text-emerald-600 font-semibold">Eduroam 500Mbps+</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Focus Timer Companion */}
      {activeCategory === 'focus' && (
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-2xs animate-in fade-in">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Deep Work Pomodoro Block
            </span>
            <div className="text-5xl font-mono font-bold text-slate-900 my-4 tracking-tight">
              {formatTimer(timerSeconds)}
            </div>
            <p className="text-xs text-slate-500">
              Scientifically calibrated 25-minute academic immersion interval.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Interval</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4 text-xs">
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="text-slate-600 hover:text-indigo-600 font-medium"
            >
              25m Focus
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(50 * 60);
              }}
              className="text-slate-600 hover:text-indigo-600 font-medium"
            >
              50m Double Block
            </button>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(5 * 60);
              }}
              className="text-slate-600 hover:text-indigo-600 font-medium"
            >
              5m Quick Break
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
