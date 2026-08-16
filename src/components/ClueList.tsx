import React from 'react';
import { Question } from '../types';
import { ArrowLeftRight, ArrowDownUp, CheckCircle2 } from 'lucide-react';

interface ClueListProps {
  questions: Question[];
  activeQuestionId: number | null;
  userAnswers: Record<number, string>;
  onSelectClue: (question: Question) => void;
}

export const ClueList: React.FC<ClueListProps> = ({
  questions,
  activeQuestionId,
  userAnswers,
  onSelectClue,
}) => {
  const horizontalQuestions = questions.filter((q) => q.dir === 'H');
  const verticalQuestions = questions.filter((q) => q.dir === 'V');

  const renderClueItem = (q: Question) => {
    const isActive = q.id === activeQuestionId;
    const userAns = userAnswers[q.id] || '';
    const isFilled = userAns.length === q.word.length;

    return (
      <div
        key={q.id}
        onClick={() => onSelectClue(q)}
        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 items-start ${
          isActive
            ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-amber-400/80 shadow-lg shadow-amber-500/10 scale-[1.01]'
            : isFilled
            ? 'bg-slate-800/60 border-indigo-500/30 hover:border-indigo-400'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
            isActive
              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
              : isFilled
              ? 'bg-indigo-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          {q.number}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm font-medium leading-relaxed ${
              isActive ? 'text-amber-200 font-semibold' : 'text-slate-200'
            }`}
          >
            {q.clue}
          </p>

          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-slate-400 font-mono">({q.word.length} huruf)</span>
            {isFilled ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Terisi ({userAns.length}/{q.word.length})
              </span>
            ) : userAns.length > 0 ? (
              <span className="text-amber-400 font-medium">
                Terisi {userAns.length}/{q.word.length}
              </span>
            ) : (
              <span className="text-slate-500 italic">Belum diisi</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mendatar (Across) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/30 shadow-xl flex flex-col h-full">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-indigo-500/20 text-indigo-300 font-bold text-sm uppercase tracking-wider">
          <ArrowLeftRight className="w-4 h-4 text-amber-400" />
          <span>PETUNJUK MENDATAR</span>
          <span className="ml-auto text-xs font-mono bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-300">
            {horizontalQuestions.length} Soal
          </span>
        </div>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {horizontalQuestions.map(renderClueItem)}
        </div>
      </div>

      {/* Menurun (Down) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/30 shadow-xl flex flex-col h-full">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-indigo-500/20 text-indigo-300 font-bold text-sm uppercase tracking-wider">
          <ArrowDownUp className="w-4 h-4 text-amber-400" />
          <span>PETUNJUK MENURUN</span>
          <span className="ml-auto text-xs font-mono bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-300">
            {verticalQuestions.length} Soal
          </span>
        </div>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {verticalQuestions.map(renderClueItem)}
        </div>
      </div>
    </div>
  );
};
