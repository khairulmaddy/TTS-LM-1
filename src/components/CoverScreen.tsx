import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Play, Sparkles, BookOpen, AlertCircle, RotateCcw } from 'lucide-react';
import { SUBJECT_NAME } from '../data/questions';
import { getStudentAttemptCount, getStudentAttempts } from '../utils/storage';
import { StudentAttempt } from '../types';

interface CoverScreenProps {
  onStartQuiz: (name: string, studentClass: string, attemptNum: number) => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStartQuiz }) => {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [existingAttempts, setExistingAttempts] = useState<StudentAttempt[]>([]);
  const [nextAttemptNum, setNextAttemptNum] = useState<number>(1);

  // Check attempt count whenever name or class changes
  useEffect(() => {
    if (name.trim() && studentClass.trim()) {
      const attempts = getStudentAttempts(name.trim(), studentClass.trim());
      setExistingAttempts(attempts);
      const count = attempts.length;
      if (count >= 3) {
        setNextAttemptNum(3);
      } else {
        setNextAttemptNum(count + 1);
      }
    } else {
      setExistingAttempts([]);
      setNextAttemptNum(1);
    }
  }, [name, studentClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Harap masukkan Nama Lengkap Siswa.');
      return;
    }

    if (!studentClass.trim()) {
      setErrorMsg('Harap masukkan Kelas Siswa (contoh: XI BDP 1, XI AKL 1).');
      return;
    }

    const currentCount = getStudentAttemptCount(name.trim(), studentClass.trim());
    if (currentCount >= 3) {
      setErrorMsg('Anda sudah menggunakan 3 kali kesempatan kuis untuk Nama dan Kelas ini.');
      return;
    }

    onStartQuiz(name.trim(), studentClass.trim(), currentCount + 1);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Glowing Gradient Accent Balls */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/30 blur-[100px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Cover Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-indigo-500/30 shadow-2xl shadow-indigo-950/50">
          
          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-4 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Sistem Penilaian TTS Interaktif</span>
            </div>

            <div className="inline-block mt-1">
              <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[2px] shadow-lg shadow-indigo-500/25">
                <div className="bg-slate-900 px-4 py-1.5 rounded-[14px]">
                  <p className="text-xs uppercase tracking-wider text-indigo-400 font-bold">MATA PELAJARAN</p>
                  <p className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-300 via-white to-pink-300 bg-clip-text text-transparent">
                    {SUBJECT_NAME}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Nama Siswa Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Nama Lengkap Siswa <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ketik nama lengkap Anda..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium text-base shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Form Isian Kelas Kosong (Blank Text Input) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Kelas Siswa <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Ketik kelas Anda (contoh: XI BDP 1, XI AKL 2)..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 focus:border-indigo-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium text-base shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Previous Attempts Status Badge */}
            {name.trim() && studentClass.trim() && (
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm space-y-2">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>Status Kesempatan Ujian</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                    Kesempatan Ke-{nextAttemptNum} dari 3
                  </span>
                </div>
                {existingAttempts.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-slate-300 font-medium">Riwayat pengerjaan sebelumnya:</p>
                    {existingAttempts.map((att, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                        <span>Kesempatan {att.attemptNumber}</span>
                        <span className="font-bold text-emerald-400">Skor: {att.score}/100</span>
                        <span className="text-slate-400">({Math.floor(att.durationSeconds / 60)}m {att.durationSeconds % 60}d)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">
                    Anda belum pernah mengambil ujian ini. Anda memiliki 3 kesempatan pengerjaan.
                  </p>
                )}
              </div>
            )}

            {/* Rules Briefing */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <p className="font-bold text-indigo-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Ketentuan Pengerjaan TTS:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Siswa memiliki maksimal <strong>3 Kesempatan</strong> pengerjaan.</li>
                <li><strong>Kesempatan 1 & 2</strong>: Setelah selesai, dapat melihat kunci jawaban dan pembahasan detail.</li>
                <li><strong>Kesempatan 3 (Terakhir)</strong>: Soal diacak. Menampilkan skor akhir dan jumlah Benar/Salah.</li>
                <li>Timer otomatis mencatat durasi waktu dari saat tombol Mulai ditekan.</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              disabled={existingAttempts.length >= 3}
              className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
                existingAttempts.length >= 3
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {existingAttempts.length >= 3 ? (
                <span>Kesempatan Sudah Habis (3/3)</span>
              ) : existingAttempts.length > 0 ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>Mulai Kesempatan Ke-{nextAttemptNum}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Mulai Kerjakan TTS</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
