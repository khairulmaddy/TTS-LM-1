import React, { useState } from 'react';
import { StudentAttempt, Question } from '../types';
import { exportToExcel } from '../utils/excel';
import { clearAllAttempts } from '../utils/storage';
import {
  ShieldCheck,
  Download,
  Search,
  Trash2,
  X,
  Eye,
  LogOut,
  Users,
  Award,
  Clock,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  isAdminLoggedIn: boolean;
  attempts: StudentAttempt[];
  questions: Question[];
  onClose: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  isAdminLoggedIn,
  attempts,
  questions,
  onClose,
  onLoginSuccess,
  onLogout,
  onRefreshData,
}) => {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [inspectAttempt, setInspectAttempt] = useState<StudentAttempt | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Default admin password verification
    if (password === 'admin123' || password === 'admin' || password === 'MADDY2026') {
      onLoginSuccess();
      setPassword('');
    } else {
      setLoginError('Kata sandi admin tidak valid.');
    }
  };

  // Filter attempts
  const uniqueClasses = Array.from(new Set(attempts.map((a) => a.studentClass))).filter(Boolean);

  const filteredAttempts = attempts.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || a.studentClass === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Calculate Statistics
  const totalSubmissions = attempts.length;
  const avgScore =
    totalSubmissions > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalSubmissions)
      : 0;
  const highestScore = totalSubmissions > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  const handleExport = () => {
    exportToExcel(filteredAttempts);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin menghapus SELURUH rekap nilai siswa dari database lokal ini?'
      )
    ) {
      clearAllAttempts();
      onRefreshData();
      setInspectAttempt(null);
    }
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Portal Rekapitulasi Admin</h2>
              <p className="text-xs text-indigo-300 font-medium">
                Mata Pelajaran: DIGITAL ON BOARDING
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN SCREEN (If not authenticated) */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <KeyRound className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">Login Otentikasi Admin</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
              Masukkan kata sandi khusus administrator untuk mengakses seluruh data rekapitulasi nilai dan mengunduh berkas Excel.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi admin..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-amber-500 rounded-xl text-white placeholder-slate-500 text-center font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                Masuk ke Laporan Admin
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD REPORT SCREEN (When Admin is logged in) */
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-indigo-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL PENYERAHAN
                  </p>
                  <p className="text-2xl font-black text-white mt-0.5">{totalSubmissions}</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    RATA-RATA NILAI
                  </p>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{avgScore}/100</p>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    SKOR TERTINGGI
                  </p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{highestScore}/100</p>
                </div>
              </div>
            </div>

            {/* Filter & Action Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex flex-1 w-full md:w-auto items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama siswa atau kelas..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Semua Kelas</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel (.xls)</span>
                </button>

                <button
                  onClick={handleClearData}
                  className="px-3 py-2 bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Kosongkan database lokal"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>

            {/* Student Records Table */}
            <div className="flex-1 overflow-auto border border-slate-800 rounded-2xl bg-slate-950/60 custom-scrollbar">
              {filteredAttempts.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  Belum ada data pengerjaan siswa yang tersimpan.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-[11px] font-extrabold uppercase text-indigo-300">
                    <tr>
                      <th className="px-4 py-3 text-center">No</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3 text-center">Kesempatan</th>
                      <th className="px-4 py-3 text-center">Nilai</th>
                      <th className="px-4 py-3 text-center">B / S</th>
                      <th className="px-4 py-3 text-center">Durasi</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAttempts.map((att, idx) => (
                      <tr key={att.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-white">{att.studentName}</td>
                        <td className="px-4 py-3 text-indigo-300 font-medium">{att.studentClass}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                            Ke-{att.attemptNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-emerald-400 text-sm">
                          {att.score}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          <span className="text-emerald-400 font-bold">{att.correctCount}</span> /{' '}
                          <span className="text-rose-400 font-bold">{att.wrongCount}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-amber-300">
                          {formatDuration(att.durationSeconds)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px]">{att.completedAt}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setInspectAttempt(att)}
                            className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all cursor-pointer"
                            title="Lihat rincian jawaban siswa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        {inspectAttempt && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{inspectAttempt.studentName}</h4>
                  <p className="text-xs text-indigo-300">
                    Kelas {inspectAttempt.studentClass} | Kesempatan {inspectAttempt.attemptNumber}
                  </p>
                </div>
                <button
                  onClick={() => setInspectAttempt(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {questions.map((q) => {
                  const userAns = (inspectAttempt.answers[q.id] || '').toUpperCase();
                  const isCorrect = userAns === q.word.toUpperCase();

                  return (
                    <div
                      key={q.id}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-300">
                          Soal {q.number} ({q.word}):
                        </span>
                        <p className="text-slate-400 text-[11px] mt-0.5 font-mono">
                          Jawaban: <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{userAns || '(Kosong)'}</span>
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isCorrect ? 'BENAR' : 'SALAH'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setInspectAttempt(null)}
                className="w-full py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
