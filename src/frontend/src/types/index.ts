// ─── Backend-aligned types (matching backend.d.ts) ──────────────────────────

export interface AlarmRecord {
  id: string;
  name: string;
  timeHour: bigint;
  timeMinute: bigint;
  isEnabled: boolean;
  repeatDays: bigint[];
  requireMathProblem: boolean;
}

export interface PinnedZone {
  id: string;
  cityName: string;
  timezone: string;
  countryCode: string;
}

export interface TimerPreset {
  id: string;
  name: string;
  durationSeconds: bigint;
  category: string;
}

export interface UserSettings {
  use24HourFormat: boolean;
}

// ─── Frontend-only types ──────────────────────────────────────────────────────

export type Tab = "worldclock" | "alarm" | "stopwatch" | "timer";

export interface LapRecord {
  index: number;
  timeMs: number;
  splitMs: number;
  isFastest: boolean;
  isSlowest: boolean;
}

export interface ActiveTimer {
  id: string;
  name: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  startedAt: number | null;
  pausedAt: number | null;
}

// ─── Helper types ─────────────────────────────────────────────────────────────

export type TimerCategory = "focus" | "break" | "exercise" | "custom";

export interface WorldCity {
  id: string;
  cityName: string;
  timezone: string;
  countryCode: string;
  offset: number;
}

export interface AlarmFormData {
  name: string;
  timeHour: number;
  timeMinute: number;
  isEnabled: boolean;
  repeatDays: number[];
  requireMathProblem: boolean;
}

export interface TimerPresetFormData {
  name: string;
  durationSeconds: number;
  category: string;
}

export type GlassVariant = "default" | "light" | "heavy" | "glow";
export type GlowLevel = "none" | "sm" | "md" | "lg";
