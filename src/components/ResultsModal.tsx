import React from 'react';
import { StudentAttempt, Question } from '../types';
import { Award, CheckCircle, XCircle, Clock, BookOpen, RotateCcw, Home, Sparkles } from 'lucide-react';

interface ResultsModalProps {
  attempt: StudentAttempt;
  questions: Question[];
  onNextAttempt: () => void;
  onGoHome: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  attempt,
  questions,
  onNextAttempt,
  onGoHome,
}) => {
  const isFinalAttempt = attempt.attemptNumber >= 3;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} menit ${secs} detik`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Banner */}
        <div className="text-center pb-6 border-b border-slate-800 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hasil Evaluasi Ujian TTS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {attempt.studentName}
          </h2>
          <p className="text-sm text-indigo-300 font-medium mt-1">
            Kelas: <span className="font-bold text-white">{attempt.studentClass}</span> | Kesempatan Ke-
            <span className="font-extrabold text-amber-400">{attempt.attemptNumber}</span> dari 3
          </p>
        </div>

        {/* Score Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 shrink-0">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-indigo-500/20 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NILAI AKHIR</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{attempt.score}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">skor maksimal 100</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/20 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              BENAR
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{attempt.correctCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">soal benar</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-rose-500/20 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              SALAH
            </p>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{attempt.wrongCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">soal salah/kosong</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-500/20 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              WAKTU
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-amber-300 mt-2 font-mono">
              {formatDuration(attempt.durationSeconds)}
            </p>
          </div>
        </div>

        {/* Pembahasan Section for Kesempatan 1 & 2 */}
        {!isFinalAttempt ? (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar my-2 space-y-4">
            <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>Pembahasan Kesempatan {attempt.attemptNumber}:</strong> Pelajari pembahasan di bawah ini untuk mempersiapkan Kesempatan berikutnya!
              </span>
            </div>

            <div className="space-y-3">
              {questions.map((q) => {
                const userAns = (attempt.answers[q.id] || '').toUpperCase().trim();
                const isCorrect = userAns === q.word.toUpperCase().trim();

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-slate-800/60 border-emerald-500/30'
                        : 'bg-slate-800/90 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {q.number}
                        </span>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Soal {q.number} ({q.dir === 'H' ? 'Mendatar' : 'Menurun'})
                        </span>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> BENAR
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> SALAH
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 font-medium mb-3">
                      {q.clue}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3 font-mono">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Jawaban Anda:</span>
                        <span
                          className={`font-bold text-sm ${
                            isCorrect ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {userAns || '(Kosong)'}
                        </span>
                      </div>

                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Kunci Jawaban:</span>
                        <span className="font-bold text-sm text-amber-400">{q.word}</span>
                      </div>
                    </div>

                    {/* Pembahasan Box */}
                    <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                      <span className="font-bold text-amber-300 block mb-0.5">📌 Pembahasan:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Ujian TTS Selesai!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Anda telah menyelesaikan seluruh 3 Kesempatan pengerjaan. Rekapitulasi nilai Anda telah tercatat otomatis di database admin.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </button>

          {!isFinalAttempt && (
            <button
              onClick={onNextAttempt}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Lanjut Kesempatan Ke-{attempt.attemptNumber + 1}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
