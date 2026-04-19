import GlassButton from "@/components/layout/GlassButton";
import GlassCard from "@/components/layout/GlassCard";
import { cn } from "@/lib/utils";
import type { LapRecord } from "@/types";
import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Format helpers ───────────────────────────────────────────────────────────

function formatTime(ms: number, withCentiseconds = true): string {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSecs = Math.floor(totalCs / 100);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  if (withCentiseconds) {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatDelta(ms: number): string {
  const sign = ms >= 0 ? "+" : "-";
  const abs = Math.abs(ms);
  const totalCs = Math.floor(abs / 10);
  const cs = totalCs % 100;
  const totalSecs = Math.floor(totalCs / 100);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  if (mins > 0)
    return `${sign}${mins}:${String(secs).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  return `${sign}${secs}.${String(cs).padStart(2, "0")}`;
}

// ─── Lap Row ─────────────────────────────────────────────────────────────────

interface LapRowProps {
  lap: LapRecord;
  totalLaps: number;
  avgMs: number;
}

function LapRow({ lap, totalLaps, avgMs }: LapRowProps) {
  const delta = lap.timeMs - avgMs;
  const lapPosition = totalLaps - lap.index + 1; // display number (1 = most recent)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      data-ocid={`stopwatch.lap.item.${lapPosition}`}
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl relative overflow-hidden",
        "border transition-all duration-200",
        lap.isFastest &&
          "border-[oklch(0.70_0.18_145_/_0.4)] shadow-[0_0_14px_oklch(0.70_0.18_145_/_0.2)]",
        lap.isSlowest &&
          "border-[oklch(0.60_0.20_25_/_0.4)] shadow-[0_0_14px_oklch(0.60_0.20_25_/_0.2)]",
        !lap.isFastest &&
          !lap.isSlowest &&
          "border-white/5 hover:border-white/10",
      )}
      style={{
        background: lap.isFastest
          ? "oklch(0.70 0.18 145 / 0.07)"
          : lap.isSlowest
            ? "oklch(0.60 0.20 25 / 0.07)"
            : "oklch(0.14 0.02 245 / 0.5)",
      }}
    >
      {/* Rim specular */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Lap label */}
      <div className="relative z-10 flex items-center gap-3">
        <span
          className={cn(
            "text-sm font-medium font-mono tabular-nums w-14",
            lap.isFastest && "text-[oklch(0.78_0.18_145)]",
            lap.isSlowest && "text-[oklch(0.72_0.20_25)]",
            !lap.isFastest && !lap.isSlowest && "text-vibrant-secondary",
          )}
        >
          Lap {lap.index}
        </span>
        {(lap.isFastest || lap.isSlowest) && (
          <span
            className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
              lap.isFastest &&
                "text-[oklch(0.78_0.18_145)] border-[oklch(0.70_0.18_145_/_0.3)] bg-[oklch(0.70_0.18_145_/_0.1)]",
              lap.isSlowest &&
                "text-[oklch(0.72_0.20_25)] border-[oklch(0.60_0.20_25_/_0.3)] bg-[oklch(0.60_0.20_25_/_0.1)]",
            )}
          >
            {lap.isFastest ? "Fastest" : "Slowest"}
          </span>
        )}
      </div>

      {/* Times */}
      <div className="relative z-10 flex items-center gap-4">
        {totalLaps > 1 && (
          <span
            className={cn(
              "text-xs font-mono tabular-nums",
              delta < 0
                ? "text-[oklch(0.78_0.18_145)]"
                : "text-[oklch(0.72_0.20_25)]",
            )}
          >
            {formatDelta(delta)}
          </span>
        )}
        <span
          className={cn(
            "text-base font-mono tabular-nums font-medium",
            lap.isFastest && "text-[oklch(0.88_0.18_145)]",
            lap.isSlowest && "text-[oklch(0.82_0.20_25)]",
            !lap.isFastest && !lap.isSlowest && "text-vibrant-primary",
          )}
        >
          {formatTime(lap.timeMs)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StopwatchPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [displayMs, setDisplayMs] = useState(0);
  const [lapMs, setLapMs] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const lapStartRef = useRef(0);
  const lapAccumulatedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Spring scale for start/stop button — handled via whileTap
  const isAtZero = displayMs === 0 && laps.length === 0;

  // ── Tick function
  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const elapsed = now - startTimeRef.current + accumulatedRef.current;
    const lapElapsed =
      now -
      startTimeRef.current +
      lapAccumulatedRef.current -
      lapStartRef.current;
    setDisplayMs(elapsed);
    setLapMs(Math.max(0, lapElapsed));
  }, []);

  // ── Start / Stop
  const handleStartStop = useCallback(() => {
    if (!isRunning) {
      const now = performance.now();
      startTimeRef.current = now;
      // lapStartRef tracks when the current lap began relative to start
      lapStartRef.current = accumulatedRef.current;
      intervalRef.current = setInterval(tick, 10);
      setIsRunning(true);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const now = performance.now();
      if (startTimeRef.current !== null) {
        accumulatedRef.current += now - startTimeRef.current;
        lapAccumulatedRef.current += now - startTimeRef.current;
      }
      startTimeRef.current = null;
      setIsRunning(false);
    }
  }, [isRunning, tick]);

  // ── Lap
  const handleLap = useCallback(() => {
    if (!isRunning) return;

    const now = performance.now();
    const elapsed =
      startTimeRef.current !== null
        ? now - startTimeRef.current + accumulatedRef.current
        : accumulatedRef.current;

    const lapDuration =
      startTimeRef.current !== null
        ? now -
          startTimeRef.current +
          lapAccumulatedRef.current -
          lapStartRef.current
        : lapAccumulatedRef.current - lapStartRef.current;

    setLaps((prev) => {
      const newLap: LapRecord = {
        index: prev.length + 1,
        timeMs: Math.max(0, lapDuration),
        splitMs: elapsed,
        isFastest: false,
        isSlowest: false,
      };
      const all = [...prev, newLap];

      if (all.length > 1) {
        let minMs = Number.POSITIVE_INFINITY;
        let maxMs = Number.NEGATIVE_INFINITY;
        let minIdx = 0;
        let maxIdx = 0;
        all.forEach((l, i) => {
          if (l.timeMs < minMs) {
            minMs = l.timeMs;
            minIdx = i;
          }
          if (l.timeMs > maxMs) {
            maxMs = l.timeMs;
            maxIdx = i;
          }
        });
        return all.map((l, i) => ({
          ...l,
          isFastest: i === minIdx,
          isSlowest: i === maxIdx,
        }));
      }
      return all;
    });

    // Reset lap timer
    lapStartRef.current =
      startTimeRef.current !== null
        ? now - startTimeRef.current + accumulatedRef.current
        : accumulatedRef.current;
    lapAccumulatedRef.current = lapStartRef.current;
    setLapMs(0);
  }, [isRunning]);

  // ── Reset
  const handleReset = useCallback(() => {
    if (isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    accumulatedRef.current = 0;
    lapStartRef.current = 0;
    lapAccumulatedRef.current = 0;
    setDisplayMs(0);
    setLapMs(0);
    setLaps([]);
  }, [isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Compute average lap for delta
  const avgLapMs =
    laps.length > 0
      ? laps.reduce((acc, l) => acc + l.timeMs, 0) / laps.length
      : 0;

  // Format main time
  const totalCs = Math.floor(displayMs / 10);
  const cs = totalCs % 100;
  const totalSecs = Math.floor(totalCs / 100);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);

  return (
    <div
      className="flex flex-col min-h-screen px-4 pt-8 pb-4"
      data-ocid="stopwatch.page"
    >
      {/* ── Header */}
      <h1 className="text-display text-2xl font-bold text-vibrant-primary mb-6">
        Stopwatch
      </h1>

      {/* ── Main Display */}
      <GlassCard
        variant="heavy"
        glow="md"
        radius="2xl"
        noPadding
        className={cn(
          "flex flex-col items-center justify-center py-10 px-4 mb-4",
          isRunning && "pulse-glow",
        )}
        data-ocid="stopwatch.display"
      >
        {/* Giant time display */}
        <motion.div
          className="flex items-baseline gap-0 select-none"
          animate={isRunning ? { opacity: [1, 0.88, 1] } : { opacity: 1 }}
          transition={
            isRunning
              ? {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        >
          {/* Minutes */}
          <span
            className="text-mono-clock text-vibrant-primary"
            style={{ fontSize: "clamp(4rem, 18vw, 7rem)", lineHeight: 1 }}
            data-ocid="stopwatch.minutes_display"
          >
            {String(mins).padStart(2, "0")}
          </span>
          <span
            className="text-mono-clock text-vibrant-secondary"
            style={{ fontSize: "clamp(3.5rem, 16vw, 6rem)", lineHeight: 1 }}
          >
            :
          </span>
          {/* Seconds */}
          <span
            className="text-mono-clock text-vibrant-primary"
            style={{ fontSize: "clamp(4rem, 18vw, 7rem)", lineHeight: 1 }}
          >
            {String(secs).padStart(2, "0")}
          </span>
          {/* Centiseconds separator */}
          <span
            className="text-mono-clock text-vibrant-tertiary ml-1"
            style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)", lineHeight: 1 }}
          >
            .
          </span>
          {/* Centiseconds */}
          <span
            className="text-mono-clock text-vibrant-secondary"
            style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)", lineHeight: 1 }}
            data-ocid="stopwatch.centiseconds_display"
          >
            {String(cs).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Current lap time */}
        <AnimatePresence>
          {laps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center gap-2"
            >
              <span className="text-vibrant-tertiary text-xs font-medium tracking-wider uppercase">
                Current Lap
              </span>
              <span
                className="text-mono-clock text-vibrant-secondary text-xl font-medium tabular-nums"
                data-ocid="stopwatch.current_lap_display"
              >
                {formatTime(lapMs)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Controls row */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {/* Reset */}
          <GlassButton
            variant="default"
            size="icon"
            onClick={handleReset}
            disabled={isRunning || isAtZero}
            aria-label="Reset stopwatch"
            data-ocid="stopwatch.reset_button"
            className="w-14 h-14 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </GlassButton>

          {/* Start / Stop — large, spring-animated */}
          <motion.button
            whileTap={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            onClick={handleStartStop}
            aria-label={isRunning ? "Stop stopwatch" : "Start stopwatch"}
            data-ocid={
              isRunning ? "stopwatch.stop_button" : "stopwatch.start_button"
            }
            className={cn(
              "relative w-20 h-20 rounded-full border-2",
              "inline-flex items-center justify-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
              "transition-all duration-200 cursor-pointer select-none",
              isRunning
                ? "border-[oklch(0.78_0.18_220_/_0.6)] active-glow"
                : "border-white/20 shadow-glass-md",
            )}
            style={
              isRunning
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.20 220) 0%, oklch(0.68 0.22 230) 100%)",
                    boxShadow:
                      "0 0 32px oklch(0.75 0.18 220 / 0.5), 0 0 64px oklch(0.75 0.18 220 / 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }
                : {
                    background: "oklch(0.22 0.03 245 / 0.7)",
                    backdropFilter: "blur(12px)",
                  }
            }
          >
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.span
                  key="pause"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause
                    className="w-8 h-8 text-[oklch(0.08_0.02_245)]"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play
                    className={cn(
                      "w-8 h-8 ml-1",
                      displayMs > 0
                        ? "text-vibrant-primary"
                        : "text-[oklch(0.78_0.18_220)]",
                    )}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Lap */}
          <GlassButton
            variant="default"
            size="icon"
            onClick={handleLap}
            disabled={!isRunning}
            aria-label="Record lap"
            data-ocid="stopwatch.lap_button"
            className="w-14 h-14 rounded-full"
          >
            <Flag className="w-5 h-5" />
          </GlassButton>
        </div>
      </GlassCard>

      {/* ── Lap History */}
      <div
        className="flex-1 flex flex-col min-h-0"
        data-ocid="stopwatch.laps.section"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-vibrant-secondary tracking-wider uppercase">
            Lap Times
          </h2>
          {laps.length > 0 && (
            <span className="text-xs text-vibrant-tertiary">
              {laps.length} lap{laps.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <AnimatePresence>
          {laps.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center py-12"
              data-ocid="stopwatch.laps.empty_state"
            >
              <div
                className="w-14 h-14 rounded-full mb-4 flex items-center justify-center"
                style={{
                  background: "oklch(0.18 0.03 245 / 0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Flag className="w-6 h-6 text-vibrant-tertiary" />
              </div>
              <p className="text-vibrant-tertiary text-sm text-center">
                Start the stopwatch to record laps
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="flex flex-col gap-2 overflow-y-auto scrollbar-hide"
              data-ocid="stopwatch.laps.list"
            >
              <AnimatePresence initial={false}>
                {[...laps].reverse().map((lap) => (
                  <LapRow
                    key={lap.index}
                    lap={lap}
                    totalLaps={laps.length}
                    avgMs={avgLapMs}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
