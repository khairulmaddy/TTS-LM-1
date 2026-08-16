import { useState, useEffect } from 'react';
import { Question, ActiveSelection, StudentAttempt } from './types';
import {
  INITIAL_QUESTIONS,
  GRID_ROWS,
  GRID_COLS,
  SUBJECT_NAME,
} from './data/questions';
import { TopBar } from './components/TopBar';
import { CoverScreen } from './components/CoverScreen';
import { CrosswordGrid } from './components/CrosswordGrid';
import { ClueList } from './components/ClueList';
import { ResultsModal } from './components/ResultsModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { getStoredAttempts, saveAttemptRecord } from './utils/storage';
import { Send, RotateCcw } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'COVER' | 'QUIZ'>('COVER');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attemptNumber, setAttemptNumber] = useState<number>(1);

  // Questions state (can be shuffled on attempt 3)
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  // 14 x 15 Grid User Inputs State
  const [gridState, setGridState] = useState<string[][]>(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''))
  );

  // Active cell selection & direction
  const [activeSelection, setActiveSelection] = useState<ActiveSelection>({
    row: 0,
    col: 0,
    direction: 'H',
    questionId: 1,
  });

  // Stopwatch timer state
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Results & Admin State
  const [latestAttempt, setLatestAttempt] = useState<StudentAttempt | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [storedAttempts, setStoredAttempts] = useState<StudentAttempt[]>([]);

  // Load stored attempts on mount
  useEffect(() => {
    setStoredAttempts(getStoredAttempts());
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Start Quiz Handler
  const handleStartQuiz = (name: string, cls: string, attemptNum: number) => {
    setStudentName(name);
    setStudentClass(cls);
    setAttemptNumber(attemptNum);

    // If Attempt 3 (Terakhir), shuffle questions order
    if (attemptNum === 3) {
      const shuffled = [...INITIAL_QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } else {
      setQuestions(INITIAL_QUESTIONS);
    }

    // Reset grid & selection
    setGridState(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('')));
    const firstQ = questions[0] || INITIAL_QUESTIONS[0];
    setActiveSelection({
      row: firstQ.row,
      col: firstQ.col,
      direction: firstQ.dir,
      questionId: firstQ.id,
    });

    // Start timer & transition
    setDurationSeconds(0);
    setIsTimerRunning(true);
    setScreen('QUIZ');
  };

  // Cell Selection Handler
  const handleSelectCell = (r: number, c: number) => {
    // Find matching question for cell
    const currentDir = activeSelection.direction;

    // First check if cell belongs to question in current direction
    let match = questions.find((q) => {
      if (q.dir !== currentDir) return false;
      if (q.dir === 'H') return q.row === r && c >= q.col && c < q.col + q.word.length;
      return q.col === c && r >= q.row && r < q.row + q.word.length;
    });

    // Otherwise check other direction
    if (!match) {
      match = questions.find((q) => {
        if (q.dir === 'H') return q.row === r && c >= q.col && c < q.col + q.word.length;
        return q.col === c && r >= q.row && r < q.row + q.word.length;
      });
    }

    const nextDir = match ? match.dir : currentDir;
    setActiveSelection({
      row: r,
      col: c,
      direction: nextDir,
      questionId: match ? match.id : activeSelection.questionId,
    });
  };

  // Toggle Direction (Mendatar <-> Menurun)
  const handleToggleDirection = () => {
    const { row, col, direction } = activeSelection;
    const newDir = direction === 'H' ? 'V' : 'H';

    const match = questions.find((q) => {
      if (q.dir !== newDir) return false;
      if (q.dir === 'H') return q.row === row && col >= q.col && col < q.col + q.word.length;
      return q.col === col && row >= q.row && row < q.row + q.word.length;
    });

    setActiveSelection({
      row,
      col,
      direction: newDir,
      questionId: match ? match.id : activeSelection.questionId,
    });
  };

  // Cell Character Change Handler
  const handleCellChange = (r: number, c: number, char: string) => {
    setGridState((prev) => {
      const next = prev.map((rowArr) => [...rowArr]);
      next[r][c] = char.toUpperCase();
      return next;
    });
  };

  // Select Clue from List
  const handleSelectClue = (q: Question) => {
    setActiveSelection({
      row: q.row,
      col: q.col,
      direction: q.dir,
      questionId: q.id,
    });
  };

  // Extract User Answers from Grid
  const getUserAnswers = (): Record<number, string> => {
    const answers: Record<number, string> = {};

    questions.forEach((q) => {
      let word = '';
      for (let i = 0; i < q.word.length; i++) {
        const r = q.dir === 'H' ? q.row : q.row + i;
        const c = q.dir === 'H' ? q.col + i : q.col;
        word += (gridState[r][c] || '').toUpperCase();
      }
      answers[q.id] = word;
    });

    return answers;
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);

    const userAnswers = getUserAnswers();
    let correctCount = 0;

    questions.forEach((q) => {
      const userWord = userAnswers[q.id] || '';
      if (userWord.toUpperCase().trim() === q.word.toUpperCase().trim()) {
        correctCount++;
      }
    });

    const totalQ = questions.length;
    const wrongCount = totalQ - correctCount;
    const score = Math.round((correctCount / totalQ) * 100);

    const newAttempt: StudentAttempt = {
      id: `att_${Date.now()}`,
      studentName,
      studentClass,
      subject: SUBJECT_NAME,
      attemptNumber,
      score,
      correctCount,
      wrongCount,
      durationSeconds,
      completedAt: new Date().toLocaleString('id-ID'),
      answers: userAnswers,
    };

    // Save to database
    saveAttemptRecord(newAttempt);
    setStoredAttempts(getStoredAttempts());
    setLatestAttempt(newAttempt);
    setShowResultModal(true);
  };

  // Next Attempt Handler from Results Modal
  const handleNextAttempt = () => {
    setShowResultModal(false);
    if (attemptNumber < 3) {
      handleStartQuiz(studentName, studentClass, attemptNumber + 1);
    } else {
      setScreen('COVER');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <TopBar
        subject={SUBJECT_NAME}
        studentName={studentName}
        studentClass={studentClass}
        attemptNumber={attemptNumber}
        durationSeconds={durationSeconds}
        isQuizActive={screen === 'QUIZ'}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogoutAdmin={() => setIsAdminLoggedIn(false)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {screen === 'COVER' ? (
          <CoverScreen onStartQuiz={handleStartQuiz} />
        ) : (
          <div className="space-y-6">
            {/* Active Attempt Banner */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Ujian Teka Teki Silang
                </span>
                <h2 className="text-lg font-black text-white">
                  {studentName} <span className="text-indigo-300 font-medium">({studentClass})</span>
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                  Kesempatan Ke-{attemptNumber} dari 3
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Jawaban</span>
                </button>
              </div>
            </div>

            {/* Interactive 14x15 Crossword Grid */}
            <CrosswordGrid
              gridState={gridState}
              questions={questions}
              activeSelection={activeSelection}
              onSelectCell={handleSelectCell}
              onCellChange={handleCellChange}
              onToggleDirection={handleToggleDirection}
            />

            {/* Clues List (Mendatar & Menurun) */}
            <ClueList
              questions={questions}
              activeQuestionId={activeSelection.questionId}
              userAnswers={getUserAnswers()}
              onSelectClue={handleSelectClue}
            />

            {/* Bottom Action Bar */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-900">
              <button
                onClick={() => setScreen('COVER')}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                ← Kembali ke Sampul
              </button>

              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-black text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Selesaikan & Lihat Nilai</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Results & Discussion Modal */}
      {showResultModal && latestAttempt && (
        <ResultsModal
          attempt={latestAttempt}
          questions={questions}
          onNextAttempt={handleNextAttempt}
          onGoHome={() => {
            setShowResultModal(false);
            setScreen('COVER');
          }}
        />
      )}

      {/* Admin Portal Modal & Excel Exporter */}
      <AdminPortal
        isOpen={isAdminOpen}
        isAdminLoggedIn={isAdminLoggedIn}
        attempts={storedAttempts}
        questions={INITIAL_QUESTIONS}
        onClose={() => setIsAdminOpen(false)}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
        onLogout={() => setIsAdminLoggedIn(false)}
        onRefreshData={() => setStoredAttempts(getStoredAttempts())}
      />

      {/* Footer Requirement */}
      <Footer />
    </div>
  );
}
