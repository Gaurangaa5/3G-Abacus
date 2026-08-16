export type BeadColor = 'ivory' | 'red';

export interface BeadData {
  id: string;
  index: number; // 1 to 9 (from top to bottom)
  isRed: boolean; // true for 5th bead
  isUp: boolean;
}

export interface ColumnData {
  id: number; // 0 to 13 (left to right, 0 is leftmost, 13 is rightmost)
  rightIndex: number; // 1 to 14 (1 is rightmost, 14 is leftmost)
  placeValue: number; // 1, 10, 100, 1000, etc. or negative
  isNegative: boolean; // true for 1st, 2nd, 3rd from right
  isHighlighted: boolean; // true for 4th (1) and 5th (10) from right
  label: string;
  name: string;
  upCount: number; // 0 to 9 (number of beads currently UP)
  beads: BeadData[];
}

export type ActiveTab = 'abacus' | 'lessons';

export interface LessonState {
  isActive: boolean;
  targetNumber: number;
  currentNumber: number;
  isCorrect: boolean | null;
  feedbackMessage: string;
  hintVisible: boolean;
  score: number;
  streak: number;
  totalAnswered: number;
}
