import React from 'react';
import { KeyRound, Timer, BookOpen, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  subject: string;
  studentName?: string;
  studentClass?: string;
  attemptNumber?: number;
  durationSeconds: number;
  isQuizActive: boolean;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  subject,
  studentName,
  studentClass,
  attemptNumber,
  durationSeconds,
  isQuizActive,
  isAdminLoggedIn,
  onOpenAdmin,
  onLogoutAdmin,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Title Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-pink-400 text-lg">
              TTS
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Teka Teki Silang Interaktif
            </h1>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>{subject}</span>
            </div>
          </div>
        </div>

        {/* Center Zone: Active Student & Stopwatch Timer */}
        {isQuizActive && (
          <div className="hidden md:flex items-center gap-4 bg-slate-800/80 px-4 py-1.5 rounded-full border border-indigo-500/30">
            {studentName && (
              <div className="text-xs text-slate-300 border-r border-slate-700 pr-3">
                <span className="font-semibold text-white">{studentName}</span>{' '}
                <span className="text-indigo-400">({studentClass})</span>
              </div>
            )}
            {attemptNumber && (
              <div className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                Kesempatan Ke-{attemptNumber}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-sm bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/30 shadow-inner">
              <Timer className="w-4 h-4 animate-pulse text-amber-400" />
              <span>{formatTime(durationSeconds)}</span>
            </div>
          </div>
        )}

        {/* Action Zone: Admin Key Button */}
        <div className="flex items-center gap-3 shrink-0">
          {isQuizActive && (
            <div className="flex md:hidden items-center gap-1 text-amber-400 font-mono font-bold text-xs bg-slate-800 px-2.5 py-1 rounded-full border border-amber-500/30">
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(durationSeconds)}</span>
            </div>
          )}

          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Mode Admin
              </span>
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-all shadow-md hover:shadow-rose-500/20 active:scale-95 whitespace-nowrap"
              >
                Keluar Admin
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Admin</span>
              <KeyRound className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
