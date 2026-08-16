import React from 'react';
import { ColumnData } from '../types';
import { Column } from './Column';

interface AbacusFrameProps {
  columns: ColumnData[];
  onColumnBeadClick: (columnIndex: number, beadIndex: number) => void;
  onClearColumn: (columnIndex: number) => void;
  highlightedColIndices?: number[];
}

export const AbacusFrame: React.FC<AbacusFrameProps> = ({
  columns,
  onColumnBeadClick,
  onClearColumn,
  highlightedColIndices = [],
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Glossy Outer Frame Container */}
      <div
        id="abacus-outer-frame"
        className="
          relative w-full rounded-2xl p-3 sm:p-5
          bg-gradient-to-b from-[#2a2a2e] via-[#141416] to-[#0d0d0f]
          shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.8)]
          border-4 border-[#323238] overflow-x-auto
        "
      >
        {/* Decorative Top Rivets / Screws (matching reference image) */}
        <div className="absolute top-2 left-6 right-6 flex justify-between pointer-events-none opacity-60">
          {[...Array(9)].map((_, i) => (
            <div
              key={`rivet-top-${i}`}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-800 shadow-sm border border-neutral-700"
            />
          ))}
        </div>

        {/* Decorative Bottom Rivets */}
        <div className="absolute bottom-2 left-6 right-6 flex justify-between pointer-events-none opacity-60">
          {[...Array(9)].map((_, i) => (
            <div
              key={`rivet-bot-${i}`}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-neutral-300 via-neutral-500 to-neutral-800 shadow-sm border border-neutral-700"
            />
          ))}
        </div>

        {/* Inner Bezel / Dark Interior Well */}
        <div
          id="abacus-inner-well"
          className="
            relative rounded-xl p-2 sm:p-3
            bg-gradient-to-b from-[#111113] via-[#09090b] to-[#121214]
            shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),inset_0_-2px_6px_rgba(255,255,255,0.05)]
            border border-[#222226] min-w-[620px]
          "
        >
          {/* Subtle Top & Bottom Bezel Inner Rail */}
          <div className="w-full h-1.5 bg-gradient-to-r from-[#202024] via-[#3a3a42] to-[#202024] rounded-full mb-1 opacity-80" />

          {/* 14 Columns Container */}
          <div className="relative flex justify-between items-center gap-1 sm:gap-1.5 w-full">
            {columns.map((col) => {
              const isLessonTargetCol = highlightedColIndices.includes(col.id);
              return (
                <Column
                  key={`col-${col.id}`}
                  column={col}
                  onColumnBeadClick={onColumnBeadClick}
                  onClearColumn={onClearColumn}
                  isLessonHighlight={isLessonTargetCol}
                />
              );
            })}
          </div>

          {/* Lower Support Rail / Beam across all columns */}
          <div className="w-full h-2 bg-gradient-to-b from-[#2a2a30] via-[#1a1a1e] to-[#0a0a0c] rounded-full mt-1 border-t border-[#3a3a44]/50 shadow-inner flex items-center justify-around px-4">
            {columns.map((c) => (
              <div
                key={`rod-socket-${c.id}`}
                className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700 shadow-inner"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Visual Guide below the frame */}
      <div className="w-full flex items-center justify-between text-xs text-neutral-400 mt-2 px-2 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
            <span className="text-neutral-300 font-medium">Gold Highlights:</span>
            <span>4th & 5th from Right (Ones & Tens)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-sm"></span>
            <span className="text-neutral-300 font-medium">5th Bead:</span>
            <span>Red Marker</span>
          </span>
        </div>
        <div className="text-neutral-400 hidden sm:block">
          Click any bead to move group UP &bull; Click top bead to return DOWN
        </div>
      </div>
    </div>
  );
};
