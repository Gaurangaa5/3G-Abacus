import React from 'react';
import { ColumnData } from '../types';

interface NumberDisplayProps {
  columns: ColumnData[];
  positiveValue: number;
  negativeValue: number;
  netValue: number;
  onesCount: number;
  tensCount: number;
  onReset: () => void;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  columns,
  positiveValue,
  negativeValue,
  onesCount,
  tensCount,
  onReset,
}) => {
  // Format positive value with locale string
  const formattedValue = positiveValue.toLocaleString();

  // Find active columns with upCount > 0
  const activeCols = columns.filter((c) => c.upCount > 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-4">
      <div
        id="current-value-card"
        className="
          relative overflow-hidden rounded-xl p-5
          bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950
          border border-neutral-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6
        "
      >
        {/* Left Side: Large Current Value Display */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1">
            Current Value
          </div>
          <div className="flex items-baseline gap-3">
            <span
              id="live-abacus-number"
              className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)]"
            >
              {formattedValue}
            </span>

            {negativeValue > 0 && (
              <span className="text-rose-400 font-mono text-xl font-bold bg-rose-950/60 px-2 py-1 rounded border border-rose-800/50">
                Neg: -{negativeValue}
              </span>
            )}
          </div>

          {/* Tens and Ones Decomposition Highlight */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1 text-amber-300">
              <span className="font-semibold">Tens (5th from right):</span>
              <span className="font-bold text-amber-200 text-sm bg-amber-500/20 px-1.5 py-0.2 rounded">
                {tensCount}
              </span>
              <span className="text-neutral-400">(= {tensCount * 10})</span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1 text-amber-300">
              <span className="font-semibold">Ones (4th from right):</span>
              <span className="font-bold text-amber-200 text-sm bg-amber-500/20 px-1.5 py-0.2 rounded">
                {onesCount}
              </span>
              <span className="text-neutral-400">(= {onesCount * 1})</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Columns Calculation Equation & Quick Reset */}
        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
          {/* Active Math Expression */}
          <div className="text-xs text-neutral-400 mb-2 font-mono text-center md:text-right max-w-sm">
            {activeCols.length === 0 ? (
              <span className="italic text-neutral-500">All beads at rest (0)</span>
            ) : (
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
                {activeCols.map((c, idx) => (
                  <span
                    key={`math-${c.id}`}
                    className={`px-2 py-0.5 rounded border ${
                      c.isHighlighted
                        ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                        : c.isNegative
                        ? 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    {idx > 0 && <span className="text-neutral-500 mr-1">+</span>}
                    ({c.upCount} × {c.label})
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            id="reset-abacus-btn"
            onClick={onReset}
            className="
              px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide
              bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white
              border border-neutral-700 hover:border-neutral-600
              transition-all duration-150 active:scale-95 shadow-md flex items-center gap-2
            "
          >
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Abacus
          </button>
        </div>
      </div>
    </div>
  );
};
