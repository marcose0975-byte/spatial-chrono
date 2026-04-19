import GlassButton from "@/components/layout/GlassButton";
import GlassCard from "@/components/layout/GlassCard";
import { useTimerPresets } from "@/hooks/use-clock-data";
import { cn } from "@/lib/utils";
import type { ActiveTimer, TimerPreset, TimerPresetFormData } from "@/types";
import {
  Maximize2,
  Pause,
  Play,
  Plus,
  Settings2,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPresetDuration(secs: bigint): string {
  const total = Number(secs);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}h ${rm > 0 ? `${rm}m` : ""}`;
  }
  if (s === 0) return `${m}m`;
  if (m === 0) return `${s}s`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Timer Reducer ────────────────────────────────────────────────────────────

type TimerAction =
  | { type: "ADD"; timer: ActiveTimer }
  | { type: "START"; id: string }
  | { type: "PAUSE"; id: string }
  | { type: "RESUME"; id: string }
  | { type: "CANCEL"; id: string }
  | { type: "TICK"; now: number }
  | { type: "FINISH"; id: string }
  | { type: "DISMISS"; id: string };

function timerReducer(
  state: ActiveTimer[],
  action: TimerAction,
): ActiveTimer[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.timer];
    case "START":
      return state.map((t) =>
        t.id === action.id
          ? {
              ...t,
              isRunning: true,
              isPaused: false,
              startedAt: Date.now(),
              pausedAt: null,
            }
          : t,
      );
    case "PAUSE":
      return state.map((t) =>
        t.id === action.id
          ? { ...t, isRunning: false, isPaused: true, pausedAt: Date.now() }
          : t,
      );
    case "RESUME":
      return state.map((t) => {
        if (t.id !== action.id || !t.pausedAt) return t;
        const pausedDuration = Date.now() - t.pausedAt;
        return {
          ...t,
          isRunning: true,
          isPaused: false,
          pausedAt: null,
          startedAt: (t.startedAt ?? Date.now()) + pausedDuration,
        };
      });
    case "CANCEL":
      return state.filter((t) => t.id !== action.id);
    case "DISMISS":
      return state.filter((t) => t.id !== action.id);
    case "FINISH":
      return state.map((t) =>
        t.id === action.id
          ? {
              ...t,
              isRunning: false,
              isFinished: true,
              remainingSeconds: 0,
            }
          : t,
      );
    case "TICK":
      return state.map((t) => {
        if (!t.isRunning || t.isFinished || !t.startedAt) return t;
        const elapsed = Math.floor((action.now - t.startedAt) / 1000);
        const remaining = Math.max(0, t.durationSeconds - elapsed);
        return { ...t, remainingSeconds: remaining };
      });
    default:
      return state;
  }
}

// ─── Progress Ring ─────────────────────────────────────────────────────────────

interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0–1
  isRunning: boolean;
  isFinished: boolean;
  color?: "cyan" | "gold";
}

function ProgressRing({
  size,
  strokeWidth,
  progress,
  isRunning,
  isFinished,
  color = "cyan",
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const cx = size / 2;

  const trackColor = "rgba(255,255,255,0.07)";
  const gradId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {color === "cyan" ? (
            <>
              <stop offset="0%" stopColor="oklch(0.80 0.20 200)" />
              <stop offset="100%" stopColor="oklch(0.70 0.22 230)" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="oklch(0.88 0.20 85)" />
              <stop offset="100%" stopColor="oklch(0.75 0.18 60)" />
            </>
          )}
        </linearGradient>
        {isRunning && (
          <filter id={`glow-${gradId}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      {/* Track */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={isFinished ? circ : offset}
        transform={`rotate(-90 ${cx} ${cx})`}
        filter={isRunning ? `url(#glow-${gradId})` : undefined}
        style={{ transition: "stroke-dashoffset 0.9s linear" }}
      />
    </svg>
  );
}

// ─── Timer Card ────────────────────────────────────────────────────────────────

interface TimerCardProps {
  timer: ActiveTimer;
  index: number;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onDismiss: (id: string) => void;
  onFullscreen: (id: string) => void;
}

function TimerCard({
  timer,
  index,
  onPause,
  onResume,
  onCancel,
  onDismiss,
  onFullscreen,
}: TimerCardProps) {
  const progress =
    timer.durationSeconds > 0
      ? timer.remainingSeconds / timer.durationSeconds
      : 0;
  const ringSize = 120;
  const strokeW = 8;

  return (
    <motion.div
      layoutId={`timer-card-${timer.id}`}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      data-ocid={`timer.item.${index + 1}`}
    >
      <GlassCard
        variant="default"
        glow={timer.isFinished ? "lg" : timer.isRunning ? "md" : "none"}
        radius="2xl"
        noPadding
        className={cn(
          "p-5 flex flex-col gap-4",
          timer.isRunning && "pulse-glow",
          timer.isFinished &&
            "shadow-[0_0_40px_oklch(0.85_0.20_85_/_0.5)] border-[oklch(0.85_0.20_85_/_0.4)]",
        )}
      >
        {/* Top row: name + actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-vibrant-primary truncate max-w-[60%]">
            {timer.name}
          </span>
          <div className="flex items-center gap-1.5">
            {!timer.isFinished && (
              <button
                type="button"
                aria-label="Fullscreen"
                data-ocid={`timer.fullscreen.${index + 1}`}
                onClick={() => onFullscreen(timer.id)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-vibrant-secondary hover:glass transition-all duration-200"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              aria-label="Cancel timer"
              data-ocid={`timer.delete_button.${index + 1}`}
              onClick={() =>
                timer.isFinished ? onDismiss(timer.id) : onCancel(timer.id)
              }
              className="h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-warning hover:glass transition-all duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress ring + time */}
        <div className="flex items-center gap-5">
          <div
            className="relative flex-shrink-0"
            style={{ width: ringSize, height: ringSize }}
          >
            <ProgressRing
              size={ringSize}
              strokeWidth={strokeW}
              progress={progress}
              isRunning={timer.isRunning}
              isFinished={timer.isFinished}
              color={timer.isFinished ? "gold" : "cyan"}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {timer.isFinished ? (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.85 0.20 85)" }}
                >
                  Done!
                </motion.span>
              ) : (
                <span
                  className="text-mono-clock font-bold text-vibrant-primary"
                  style={{ fontSize: timer.remainingSeconds >= 3600 ? 18 : 22 }}
                >
                  {formatTime(timer.remainingSeconds)}
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          {!timer.isFinished ? (
            <div className="flex flex-col gap-2">
              {timer.isRunning ? (
                <GlassButton
                  size="sm"
                  variant="default"
                  data-ocid={`timer.pause.${index + 1}`}
                  onClick={() => onPause(timer.id)}
                  leftIcon={<Pause className="w-3.5 h-3.5" />}
                >
                  Pause
                </GlassButton>
              ) : (
                <GlassButton
                  size="sm"
                  variant="primary"
                  data-ocid={`timer.resume.${index + 1}`}
                  onClick={() => onResume(timer.id)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Resume
                </GlassButton>
              )}
              <GlassButton
                size="sm"
                variant="danger"
                data-ocid={`timer.cancel.${index + 1}`}
                onClick={() => onCancel(timer.id)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Cancel
              </GlassButton>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <GlassButton
                size="sm"
                variant="success"
                data-ocid={`timer.dismiss.${index + 1}`}
                onClick={() => onDismiss(timer.id)}
              >
                Dismiss
              </GlassButton>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {!timer.isFinished && (
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.80 0.20 200), oklch(0.70 0.22 230))",
              }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

// ─── Fullscreen Overlay ────────────────────────────────────────────────────────

interface FullscreenTimerProps {
  timer: ActiveTimer;
  onClose: () => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

function FullscreenTimer({
  timer,
  onClose,
  onPause,
  onResume,
}: FullscreenTimerProps) {
  const progress =
    timer.durationSeconds > 0
      ? timer.remainingSeconds / timer.durationSeconds
      : 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      layoutId={`timer-card-${timer.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      data-ocid="timer.fullscreen_overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        background: "oklch(0.05 0.03 230 / 0.92)",
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
      role="presentation"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.75 0.18 220 / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Close button */}
      <button
        type="button"
        aria-label="Exit fullscreen"
        data-ocid="timer.fullscreen.close_button"
        onClick={onClose}
        className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-2xl glass text-vibrant-secondary hover:text-vibrant-primary transition-all duration-200"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main content */}
      <div
        className="flex flex-col items-center gap-8"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* Giant ring */}
        <div className="relative" style={{ width: 300, height: 300 }}>
          <ProgressRing
            size={300}
            strokeWidth={16}
            progress={progress}
            isRunning={timer.isRunning}
            isFinished={timer.isFinished}
            color={timer.isFinished ? "gold" : "cyan"}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {timer.isFinished ? (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold"
                style={{ color: "oklch(0.85 0.20 85)" }}
              >
                Done!
              </motion.span>
            ) : (
              <span
                className="text-mono-clock font-bold text-vibrant-primary"
                style={{ fontSize: 64, letterSpacing: "0.02em" }}
              >
                {formatTime(timer.remainingSeconds)}
              </span>
            )}
          </div>
        </div>

        {/* Timer name */}
        <div className="text-center">
          <p className="text-xl font-semibold text-vibrant-secondary">
            {timer.name}
          </p>
          <p className="text-sm text-vibrant-tertiary mt-1">
            Tap anywhere to exit
          </p>
        </div>

        {/* Controls */}
        {!timer.isFinished && (
          <div className="flex gap-3">
            {timer.isRunning ? (
              <GlassButton
                size="lg"
                variant="default"
                data-ocid="timer.fullscreen.pause_button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPause(timer.id);
                }}
                leftIcon={<Pause className="w-5 h-5" />}
              >
                Pause
              </GlassButton>
            ) : (
              <GlassButton
                size="lg"
                variant="primary"
                data-ocid="timer.fullscreen.resume_button"
                onClick={(e) => {
                  e.stopPropagation();
                  onResume(timer.id);
                }}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Resume
              </GlassButton>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Add Timer Modal ───────────────────────────────────────────────────────────

interface QuickPreset {
  name: string;
  h: number;
  m: number;
  s: number;
}

const QUICK_PRESETS: QuickPreset[] = [
  { name: "Pomodoro", h: 0, m: 25, s: 0 },
  { name: "Short Break", h: 0, m: 5, s: 0 },
  { name: "Tabata Work", h: 0, m: 0, s: 20 },
  { name: "Tabata Rest", h: 0, m: 0, s: 10 },
];

interface AddTimerModalProps {
  onAdd: (name: string, durationSeconds: number) => void;
  onClose: () => void;
}

function AddTimerModal({ onAdd, onClose }: AddTimerModalProps) {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const applyQuickPreset = (p: QuickPreset) => {
    setName(p.name);
    setHours(p.h);
    setMinutes(p.m);
    setSeconds(p.s);
  };

  const handleStart = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    onAdd(name.trim() || "Timer", total);
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const NumberInput = ({
    value,
    max,
    onChange,
    label,
    ocid,
  }: {
    value: number;
    max: number;
    onChange: (v: number) => void;
    label: string;
    ocid: string;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-vibrant-tertiary uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-col items-center glass rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-14 h-8 flex items-center justify-center text-vibrant-secondary hover:text-vibrant-primary hover:bg-white/5 transition-colors"
          aria-label={`Increase ${label}`}
        >
          ▲
        </button>
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          data-ocid={ocid}
          onChange={(e) =>
            onChange(Math.max(0, Math.min(max, Number(e.target.value))))
          }
          className="w-14 h-10 bg-transparent text-center text-mono-clock text-xl font-bold text-vibrant-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-14 h-8 flex items-center justify-center text-vibrant-secondary hover:text-vibrant-primary hover:bg-white/5 transition-colors"
          aria-label={`Decrease ${label}`}
        >
          ▼
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
      data-ocid="timer.add_timer.dialog"
      role="presentation"
      aria-label="Add Timer"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.94 }}
        transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        <GlassCard variant="heavy" glow="md" radius="2xl" noPadding>
          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-vibrant-primary">
                New Timer
              </h2>
              <button
                type="button"
                onClick={onClose}
                data-ocid="timer.add_timer.close_button"
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center rounded-xl glass text-vibrant-tertiary hover:text-vibrant-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Name input */}
            <div>
              <p className="text-xs text-vibrant-tertiary uppercase tracking-wider mb-1.5">
                Name (optional)
              </p>
              <input
                type="text"
                placeholder="Timer"
                value={name}
                data-ocid="timer.name.input"
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 glass rounded-xl text-sm text-vibrant-primary placeholder:text-vibrant-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Duration spinners */}
            <div>
              <p className="text-xs text-vibrant-tertiary uppercase tracking-wider mb-3">
                Duration
              </p>
              <div className="flex items-end justify-center gap-4">
                <NumberInput
                  value={hours}
                  max={23}
                  onChange={setHours}
                  label="H"
                  ocid="timer.hours.input"
                />
                <span className="text-3xl font-mono text-vibrant-tertiary pb-3">
                  :
                </span>
                <NumberInput
                  value={minutes}
                  max={59}
                  onChange={setMinutes}
                  label="M"
                  ocid="timer.minutes.input"
                />
                <span className="text-3xl font-mono text-vibrant-tertiary pb-3">
                  :
                </span>
                <NumberInput
                  value={seconds}
                  max={59}
                  onChange={setSeconds}
                  label="S"
                  ocid="timer.seconds.input"
                />
              </div>
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-xs text-vibrant-tertiary uppercase tracking-wider mb-2">
                Quick Select
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    data-ocid={`timer.quick_preset.${p.name.toLowerCase().replace(/\s+/g, "_")}`}
                    onClick={() => applyQuickPreset(p)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium glass-light text-vibrant-secondary hover:text-vibrant-primary hover:glass transition-all duration-200"
                  >
                    {p.name} {formatTime(p.h * 3600 + p.m * 60 + p.s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Start button */}
            <GlassButton
              variant="primary"
              size="lg"
              data-ocid="timer.start.submit_button"
              onClick={handleStart}
              disabled={hours === 0 && minutes === 0 && seconds === 0}
              className="w-full"
            >
              Start Timer
            </GlassButton>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── Edit Presets Modal ────────────────────────────────────────────────────────

interface EditPresetsModalProps {
  presets: TimerPreset[];
  onSave: (preset: TimerPreset) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function EditPresetsModal({
  presets,
  onSave,
  onDelete,
  onClose,
}: EditPresetsModalProps) {
  const [form, setForm] = useState<TimerPresetFormData>({
    name: "",
    durationSeconds: 300,
    category: "custom",
  });
  const [formMinutes, setFormMinutes] = useState(5);
  const [formSeconds, setFormSeconds] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleAdd = () => {
    const total = formMinutes * 60 + formSeconds;
    if (!form.name.trim() || total <= 0) return;
    onSave({
      id: newId(),
      name: form.name.trim(),
      durationSeconds: BigInt(total),
      category: form.category,
    });
    setForm({ name: "", durationSeconds: 300, category: "custom" });
    setFormMinutes(5);
    setFormSeconds(0);
  };

  const CATEGORIES = ["focus", "break", "exercise", "custom"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4"
      style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
      data-ocid="timer.edit_presets.dialog"
      role="presentation"
      aria-label="Edit Presets"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.94 }}
        transition={{ duration: 0.28, ease: [0.34, 1.2, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm"
      >
        <GlassCard variant="heavy" glow="md" radius="2xl" noPadding>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-vibrant-primary">
                Edit Presets
              </h2>
              <button
                type="button"
                onClick={onClose}
                data-ocid="timer.edit_presets.close_button"
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center rounded-xl glass text-vibrant-tertiary hover:text-vibrant-primary transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing presets */}
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto scrollbar-hide">
              {presets.map((p, i) => (
                <div
                  key={p.id}
                  data-ocid={`timer.preset.item.${i + 1}`}
                  className="flex items-center justify-between px-3 py-2 glass rounded-xl"
                >
                  <div>
                    <span className="text-sm font-medium text-vibrant-primary">
                      {p.name}
                    </span>
                    <span className="text-xs text-vibrant-tertiary ml-2">
                      {formatPresetDuration(p.durationSeconds)}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${p.name}`}
                    data-ocid={`timer.preset.delete_button.${i + 1}`}
                    onClick={() => onDelete(p.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-warning transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new preset */}
            <div className="border-t border-white/8 pt-4 flex flex-col gap-3">
              <p className="text-xs text-vibrant-tertiary uppercase tracking-wider">
                Add Custom Preset
              </p>
              <input
                type="text"
                placeholder="Preset name"
                value={form.name}
                data-ocid="timer.preset.name.input"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary placeholder:text-vibrant-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs text-vibrant-tertiary mb-1">Min</p>
                  <input
                    type="number"
                    min={0}
                    max={1440}
                    value={formMinutes}
                    data-ocid="timer.preset.minutes.input"
                    onChange={(e) =>
                      setFormMinutes(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-vibrant-tertiary mb-1">Sec</p>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={formSeconds}
                    data-ocid="timer.preset.seconds.input"
                    onChange={(e) =>
                      setFormSeconds(
                        Math.max(0, Math.min(59, Number(e.target.value))),
                      )
                    }
                    className="w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-vibrant-tertiary mb-1">Category</p>
                  <select
                    value={form.category}
                    data-ocid="timer.preset.category.select"
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full h-9 px-2 glass rounded-xl text-xs text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40 bg-transparent"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0d1117]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <GlassButton
                variant="default"
                size="md"
                data-ocid="timer.preset.add_button"
                onClick={handleAdd}
                disabled={
                  !form.name.trim() || (formMinutes === 0 && formSeconds === 0)
                }
                className="w-full"
              >
                Add Preset
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── Category badge color ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  focus: "oklch(0.75 0.18 220 / 0.25)",
  break: "oklch(0.70 0.18 145 / 0.2)",
  exercise: "oklch(0.65 0.18 25 / 0.2)",
  hiit: "oklch(0.65 0.18 25 / 0.2)",
  custom: "oklch(0.65 0.18 270 / 0.2)",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TimerPage() {
  const [timers, dispatch] = useReducer(timerReducer, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditPresets, setShowEditPresets] = useState(false);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  const { presets, savePreset, deletePreset } = useTimerPresets();
  const rafRef = useRef<number | null>(null);

  // Ticker — updates remaining time for all running timers
  useEffect(() => {
    const tick = () => {
      dispatch({ type: "TICK", now: Date.now() });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Detect timers that hit 0 → mark finished
  useEffect(() => {
    for (const t of timers) {
      if (t.isRunning && t.remainingSeconds === 0 && !t.isFinished) {
        dispatch({ type: "FINISH", id: t.id });
      }
    }
  }, [timers]);

  // Auto-dismiss finished timers after 5s
  const finishedIds = timers
    .filter((t) => t.isFinished)
    .map((t) => t.id)
    .join(",");

  useEffect(() => {
    if (!finishedIds) return;
    const ids = finishedIds.split(",");
    const handles = ids.map((id) =>
      setTimeout(() => dispatch({ type: "DISMISS", id }), 5000),
    );
    return () => {
      for (const h of handles) clearTimeout(h);
    };
  }, [finishedIds]);

  const addTimer = useCallback((name: string, durationSeconds: number) => {
    const timer: ActiveTimer = {
      id: newId(),
      name,
      durationSeconds,
      remainingSeconds: durationSeconds,
      isRunning: true,
      isPaused: false,
      isFinished: false,
      startedAt: Date.now(),
      pausedAt: null,
    };
    dispatch({ type: "ADD", timer });
  }, []);

  const startFromPreset = useCallback((preset: TimerPreset) => {
    const secs = Number(preset.durationSeconds);
    const timer: ActiveTimer = {
      id: newId(),
      name: preset.name,
      durationSeconds: secs,
      remainingSeconds: secs,
      isRunning: true,
      isPaused: false,
      isFinished: false,
      startedAt: Date.now(),
      pausedAt: null,
    };
    dispatch({ type: "ADD", timer });
  }, []);

  const fullscreenTimer = timers.find((t) => t.id === fullscreenId) ?? null;

  return (
    <div className="flex flex-col min-h-screen px-4 pt-8 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded-xl glass">
            <Timer className="w-4 h-4 text-vibrant-secondary" />
          </div>
          <h1 className="text-display text-2xl font-bold text-vibrant-primary">
            Timer
          </h1>
        </div>
        <GlassButton
          variant="primary"
          size="sm"
          data-ocid="timer.add_timer.open_modal_button"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="glow-cyan-sm"
        >
          New Timer
        </GlassButton>
      </div>

      {/* Active timers grid */}
      <AnimatePresence>
        {timers.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            data-ocid="timer.empty_state"
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div
              className="h-20 w-20 rounded-3xl glass flex items-center justify-center"
              style={{
                boxShadow: "0 0 30px oklch(0.75 0.18 220 / 0.15)",
              }}
            >
              <Timer className="w-9 h-9 text-vibrant-tertiary" />
            </div>
            <div className="text-center">
              <p className="text-vibrant-secondary font-medium">
                No active timers
              </p>
              <p className="text-sm text-vibrant-tertiary mt-1">
                Start a preset or create a custom timer
              </p>
            </div>
            <GlassButton
              variant="primary"
              size="md"
              data-ocid="timer.empty_state.add_button"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Start Timer
            </GlassButton>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <AnimatePresence>
              {timers.map((timer, i) => (
                <TimerCard
                  key={timer.id}
                  timer={timer}
                  index={i}
                  onPause={(id) => dispatch({ type: "PAUSE", id })}
                  onResume={(id) => dispatch({ type: "RESUME", id })}
                  onCancel={(id) => {
                    if (fullscreenId === id) setFullscreenId(null);
                    dispatch({ type: "CANCEL", id });
                  }}
                  onDismiss={(id) => {
                    if (fullscreenId === id) setFullscreenId(null);
                    dispatch({ type: "DISMISS", id });
                  }}
                  onFullscreen={(id) => setFullscreenId(id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Presets section */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-vibrant-secondary uppercase tracking-wider">
            Presets
          </h2>
          <button
            type="button"
            data-ocid="timer.edit_presets.open_modal_button"
            onClick={() => setShowEditPresets(true)}
            className="flex items-center gap-1.5 text-xs text-vibrant-tertiary hover:text-vibrant-secondary transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>

        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          data-ocid="timer.presets.list"
        >
          {presets.map((preset, i) => (
            <motion.button
              key={preset.id}
              data-ocid={`timer.preset.chip.${i + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startFromPreset(preset)}
              className="flex-shrink-0 flex flex-col items-start gap-1 px-4 py-3 rounded-2xl glass-light hover:glass transition-all duration-200 min-w-[110px]"
              style={{
                borderColor: CATEGORY_COLORS[preset.category] ?? "transparent",
              }}
            >
              <span className="text-sm font-semibold text-vibrant-primary whitespace-nowrap">
                {preset.name}
              </span>
              <span className="text-xs text-vibrant-secondary font-mono">
                {formatPresetDuration(preset.durationSeconds)}
              </span>
              <span
                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    CATEGORY_COLORS[preset.category] ??
                    "oklch(0.65 0.18 270 / 0.2)",
                }}
              >
                <span className="text-vibrant-tertiary">{preset.category}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddTimerModal
            key="add-modal"
            onAdd={addTimer}
            onClose={() => setShowAddModal(false)}
          />
        )}
        {showEditPresets && (
          <EditPresetsModal
            key="edit-presets"
            presets={presets}
            onSave={savePreset}
            onDelete={deletePreset}
            onClose={() => setShowEditPresets(false)}
          />
        )}
        {fullscreenTimer && (
          <FullscreenTimer
            key="fullscreen"
            timer={fullscreenTimer}
            onClose={() => setFullscreenId(null)}
            onPause={(id) => dispatch({ type: "PAUSE", id })}
            onResume={(id) => dispatch({ type: "RESUME", id })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
