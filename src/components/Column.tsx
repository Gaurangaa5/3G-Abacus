import React from 'react';
import { ColumnData } from '../types';
import { Bead } from './Bead';

interface ColumnProps {
  column: ColumnData;
  onColumnBeadClick: (columnIndex: number, beadIndex: number) => void;
  onClearColumn?: (columnIndex: number) => void;
  isLessonHighlight?: boolean;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onColumnBeadClick,
  onClearColumn,
  isLessonHighlight = false,
}) => {
  const upCount = column.upCount; // 0 to 9
  const isHighlighted = column.isHighlighted;

  const handleBeadClick = (beadIndex: number) => {
    onColumnBeadClick(column.id, beadIndex);
  };

  // 9 beads: beads 1..upCount are in the UP group, beads (upCount+1)..9 are in the DOWN group
  const upBeads = column.beads.slice(0, upCount);
  const downBeads = column.beads.slice(upCount);

  return (
    <div
      id={`abacus-column-${column.id}`}
      className={`
        relative flex flex-col items-center flex-1 min-w-[28px] max-w-[54px] h-[370px]
        px-[2px] transition-all duration-300 rounded-md select-none
        ${isHighlighted ? 'bg-amber-400/5 ring-1 ring-amber-400/30' : ''}
        ${isLessonHighlight ? 'bg-amber-400/15 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]' : ''}
        ${column.isNegative ? 'bg-rose-500/5' : ''}
      `}
    >
      {/* Top Place-Value Tag / Indicator */}
      <div className="w-full flex flex-col items-center pb-1 pt-0.5 z-20">
        <div
          className={`
            px-1 py-0.5 rounded text-[11px] font-bold tracking-tight text-center leading-none
            transition-colors duration-200 shadow-sm
            ${
              isLessonHighlight
                ? 'bg-amber-400 text-neutral-950 font-black shadow-amber-400/50 shadow-md scale-110'
                : isHighlighted
                ? 'bg-amber-500/90 text-neutral-950 font-bold'
                : column.isNegative
                ? 'bg-rose-900/60 text-rose-300 border border-rose-700/40 text-[9px]'
                : 'bg-neutral-800/80 text-neutral-300 text-[10px]'
            }
          `}
          title={`${column.name} (Place Value: ${column.placeValue})`}
        >
          {column.label}
        </div>
      </div>

      {/* The Column Track containing the Rod & Sliding Beads */}
      <div className="relative w-full flex-1 flex flex-col justify-between overflow-hidden py-1">
        {/* Golden Wooden Vertical Rod */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[5px] rounded-full z-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #6c4b18 0%, #caa459 35%, #fff0b8 50%, #c19b4e 70%, #573a0e 100%)',
            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.5)',
          }}
        />

        {/* UP BEADS GROUP (Top group pushed up against upper frame) */}
        <div className="w-full flex flex-col items-center z-10 transition-all duration-200">
          {upBeads.map((bead) => (
            <Bead
              key={bead.id}
              bead={bead}
              isUp={true}
              columnUpCount={upCount}
              onBeadClick={handleBeadClick}
              isColumnHighlighted={isHighlighted || isLessonHighlight}
            />
          ))}
        </div>

        {/* Dynamic Physical Gap along the golden rod */}
        <div
          className="flex-1 w-full min-h-[30px] flex items-center justify-center cursor-pointer z-10 group/gap"
          onClick={() => {
            // Clicking the open rod gap: if beads are up, toggle or reset
            if (upCount > 0 && onClearColumn) {
              onClearColumn(column.id);
            }
          }}
          title={upCount > 0 ? "Click gap or top bead to return beads DOWN" : ""}
        >
          {/* Subtle hover indicator on gap */}
          <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/gap:opacity-20 transition-opacity">
            <div className="w-1 h-6 bg-white rounded-full"></div>
          </div>
        </div>

        {/* DOWN BEADS GROUP (Bottom group resting at bottom frame) */}
        <div className="w-full flex flex-col items-center z-10 transition-all duration-200">
          {downBeads.map((bead) => (
            <Bead
              key={bead.id}
              bead={bead}
              isUp={false}
              columnUpCount={upCount}
              onBeadClick={handleBeadClick}
              isColumnHighlighted={isHighlighted || isLessonHighlight}
            />
          ))}
        </div>
      </div>

      {/* Bottom Column Digit Value Badge */}
      <div className="w-full flex flex-col items-center pt-1 pb-0.5 z-20">
        <div
          className={`
            w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs
            transition-all duration-150 shadow-inner
            ${
              upCount > 0
                ? isHighlighted || isLessonHighlight
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-lg ring-1 ring-amber-300'
                  : 'bg-neutral-200 text-neutral-900'
                : 'bg-neutral-800/80 text-neutral-500'
            }
          `}
        >
          {upCount}
        </div>
      </div>
    </div>
  );
};
