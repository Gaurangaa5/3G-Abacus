import { ColumnData, BeadData } from '../types';

export const TOTAL_COLUMNS = 14;
export const BEADS_PER_COLUMN = 9;

export interface ColumnDefinition {
  rightIndex: number; // 1 = rightmost, 14 = leftmost
  placeValue: number;
  isNegative: boolean;
  isHighlighted: boolean;
  label: string;
  name: string;
}

// Columns defined strictly according to place value system counted FROM THE RIGHT
export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  // Leftmost column (14th from right)
  { rightIndex: 14, placeValue: 10000000000, isNegative: false, isHighlighted: false, label: '10B', name: '10 Billions' },
  { rightIndex: 13, placeValue: 1000000000, isNegative: false, isHighlighted: false, label: '1B', name: 'Billions' },
  { rightIndex: 12, placeValue: 100000000, isNegative: false, isHighlighted: false, label: '100M', name: '100 Millions' },
  { rightIndex: 11, placeValue: 10000000, isNegative: false, isHighlighted: false, label: '10M', name: '10 Millions' },
  { rightIndex: 10, placeValue: 1000000, isNegative: false, isHighlighted: false, label: '1M', name: 'Millions' },
  { rightIndex: 9, placeValue: 100000, isNegative: false, isHighlighted: false, label: '100K', name: '100 Thousands' },
  { rightIndex: 8, placeValue: 10000, isNegative: false, isHighlighted: false, label: '10K', name: '10 Thousands' },
  { rightIndex: 7, placeValue: 1000, isNegative: false, isHighlighted: false, label: '1,000', name: 'Thousands' },
  { rightIndex: 6, placeValue: 100, isNegative: false, isHighlighted: false, label: '100', name: 'Hundreds' },
  // 5th from right = TENS (HIGHLIGHTED)
  { rightIndex: 5, placeValue: 10, isNegative: false, isHighlighted: true, label: '10', name: 'Tens' },
  // 4th from right = ONES (HIGHLIGHTED)
  { rightIndex: 4, placeValue: 1, isNegative: false, isHighlighted: true, label: '1', name: 'Ones' },
  // Negative columns (3rd, 2nd, 1st from right)
  { rightIndex: 3, placeValue: -100, isNegative: true, isHighlighted: false, label: '-100', name: 'Negative 100' },
  { rightIndex: 2, placeValue: -10, isNegative: true, isHighlighted: false, label: '-10', name: 'Negative 10' },
  { rightIndex: 1, placeValue: -1, isNegative: true, isHighlighted: false, label: '-1', name: 'Negative 1' },
];

export function createInitialColumns(): ColumnData[] {
  return COLUMN_DEFINITIONS.map((def, colIndex) => {
    const beads: BeadData[] = [];
    for (let b = 1; b <= BEADS_PER_COLUMN; b++) {
      beads.push({
        id: `col-${colIndex}-bead-${b}`,
        index: b, // 1 to 9 (from top to bottom)
        isRed: b === 5, // Exactly 5th bead is RED
        isUp: false, // Default state: all beads DOWN
      });
    }

    return {
      id: colIndex,
      rightIndex: def.rightIndex,
      placeValue: def.placeValue,
      isNegative: def.isNegative,
      isHighlighted: def.isHighlighted,
      label: def.label,
      name: def.name,
      upCount: 0,
      beads,
    };
  });
}

/**
 * Calculates total value of the abacus.
 * Positive place values: sum of (upCount * placeValue) for positive columns.
 * Negative place values: sum of (upCount * abs(placeValue)) for negative columns.
 */
export function calculateAbacusValue(columns: ColumnData[]): {
  positiveValue: number;
  negativeValue: number;
  netValue: number;
  onesCount: number;
  tensCount: number;
} {
  let positiveValue = 0;
  let negativeValue = 0;
  let onesCount = 0;
  let tensCount = 0;

  columns.forEach((col) => {
    if (col.isNegative) {
      negativeValue += col.upCount * Math.abs(col.placeValue);
    } else {
      positiveValue += col.upCount * col.placeValue;
      if (col.rightIndex === 4) {
        onesCount = col.upCount;
      }
      if (col.rightIndex === 5) {
        tensCount = col.upCount;
      }
    }
  });

  return {
    positiveValue,
    negativeValue,
    netValue: positiveValue - negativeValue,
    onesCount,
    tensCount,
  };
}
