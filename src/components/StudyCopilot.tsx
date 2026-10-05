import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle, 
  BrainCircuit, 
  Flame, 
  BookMarked,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { AcademicMode, ChatMessage, Course } from '../types/index.ts';

interface StudyCopilotProps {
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
  campusName: string;
}

export const StudyCopilot: React.FC<StudyCopilotProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
  campusName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Hello! I'm your academic study copilot at ${campusName}. I'm synced to **${activeCourse.code}: ${activeCourse.name}**. 

Whether you need a **Socratic breakdown** of a tricky problem set, an intuitive **Feynman analogy**, or high-yield **exam trap warnings**, let me know what you're working on today.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: activeCourse.name,
      mode: 'socratic',
    },
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AcademicMode>('socratic');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sampleQuestionsByCourse: Record<string, string[]> = {
    'CS 61B': [
      'Why is building a binary heap using bottom-up Heapify O(n) instead of O(n log n)?',
      'Explain how amortized analysis proves ArrayList resize is O(1) per add.',
      'What is the fundamental difference between Kruskal\'s and Prim\'s minimum spanning tree algorithms?',
    ],
    'MATH 53': [
      'Give me an intuitive geometric explanation of Green\'s Theorem with curl.',
      'How do Lagrange Multipliers geometrically find constrained extrema?',
      'Walk me through converting Cartesian to spherical triple integrals step-by-step.',
    ],
    'PHYS 7A': [
      'Why does rolling without slipping require static friction rather than kinetic friction?',
      'How does conservation of angular momentum explain precession in a gyroscope?',
      'Derive the period formula for a physical pendulum with small angle approximation.',
    ],
    'ECON 100A': [
      'Explain the Slutsky decomposition into substitution and income effects.',
      'How does first-degree price discrimination eliminate deadweight loss?',
      'Find the Nash equilibrium in a Cournot duopoly with symmetric constant marginal costs.',
    ],
  };

  const currentQuestions = sampleQuestionsByCourse[activeCourse.code] || [
    `Break down the most important foundational theorem in ${activeCourse.name}.`,
    `What are the most common exam traps students make in ${activeCourse.name}?`,
    `Give me an intuitive mental model for this week's topics in ${activeCourse.name}.`,
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: activeCourse.name,
      mode,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          subject: `${activeCourse.code} - ${activeCourse.name}`,
          mode,
          history: messages.slice(-5).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: data.text || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeCourse.name,
        mode,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `**Checkpoint:** Let's break this down systematically.
        
1. State the primary assumption or theorem involved in **${textToSend.slice(0, 60)}**.
2. Identify which variables are held constant and which are dynamic.
3. Test your boundary condition: What happens as the parameter approaches zero or infinity?

*Prompt:* Try answering step 1 and we will build the formal derivation step by step!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeCourse.name,
        mode,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `rst-${Date.now()}`,
        role: 'assistant',
        text: `New study session started for **${activeCourse.code}: ${activeCourse.name}**. What concept or problem set question shall we conquer?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: activeCourse.name,
        mode,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Controls & Context */}
      <div className="lg:col-span-1 space-y-5">
        {/* Active Course Selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Course Context
            </span>
            <span className="text-xs text-indigo-600 font-medium">Synced</span>
          </div>

          <div className="space-y-1.5">
            {courses.map((course) => {
              const isSelected = activeCourse.id === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold block">{course.code}</span>
                    <span className={`text-[11px] truncate block ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {course.name}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono shrink-0 ml-2 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {course.credits}cr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pedagogical AI Mode Selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pedagogical Mode</span>
          </div>

          <div className="space-y-1.5">
            {[
              {
                id: 'socratic' as AcademicMode,
                title: 'Socratic Guide',
                desc: 'Guides through questions without giving answers away',
                icon: HelpCircle,
              },
              {
                id: 'explain_simple' as AcademicMode,
                title: 'Feynman Analogy',
                desc: 'Simple mental models & intuitive analogies',
                icon: Lightbulb,
              },
              {
                id: 'exam_prep' as AcademicMode,
                title: 'Exam Trap Crunch',
                desc: 'High-yield pitfalls, heuristics, and practice prompts',
                icon: Flame,
              },
              {
                id: 'deep_dive' as AcademicMode,
                title: 'Graduate Deep Dive',
                desc: 'Rigorous formal proofs, literature context, edge cases',
                icon: BookMarked,
              },
            ].map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium shadow-2xs'
                      : 'border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <m.icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="font-semibold">{m.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Session Stats */}
        <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span>Current Subject:</span>
            <span className="font-semibold text-slate-900">{activeCourse.code}</span>
          </div>
          <div className="flex justify-between">
            <span>Target Grade:</span>
            <span className="font-semibold text-emerald-600">{activeCourse.gradeTarget}</span>
          </div>
          <div className="flex justify-between">
            <span>Model Engine:</span>
            <span className="font-mono text-slate-700">Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="lg:col-span-3 flex flex-col h-[700px] bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {/* Chat Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">
                  {activeCourse.code} Academic Copilot
                </span>
                <span className="text-xs text-indigo-600 font-mono capitalize">
                  [{mode.replace('_', ' ')}]
                </span>
              </div>
              <div className="text-xs text-slate-500">
                <span>Tailored for {campusName} curricula</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
              title="Reset conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                    🎓
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-200/50 text-[11px] opacity-75">
                    <span>{isUser ? 'You' : `${activeCourse.code} Copilot`}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message body with formatted markdown elements */}
                  <div className="space-y-2 whitespace-pre-wrap font-sans text-[13px]">
                    {msg.text}
                  </div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="italic">Verify derivations against lecture slides</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy note</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Thinking through {activeCourse.code} theoretical formulation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested High-Yield Prompts */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">
            Quick Prompts:
          </span>
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors shrink-0 truncate max-w-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything about ${activeCourse.code} (${activeCourse.name})...`}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Ask Tutor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Press Enter to send · Shift+Enter for newline</span>
            <span>Campus AI encourages active learning over passive answer-copying</span>
          </div>
        </div>
      </div>
    </div>
  );
};
