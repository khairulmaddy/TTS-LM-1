import { StudentAttempt } from '../types';

const STORAGE_KEY = 'tts_digital_onboarding_attempts_db';

/**
 * Get all recorded student attempts from LocalStorage
 */
export function getStoredAttempts(): StudentAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load student attempts', err);
    return [];
  }
}

/**
 * Save a new student attempt record
 */
export function saveAttemptRecord(attempt: StudentAttempt): void {
  try {
    const current = getStoredAttempts();
    current.push(attempt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save student attempt', err);
  }
}

/**
 * Get total attempts taken by a specific student (by name & class)
 */
export function getStudentAttemptCount(name: string, studentClass: string): number {
  const attempts = getStoredAttempts();
  const studentAttempts = attempts.filter(
    a => a.studentName.toLowerCase().trim() === name.toLowerCase().trim() &&
         a.studentClass.toLowerCase().trim() === studentClass.toLowerCase().trim()
  );
  return studentAttempts.length;
}

/**
 * Get all attempts by a specific student
 */
export function getStudentAttempts(name: string, studentClass: string): StudentAttempt[] {
  const attempts = getStoredAttempts();
  return attempts.filter(
    a => a.studentName.toLowerCase().trim() === name.toLowerCase().trim() &&
         a.studentClass.toLowerCase().trim() === studentClass.toLowerCase().trim()
  );
}

/**
 * Clear all records (Admin tool)
 */
export function clearAllAttempts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
