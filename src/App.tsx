import React, { useState, useEffect, useCallback } from 'react';
import { ColumnData, ActiveTab, LessonState } from './types';
import {
  createInitialColumns,
  calculateAbacusValue,
} from './utils/constants';
import {
  playBeadSound,
  playSuccessSound,
  playErrorSound,
  setSoundEnabled,
  isSoundEnabled,
} from './utils/audio';
import { Header } from './components/Header';
import { AbacusFrame } from './components/AbacusFrame';
import { NumberDisplay } from './components/NumberDisplay';
import { LessonsView } from './components/LessonsView';

export default function App() {
  const [columns, setColumns] = useState<ColumnData[]>(createInitialColumns);
  const [activeTab, setActiveTab] = useState<ActiveTab>('abacus');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [showRefGuide, setShowRefGuide] = useState<boolean>(false);

  // Lesson state
  const [lesson, setLesson] = useState<LessonState>({
    isActive: false,
    targetNumber: 69,
    currentNumber: 0,
    isCorrect: null,
    feedbackMessage: '',
    hintVisible: false,
    score: 0,
    streak: 0,
    totalAnswered: 0,
  });

  // Calculate live values
  const { positiveValue, negativeValue, netValue, onesCount, tensCount } =
    calculateAbacusValue(columns);

  // Helper to generate a new random target number (0-99)
  const generateRandomTarget = useCallback((previous?: number): number => {
    let nextNum: number;
    do {
      // Numbers between 1 and 99 emphasizing 1s and 10s place values
      nextNum = Math.floor(Math.random() * 99) + 1;
    } while (previous !== undefined && nextNum === previous);
    return nextNum;
  }, []);

  // Reset all columns to 0
  const handleResetAll = useCallback(() => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        upCount: 0,
        beads: col.beads.map((b) => ({ ...b, isUp: false })),
      }))
    );
    playBeadSound(9, false);
  }, []);

  // Clear a single column
  const handleClearColumn = useCallback((colId: number) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === colId) {
          return {
            ...col,
            upCount: 0,
            beads: col.beads.map((b) => ({ ...b, isUp: false })),
          };
        }
        return col;
      })
    );
    playBeadSound(5, false);
  }, []);

  // Grouped bead click handler
  const handleColumnBeadClick = useCallback(
    (colId: number, beadIndex: number) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== colId) return col;

          const currentUp = col.upCount;
          let newUp: number;

          if (beadIndex > currentUp) {
            // Clicked a DOWN bead: moves bead 1 through beadIndex UP
            newUp = beadIndex;
            playBeadSound(newUp - currentUp, true);
          } else {
            // Clicked an UP bead:
            if (beadIndex === 1) {
              // Clicking the top bead pushes the entire raised group DOWN
              newUp = 0;
              playBeadSound(currentUp, false);
            } else {
              // Clicking bead N pushes beads N..currentUp DOWN (beads 1..N-1 stay UP)
              newUp = beadIndex - 1;
              playBeadSound(currentUp - newUp, false);
            }
          }

          const updatedBeads = col.beads.map((b) => ({
            ...b,
            isUp: b.index <= newUp,
          }));

          return {
            ...col,
            upCount: newUp,
            beads: updatedBeads,
          };
        })
      );
    },
    []
  );

  // Switch tabs
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'lessons') {
      const initialTarget = generateRandomTarget();
      setLesson({
        isActive: true,
        targetNumber: initialTarget,
        currentNumber: positiveValue,
        isCorrect: null,
        feedbackMessage: '',
        hintVisible: false,
        score: 0,
        streak: 0,
        totalAnswered: 0,
      });
      handleResetAll();
    } else {
      setLesson((prev) => ({ ...prev, isActive: false }));
    }
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    setSoundEnabled(nextVal);
  };

  // Submit answer in lessons mode
  const handleLessonSubmit = useCallback(() => {
    if (positiveValue === lesson.targetNumber) {
      // Correct!
      playSuccessSound();
      const newStreak = lesson.streak + 1;
      const newScore = lesson.score + 10 + newStreak * 2;
      setLesson((prev) => ({
        ...prev,
        isCorrect: true,
        feedbackMessage: 'Correct! 🎉',
        streak: newStreak,
        score: newScore,
        totalAnswered: prev.totalAnswered + 1,
      }));

      // Automatically generate next random question after 1.2s delay
      setTimeout(() => {
        const nextTarget = generateRandomTarget(lesson.targetNumber);
        setLesson((prev) => ({
          ...prev,
          targetNumber: nextTarget,
          isCorrect: null,
          feedbackMessage: '',
          hintVisible: false,
        }));
        handleResetAll();
      }, 1200);
    } else {
      // Not quite
      playErrorSound();
      setLesson((prev) => ({
        ...prev,
        isCorrect: false,
        feedbackMessage: 'Not quite — try again!',
        streak: 0,
      }));
    }
  }, [positiveValue, lesson.targetNumber, lesson.streak, lesson.score, generateRandomTarget, handleResetAll]);

  // Stop lessons
  const handleStopLessons = () => {
    setLesson((prev) => ({
      ...prev,
      isActive: false,
      isCorrect: null,
      feedbackMessage: '',
    }));
    setActiveTab('abacus');
  };

  // Keyboard shortcut listener ('R' for reset, 'Enter' for submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResetAll]);

  // Target columns in lessons mode: Ones (id: 10, rightIndex: 4) & Tens (id: 9, rightIndex: 5)
  const lessonTargetCols = activeTab === 'lessons' ? [9, 10] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans select-none antialiased">
      {/* Top Header with Navigation Tabs & Sound Control */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isSoundOn={soundOn}
        onToggleSound={handleToggleSound}
        onReset={handleResetAll}
      />

      {/* Main Interactive Area */}
      <main className="flex-1 flex flex-col items-center justify-start py-2 px-2 max-w-6xl w-full mx-auto">
        {/* If in Lessons tab, render the interactive Lessons practice dashboard */}
        {activeTab === 'lessons' && (
          <LessonsView
            lesson={lesson}
            currentAbacusValue={positiveValue}
            onesCount={onesCount}
            tensCount={tensCount}
            onSubmit={handleLessonSubmit}
            onHintToggle={() =>
              setLesson((prev) => ({ ...prev, hintVisible: !prev.hintVisible }))
            }
            onStopLessons={handleStopLessons}
          />
        )}

        {/* The 14-Column Virtual 3G Abacus Frame */}
        <AbacusFrame
          columns={columns}
          onColumnBeadClick={handleColumnBeadClick}
          onClearColumn={handleClearColumn}
          highlightedColIndices={lessonTargetCols}
        />

        {/* Live Calculation Display and Decomposition */}
        <NumberDisplay
          columns={columns}
          positiveValue={positiveValue}
          negativeValue={negativeValue}
          netValue={netValue}
          onesCount={onesCount}
          tensCount={tensCount}
          onReset={handleResetAll}
        />

        {/* Place-Value Explainer & System Guide Accordion */}
        <div className="w-full max-w-4xl mx-auto mt-6 mb-8 px-4">
          <div className="rounded-xl bg-neutral-900/70 border border-neutral-800 p-4">
            <button
              onClick={() => setShowRefGuide(!showRefGuide)}
              className="w-full flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>📚</span>
                <span>3G Abacus Custom Place-Value Reference (Counted from the Right)</span>
              </div>
              <span className="text-neutral-500">{showRefGuide ? '▲ Collapse' : '▼ Expand Guide'}</span>
            </button>

            {showRefGuide && (
              <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-3 leading-relaxed">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg">
                    <div className="text-amber-400 font-bold">4th from Right: 1 (Ones)</div>
                    <div className="text-[11px] text-neutral-300">Default multiplier: ×1</div>
                  </div>
                  <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg">
                    <div className="text-amber-400 font-bold">5th from Right: 10 (Tens)</div>
                    <div className="text-[11px] text-neutral-300">Default multiplier: ×10</div>
                  </div>
                  <div className="bg-neutral-800/60 border border-neutral-700 p-2.5 rounded-lg">
                    <div className="text-neutral-200 font-bold">6th to 14th from Right</div>
                    <div className="text-[11px] text-neutral-400">100, 1K, 10K ... 10 Billion</div>
                  </div>
                  <div className="bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg">
                    <div className="text-rose-300 font-bold">1st, 2nd, 3rd from Right</div>
                    <div className="text-[11px] text-rose-400/80">Negative value columns</div>
                  </div>
                </div>

                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 space-y-1.5">
                  <div className="font-semibold text-neutral-200">How to Read and Operate:</div>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>
                      <strong>Grouped movement:</strong> Click any lower bead to slide it and all beads above it UP in that column.
                    </li>
                    <li>
                      <strong>Return beads DOWN:</strong> Click the top bead or open rod gap to return raised beads back DOWN.
                    </li>
                    <li>
                      <strong>9 beads per column:</strong> 4 Ivory (top) + 1 Red (5th bead) + 4 Ivory (bottom).
                    </li>
                    <li>
                      <strong>Example (57):</strong> Move 5 beads UP in Tens column (5th from right) + 7 beads UP in Ones column (4th from right).
                    </li>
                    <li>
                      <strong>Example (69):</strong> Move 6 beads UP in Tens column (5th from right) + 9 beads UP in Ones column (4th from right).
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-3 text-center text-[11px] text-neutral-600">
        Virtual 3G Abacus &bull; Designed for 100% Offline Standalone Operation
      </footer>
    </div>
  );
}
