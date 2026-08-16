import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isSoundOn,
  onToggleSound,
  onReset,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto pt-4 pb-2 px-4 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        {/* App Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center shadow-inner">
            <span className="text-xl">🧮</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Virtual 3G Abacus
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                Offline Mode
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              14 Columns &bull; 9 Beads per Column &bull; Place values from Right
            </p>
          </div>
        </div>

        {/* Navigation Tabs (ABACUS & LESSONS) & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Main Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 shadow-inner">
            <button
              id="tab-abacus"
              onClick={() => onTabChange('abacus')}
              className={`
                px-5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-150
                ${
                  activeTab === 'abacus'
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }
              `}
            >
              ABACUS
            </button>

            <button
              id="tab-lessons"
              onClick={() => onTabChange('lessons')}
              className={`
                px-5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-150 relative
                ${
                  activeTab === 'lessons'
                    ? 'bg-amber-500 text-neutral-950 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }
              `}
            >
              LESSONS
              {activeTab !== 'lessons' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className={`
              p-2 rounded-xl border text-xs transition-colors
              ${
                isSoundOn
                  ? 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:bg-neutral-800'
              }
            `}
            title={isSoundOn ? 'Mute sound effects' : 'Enable sound effects'}
            aria-label={isSoundOn ? 'Sound On' : 'Sound Off'}
          >
            {isSoundOn ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          {/* Reset Action */}
          <button
            id="header-reset-btn"
            onClick={onReset}
            className="p-2 rounded-xl border bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            title="Reset all beads (Hotkey: R)"
            aria-label="Reset Abacus"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
