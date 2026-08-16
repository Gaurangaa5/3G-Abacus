import React, { useEffect } from 'react';
import { LessonState } from '../types';

interface LessonsViewProps {
  lesson: LessonState;
  currentAbacusValue: number;
  onesCount: number;
  tensCount: number;
  onSubmit: () => void;
  onHintToggle: () => void;
  onStopLessons: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  lesson,
  currentAbacusValue,
  onesCount,
  tensCount,
  onSubmit,
  onHintToggle,
  onStopLessons,
}) => {
  const target = lesson.targetNumber;
  const targetTens = Math.floor(target / 10);
  const targetOnes = target % 10;

  // Listen to Enter key for instant submission during lessons
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit]);

  const isMatch = currentAbacusValue === target;

  return (
    <div
      id="lessons-dashboard"
      className="w-full max-w-4xl mx-auto mb-4 px-4 select-none"
    >
      <div
        className="
          rounded-2xl p-5 sm:p-6
          bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#141824]
          border-2 border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.7)]
          flex flex-col gap-5
        "
      >
        {/* Top Header Row: Lesson Status, Score & Stop Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Interactive Practice Mode
              </h2>
              <p className="text-xs text-neutral-400">
                Configure the abacus to match the target number using the 1s and 10s columns.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Score & Streak Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700">
                <span className="text-neutral-400 mr-1.5">Score:</span>
                <span className="font-bold text-amber-400">{lesson.score}</span>
              </div>
              <div className="bg-neutral-800/80 px-3 py-1.5 rounded-lg border border-neutral-700">
                <span className="text-neutral-400 mr-1.5">Streak:</span>
                <span className="font-bold text-emerald-400">🔥 {lesson.streak}</span>
              </div>
            </div>

            {/* STOP LESSONS BUTTON */}
            <button
              id="stop-lessons-btn"
              onClick={onStopLessons}
              className="
                px-3.5 py-1.5 rounded-lg text-xs font-semibold
                bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100
                border border-rose-800/60 transition-colors shadow-sm
              "
            >
              Stop Lessons
            </button>
          </div>
        </div>

        {/* Main Target & Current Values Comparison Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TARGET NUMBER PANEL */}
          <div className="rounded-xl p-4 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 border border-amber-500/30 flex flex-col items-center justify-center text-center">
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              MAKE THIS NUMBER
            </div>
            <div
              id="lesson-target-number"
              className="text-6xl sm:text-7xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
            >
              {target}
            </div>
            <div className="mt-2 text-xs text-neutral-400 flex items-center gap-2">
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                Tens: <b className="text-amber-300">{targetTens}</b>
              </span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                Ones: <b className="text-amber-300">{targetOnes}</b>
              </span>
            </div>
          </div>

          {/* CURRENT ABACUS VALUE PANEL */}
          <div className="rounded-xl p-4 bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center">
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">
              YOUR CURRENT VALUE
            </div>
            <div
              id="lesson-current-number"
              className={`text-6xl sm:text-7xl font-black font-mono tracking-tight transition-colors duration-150 ${
                isMatch ? 'text-emerald-400 drop-shadow-[0_4px_12px_rgba(52,211,153,0.3)]' : 'text-white'
              }`}
            >
              {currentAbacusValue}
            </div>
            <div className="mt-2 text-xs text-neutral-400 flex items-center gap-2">
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                Your Tens: <b className="text-neutral-200">{tensCount}</b>
              </span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                Your Ones: <b className="text-neutral-200">{onesCount}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Alert if user submitted */}
        {lesson.feedbackMessage && (
          <div
            id="lesson-feedback-message"
            className={`
              p-3.5 rounded-xl text-sm font-semibold flex items-center justify-between
              transition-all duration-200
              ${
                lesson.isCorrect
                  ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-emerald-950/50 shadow-lg'
                  : 'bg-rose-950/80 text-rose-200 border border-rose-500/40'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{lesson.isCorrect ? '🎉' : '⚠️'}</span>
              <span>{lesson.feedbackMessage}</span>
            </div>
            {lesson.isCorrect && (
              <span className="text-xs text-emerald-300 animate-pulse">
                Next question loading automatically...
              </span>
            )}
          </div>
        )}

        {/* Interactive Controls: SUBMIT and HINT */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            id="lesson-hint-btn"
            onClick={onHintToggle}
            className="
              px-4 py-2.5 rounded-xl text-xs font-semibold
              bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white
              border border-neutral-700 transition-colors flex items-center gap-1.5
            "
          >
            <span>💡</span>
            <span>{lesson.hintVisible ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 hidden sm:inline">
              (or press <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-300 font-mono">ENTER</kbd>)
            </span>

            <button
              id="lesson-submit-btn"
              onClick={onSubmit}
              className="
                px-7 py-3 rounded-xl text-sm font-bold tracking-wide
                bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500
                text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-95
                transition-all duration-150 flex items-center gap-2
              "
            >
              <span>SUBMIT ANSWER</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* HINT CONTENT (revealed when user clicks Hint) */}
        {lesson.hintVisible && (
          <div
            id="lesson-hint-box"
            className="rounded-xl p-4 bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed animate-fadeIn"
          >
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <span>💡 Step-by-Step Breakdown for {target}:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1">
              <li>
                <span className="font-semibold text-amber-300">Tens Digit = {targetTens}:</span> Move{' '}
                <strong className="text-white">{targetTens}</strong> beads UP in the{' '}
                <strong className="text-amber-400">5th column from the right (10s)</strong>.
              </li>
              <li>
                <span className="font-semibold text-amber-300">Ones Digit = {targetOnes}:</span> Move{' '}
                <strong className="text-white">{targetOnes}</strong> beads UP in the{' '}
                <strong className="text-amber-400">4th column from the right (1s)</strong>.
              </li>
              <li>
                Formula:{' '}
                <span className="font-mono text-amber-200">
                  ({targetTens} × 10) + ({targetOnes} × 1) = {target}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
