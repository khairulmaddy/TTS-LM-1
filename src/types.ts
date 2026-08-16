export interface Question {
  id: number;
  number: number;
  word: string;
  clue: string;
  dir: 'H' | 'V'; // 'H' for Mendatar (Across), 'V' for Menurun (Down)
  row: number; // 0-indexed
  col: number; // 0-indexed
  explanation: string; // Pembahasan detail
}

export interface GridCellData {
  row: number;
  col: number;
  correctChar: string;
  userChar: string;
  number?: number;
  horizontalWordId?: number;
  verticalWordId?: number;
  isBlocked: boolean;
}

export interface StudentAttempt {
  id: string;
  studentName: string;
  studentClass: string;
  subject: string;
  attemptNumber: number; // 1, 2, or 3
  score: number; // 0 - 100
  correctCount: number;
  wrongCount: number;
  durationSeconds: number;
  completedAt: string; // ISO string or locale string
  answers: Record<number, string>; // word id -> user's word
}

export interface ActiveSelection {
  row: number;
  col: number;
  direction: 'H' | 'V';
  questionId: number | null;
}
