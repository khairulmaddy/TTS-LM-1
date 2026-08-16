import React, { useRef, useEffect } from 'react';
import { GRID_ROWS, GRID_COLS } from '../data/questions';
import { ActiveSelection, Question } from '../types';
import { ArrowLeftRight, ArrowDownUp } from 'lucide-react';

interface CrosswordGridProps {
  gridState: string[][]; // 14 x 15 array of user characters
  questions: Question[];
  activeSelection: ActiveSelection;
  onSelectCell: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, char: string) => void;
  onToggleDirection: () => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  gridState,
  questions,
  activeSelection,
  onSelectCell,
  onCellChange,
  onToggleDirection,
}) => {
  const cellRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null))
  );

  // Map to store question start numbers and playable cells
  const numberMap: Record<string, number> = {};
  const activeWordCells = new Set<string>();

  // Determine which cells belong to which questions
  questions.forEach((q) => {
    numberMap[`${q.row},${q.col}`] = q.number;
  });

  // Highlight cells of current active question
  const currentQuestion = questions.find((q) => q.id === activeSelection.questionId);
  if (currentQuestion) {
    for (let i = 0; i < currentQuestion.word.length; i++) {
      const r = currentQuestion.dir === 'H' ? currentQuestion.row : currentQuestion.row + i;
      const c = currentQuestion.dir === 'H' ? currentQuestion.col + i : currentQuestion.col;
      activeWordCells.add(`${r},${c}`);
    }
  }

  // Auto-focus input element when selection changes
  useEffect(() => {
    const { row, col } = activeSelection;
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
      const el = cellRefs.current[row][col];
      if (el) {
        el.focus();
        el.select();
      }
    }
  }, [activeSelection.row, activeSelection.col, activeSelection.direction]);

  // Handle Keyboard Navigation inside the grid
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveFocus(row, col + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveFocus(row, col - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(row + 1, col);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(row - 1, col);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (gridState[row][col] !== '') {
        onCellChange(row, col, '');
      } else {
        // Move back
        if (activeSelection.direction === 'H') {
          moveFocus(row, col - 1);
        } else {
          moveFocus(row - 1, col);
        }
      }
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      advanceToNextCell(row, col);
    }
  };

  const moveFocus = (r: number, c: number) => {
    if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
      // Check if cell is playable
      if (isCellPlayable(r, c)) {
        onSelectCell(r, c);
      }
    }
  };

  const advanceToNextCell = (r: number, c: number) => {
    if (activeSelection.direction === 'H') {
      let nc = c + 1;
      while (nc < GRID_COLS) {
        if (isCellPlayable(r, nc)) {
          onSelectCell(r, nc);
          break;
        }
        nc++;
      }
    } else {
      let nr = r + 1;
      while (nr < GRID_ROWS) {
        if (isCellPlayable(nr, c)) {
          onSelectCell(nr, c);
          break;
        }
        nr++;
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const val = e.target.value.toUpperCase();
    if (!val) {
      onCellChange(row, col, '');
      return;
    }
    // Take the last entered character if multiple typed
    const lastChar = val.slice(-1);
    if (/^[A-Z]$/.test(lastChar)) {
      onCellChange(row, col, lastChar);
      advanceToNextCell(row, col);
    }
  };

  const isCellPlayable = (r: number, c: number) => {
    return questions.some((q) => {
      if (q.dir === 'H') {
        return q.row === r && c >= q.col && c < q.col + q.word.length;
      } else {
        return q.col === c && r >= q.row && r < q.row + q.word.length;
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Direction & Status Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-full px-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-indigo-500/30">
          <span>Arah Pengerjaan:</span>
          <span className="text-amber-400 font-extrabold flex items-center gap-1 uppercase tracking-wider">
            {activeSelection.direction === 'H' ? (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                Mendatar
              </>
            ) : (
              <>
                <ArrowDownUp className="w-3.5 h-3.5 text-amber-400" />
                Menurun
              </>
            )}
          </span>
        </div>

        <button
          onClick={onToggleDirection}
          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          title="Ubah arah input cell (Mendatar / Menurun)"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Ubah Arah (Spasi)</span>
        </button>
      </div>

      {/* Grid Container */}
      <div className="w-full overflow-x-auto p-2 sm:p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 shadow-2xl">
        <div
          className="grid gap-1 min-w-[340px] sm:min-w-[500px] mx-auto select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((_, c) => {
              const playable = isCellPlayable(r, c);
              const cellKey = `${r},${c}`;
              const startNumber = numberMap[cellKey];
              const isSelected = activeSelection.row === r && activeSelection.col === c;
              const isInActiveWord = activeWordCells.has(cellKey);
              const userVal = gridState[r][c] || '';

              if (!playable) {
                return (
                  <div
                    key={cellKey}
                    className="aspect-square bg-slate-950/80 rounded-md border border-slate-900/60 pointer-events-none"
                  />
                );
              }

              return (
                <div
                  key={cellKey}
                  onClick={() => onSelectCell(r, c)}
                  className={`relative aspect-square rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center font-black ${
                    isSelected
                      ? 'bg-amber-300 ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 text-slate-950 z-20 scale-105 shadow-lg'
                      : isInActiveWord
                      ? 'bg-indigo-200 text-indigo-950 border-2 border-indigo-400 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-950 border border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {/* Start Number Label */}
                  {startNumber && (
                    <span
                      className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-extrabold leading-none ${
                        isSelected
                          ? 'text-slate-900 font-black'
                          : isInActiveWord
                          ? 'text-indigo-900 font-black'
                          : 'text-indigo-700 font-extrabold'
                      }`}
                    >
                      {startNumber}
                    </span>
                  )}

                  {/* Cell Letter Input */}
                  <input
                    ref={(el) => {
                      cellRefs.current[r][c] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={userVal}
                    onChange={(e) => handleInputChange(e, r, c)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    onFocus={() => onSelectCell(r, c)}
                    className={`w-full h-full text-center bg-transparent uppercase font-black focus:outline-none cursor-pointer ${
                      isSelected
                        ? 'text-slate-950 text-base sm:text-xl font-black'
                        : 'text-slate-950 text-sm sm:text-lg font-black'
                    }`}
                    style={{
                      caretColor: 'transparent',
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
