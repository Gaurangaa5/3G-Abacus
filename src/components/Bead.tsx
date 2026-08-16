import React from 'react';
import { BeadData } from '../types';

interface BeadProps {
  bead: BeadData;
  isUp: boolean;
  columnUpCount: number;
  totalBeadsInCol?: number;
  onBeadClick: (beadIndex: number) => void;
  isColumnHighlighted?: boolean;
}

export const Bead: React.FC<BeadProps> = ({
  bead,
  isUp,
  onBeadClick,
}) => {
  const isRed = bead.isRed;

  return (
    <div
      id={`bead-item-${bead.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onBeadClick(bead.index);
      }}
      className={`
        relative w-full cursor-pointer select-none transition-transform duration-200 ease-out
        group focus:outline-none
      `}
      style={{
        height: '28px',
        margin: '1px 0',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Bead ${bead.index}, ${isRed ? 'Red' : 'Ivory'}, ${isUp ? 'UP' : 'DOWN'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBeadClick(bead.index);
        }
      }}
    >
      <svg
        viewBox="0 0 70 32"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transform transition-transform group-hover:scale-105 active:scale-95 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Ivory Bead Gradients */}
          <linearGradient id={`ivory-top-${bead.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffaed" />
            <stop offset="40%" stopColor="#f7eccd" />
            <stop offset="85%" stopColor="#ecdcb3" />
            <stop offset="100%" stopColor="#dfcb9d" />
          </linearGradient>

          <linearGradient id={`ivory-bot-${bead.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dfcb9d" />
            <stop offset="35%" stopColor="#caa467" />
            <stop offset="70%" stopColor="#b08b4f" />
            <stop offset="100%" stopColor="#8d6e3c" />
          </linearGradient>

          <radialGradient id={`ivory-highlight-${bead.id}`} cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#fff8e7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#eedcae" stopOpacity="0" />
          </radialGradient>

          {/* Red Bead (5th) Gradients */}
          <linearGradient id={`red-top-${bead.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff7b7b" />
            <stop offset="35%" stopColor="#ee2a2a" />
            <stop offset="85%" stopColor="#cc1414" />
            <stop offset="100%" stopColor="#aa0d0d" />
          </linearGradient>

          <linearGradient id={`red-bot-${bead.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#aa0d0d" />
            <stop offset="40%" stopColor="#800606" />
            <stop offset="80%" stopColor="#5a0404" />
            <stop offset="100%" stopColor="#3b0101" />
          </linearGradient>

          <radialGradient id={`red-highlight-${bead.id}`} cx="50%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#ff6060" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cc1010" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Diamond / Bi-conical Abacus Bead Shape */}
        {/* Top Half Facet */}
        <polygon
          points="8,1 62,1 69,16 1,16"
          fill={isRed ? `url(#red-top-${bead.id})` : `url(#ivory-top-${bead.id})`}
          stroke={isRed ? '#600505' : '#735c34'}
          strokeWidth="0.7"
        />

        {/* Bottom Half Facet */}
        <polygon
          points="1,16 69,16 62,31 8,31"
          fill={isRed ? `url(#red-bot-${bead.id})` : `url(#ivory-bot-${bead.id})`}
          stroke={isRed ? '#400202' : '#574222'}
          strokeWidth="0.7"
        />

        {/* Specular Radial Highlight Overlay */}
        <ellipse
          cx="35"
          cy="12"
          rx="24"
          ry="7"
          fill={isRed ? `url(#red-highlight-${bead.id})` : `url(#ivory-highlight-${bead.id})`}
        />

        {/* Sharp Center Equator Ridge Line */}
        <line
          x1="1"
          y1="16"
          x2="69"
          y2="16"
          stroke={isRed ? '#ff9e9e' : '#fffdf5'}
          strokeWidth="1.2"
          strokeOpacity="0.85"
        />
        <line
          x1="2"
          y1="17.2"
          x2="68"
          y2="17.2"
          stroke={isRed ? '#4d0202' : '#695128'}
          strokeWidth="0.8"
          strokeOpacity="0.9"
        />

        {/* Central Rod Hole Indentation */}
        <ellipse
          cx="35"
          cy="2.5"
          rx="4.5"
          ry="1.8"
          fill="#332412"
          opacity="0.8"
        />
        <ellipse
          cx="35"
          cy="29.5"
          rx="4.5"
          ry="1.8"
          fill="#1f150b"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
