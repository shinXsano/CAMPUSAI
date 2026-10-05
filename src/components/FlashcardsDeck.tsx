import React, { useState } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Download, 
  Trash2, 
  Lightbulb, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Brain,
  HelpCircle
} from 'lucide-react';
import { Flashcard, Course } from '../types/index.ts';

interface FlashcardsDeckProps {
  cards: Flashcard[];
  onUpdateCards: (cards: Flashcard[]) => void;
  activeCourse: Course;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  cards,
  onUpdateCards,
  activeCourse,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  
  // Generator form state
  const [showGenerator, setShowGenerator] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [cardCount, setCardCount] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered cards
  const filteredCards = cards.filter((c) => {
    if (filter === 'all') return true;
    return c.mastery === filter;
  });

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const handleRate = (mastery: 'new' | 'learning' | 'mastered') => {
    if (!activeCard) return;
    const updated = cards.map((c) => (c.id === activeCard.id ? { ...c, mastery } : c));
    onUpdateCards(updated);
    handleNext();
  };

  const handleGenerateCards = async () => {
    if (!notesInput.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notesInput,
          subject: `${activeCourse.code}: ${activeCourse.name}`,
          count: cardCount,
          difficulty,
        }),
      });

      const data = await res.json();
      if (Array.isArray(data.cards) && data.cards.length > 0) {
        const newCards: Flashcard[] = data.cards.map((c: any, i: number) => ({
          id: `gen-${Date.now()}-${i}`,
          front: c.front,
          back: c.back,
          hint: c.hint || 'Think about the core operational mechanism.',
          concept: c.concept || activeCourse.name,
          keyFormula: c.keyFormula,
          mastery: 'new',
        }));

        onUpdateCards([...newCards, ...cards]);
        setShowGenerator(false);
        setNotesInput('');
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Flashcard generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCurrent = () => {
    if (!activeCard) return;
    const updated = cards.filter((c) => c.id !== activeCard.id);
    onUpdateCards(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleExport = () => {
    const markdown = cards
      .map(
        (c, idx) =>
          `### ${idx + 1}. [${c.concept}] ${c.front}\n**Answer:** ${c.back}\n*Hint:* ${c.hint}\n${
            c.keyFormula ? `*Formula:* \`${c.keyFormula}\`\n` : ''
          }\n---`
      )
      .join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCourse.code}_flashcards.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalCount = cards.length;
  const masteredCount = cards.filter((c) => c.mastery === 'mastered').length;
  const learningCount = cards.filter((c) => c.mastery === 'learning').length;
  const newCount = cards.filter((c) => !c.mastery || c.mastery === 'new').length;
  const masteryPercentage = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Deck Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-slate-900">
              Active Recall Decks
            </span>
            <span className="text-xs text-slate-400 font-mono">SRS Algorithm</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{totalCount} Cards in Deck</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold">{masteredCount} Mastered ({masteryPercentage}%)</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600">{learningCount} In Review</span>
            <span aria-hidden="true">·</span>
            <span>{newCount} New</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate from Notes</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Export Markdown/Anki text"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Generator Drawer */}
      {showGenerator && (
        <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                AI Flashcard Extraction Studio
              </h3>
            </div>
            <button
              onClick={() => setShowGenerator(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Paste lecture notes, textbook paragraphs, or syllabus definitions below. Campus AI will synthesize high-yield active recall flashcards with concepts, hints, and formulas.
          </p>

          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={4}
            placeholder={`Paste lecture slide text or problem set instructions for ${activeCourse.name}...`}
            className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <label className="flex items-center gap-1.5">
                <span>Cards:</span>
                <select
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                >
                  <option value={3}>3 Cards</option>
                  <option value={5}>5 Cards</option>
                  <option value={8}>8 Cards</option>
                </select>
              </label>

              <label className="flex items-center gap-1.5">
                <span>Rigor:</span>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                >
                  <option value="introductory">Introductory</option>
                  <option value="medium">Collegiate Midterm</option>
                  <option value="hard">Honors / Graduate</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleGenerateCards}
              disabled={isGenerating || !notesInput.trim()}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Cards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Flashcards</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs - Interactive Segmented Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: `All (${cards.length})` },
            { id: 'new', label: `New (${newCount})` },
            { id: 'learning', label: `Learning (${learningCount})` },
            { id: 'mastered', label: `Mastered (${masteredCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as any);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeCard && (
          <div className="text-xs text-slate-500 font-mono">
            Card {currentIndex + 1} of {filteredCards.length}
          </div>
        )}
      </div>

      {/* Main Flashcard Interactive View */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No flashcards in this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Switch your filter back to "All" or generate a new set from lecture notes.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Presentation Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[340px] bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-8 flex flex-col justify-between shadow-xs transition-all duration-200 relative group select-none"
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{activeCard.concept}</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{activeCard.mastery || 'new'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Click to flip ({isFlipped ? 'Answer' : 'Question'})</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="my-auto py-6 text-center space-y-4">
              {!isFlipped ? (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Active Recall Question
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
                    {activeCard.front}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 block text-center">
                    Model Solution & Rationale
                  </span>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
                    {activeCard.back}
                  </p>
                  {activeCard.keyFormula && (
                    <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono">
                      <span className="text-indigo-300 block text-[10px] uppercase font-bold mb-1">Key Theorem / Formulation</span>
                      {activeCard.keyFormula}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(!showHint);
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? 'Hide Hint' : 'Reveal Hint'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCurrent();
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors"
                title="Remove this card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hint Overlay */}
            {showHint && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 animate-in fade-in"
              >
                <strong>Recall Trigger:</strong> {activeCard.hint}
              </div>
            )}
          </div>

          {/* Spaced Repetition SRS Feedback Controls */}
          {isFlipped ? (
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm space-y-2 animate-in fade-in">
              <div className="text-center text-[11px] text-slate-400">
                Rate your recall difficulty to optimize repetition interval:
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate('learning')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-600 text-rose-300 rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  <span className="block font-bold">Again</span>
                  <span className="text-[10px] text-slate-400 font-normal">&lt; 10 min</span>
                </button>
                <button
                  onClick={() => handleRate('learning')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-amber-950/70 border border-slate-700 hover:border-amber-600 text-amber-300 rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  <span className="block font-bold">Hard</span>
                  <span className="text-[10px] text-slate-400 font-normal">2 days</span>
                </button>
                <button
                  onClick={() => handleRate('mastered')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-indigo-950/70 border border-slate-700 hover:border-indigo-600 text-indigo-300 rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  <span className="block font-bold">Good</span>
                  <span className="text-[10px] text-slate-400 font-normal">5 days</span>
                </button>
                <button
                  onClick={() => handleRate('mastered')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-emerald-950/70 border border-slate-700 hover:border-emerald-600 text-emerald-300 rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  <span className="block font-bold">Easy</span>
                  <span className="text-[10px] text-slate-400 font-normal">14 days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between px-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(true)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
              >
                Reveal Answer
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
