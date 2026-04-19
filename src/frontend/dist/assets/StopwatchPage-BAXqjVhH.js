import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence, F as cn } from "./index-Ch_J1oJE.js";
import { a as GlassCard, G as GlassButton } from "./GlassCard-B3o3pxl0.js";
import { P as Pause, a as Play } from "./play-CjKhwJyG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function formatTime(ms, withCentiseconds = true) {
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
function formatDelta(ms) {
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
function LapRow({ lap, totalLaps, avgMs }) {
  const delta = lap.timeMs - avgMs;
  const lapPosition = totalLaps - lap.index + 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10, scale: 0.97 },
      transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
      "data-ocid": `stopwatch.lap.item.${lapPosition}`,
      className: cn(
        "flex items-center justify-between px-4 py-3 rounded-xl relative overflow-hidden",
        "border transition-all duration-200",
        lap.isFastest && "border-[oklch(0.70_0.18_145_/_0.4)] shadow-[0_0_14px_oklch(0.70_0.18_145_/_0.2)]",
        lap.isSlowest && "border-[oklch(0.60_0.20_25_/_0.4)] shadow-[0_0_14px_oklch(0.60_0.20_25_/_0.2)]",
        !lap.isFastest && !lap.isSlowest && "border-white/5 hover:border-white/10"
      ),
      style: {
        background: lap.isFastest ? "oklch(0.70 0.18 145 / 0.07)" : lap.isSlowest ? "oklch(0.60 0.20 25 / 0.07)" : "oklch(0.14 0.02 245 / 0.5)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 rounded-xl",
            style: {
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "text-sm font-medium font-mono tabular-nums w-14",
                lap.isFastest && "text-[oklch(0.78_0.18_145)]",
                lap.isSlowest && "text-[oklch(0.72_0.20_25)]",
                !lap.isFastest && !lap.isSlowest && "text-vibrant-secondary"
              ),
              children: [
                "Lap ",
                lap.index
              ]
            }
          ),
          (lap.isFastest || lap.isSlowest) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-md border",
                lap.isFastest && "text-[oklch(0.78_0.18_145)] border-[oklch(0.70_0.18_145_/_0.3)] bg-[oklch(0.70_0.18_145_/_0.1)]",
                lap.isSlowest && "text-[oklch(0.72_0.20_25)] border-[oklch(0.60_0.20_25_/_0.3)] bg-[oklch(0.60_0.20_25_/_0.1)]"
              ),
              children: lap.isFastest ? "Fastest" : "Slowest"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center gap-4", children: [
          totalLaps > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-xs font-mono tabular-nums",
                delta < 0 ? "text-[oklch(0.78_0.18_145)]" : "text-[oklch(0.72_0.20_25)]"
              ),
              children: formatDelta(delta)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "text-base font-mono tabular-nums font-medium",
                lap.isFastest && "text-[oklch(0.88_0.18_145)]",
                lap.isSlowest && "text-[oklch(0.82_0.20_25)]",
                !lap.isFastest && !lap.isSlowest && "text-vibrant-primary"
              ),
              children: formatTime(lap.timeMs)
            }
          )
        ] })
      ]
    }
  );
}
function StopwatchPage() {
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [displayMs, setDisplayMs] = reactExports.useState(0);
  const [lapMs, setLapMs] = reactExports.useState(0);
  const [laps, setLaps] = reactExports.useState([]);
  const startTimeRef = reactExports.useRef(null);
  const accumulatedRef = reactExports.useRef(0);
  const lapStartRef = reactExports.useRef(0);
  const lapAccumulatedRef = reactExports.useRef(0);
  const rafRef = reactExports.useRef(null);
  const intervalRef = reactExports.useRef(null);
  const isAtZero = displayMs === 0 && laps.length === 0;
  const tick = reactExports.useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const elapsed = now - startTimeRef.current + accumulatedRef.current;
    const lapElapsed = now - startTimeRef.current + lapAccumulatedRef.current - lapStartRef.current;
    setDisplayMs(elapsed);
    setLapMs(Math.max(0, lapElapsed));
  }, []);
  const handleStartStop = reactExports.useCallback(() => {
    if (!isRunning) {
      const now = performance.now();
      startTimeRef.current = now;
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
  const handleLap = reactExports.useCallback(() => {
    if (!isRunning) return;
    const now = performance.now();
    const elapsed = startTimeRef.current !== null ? now - startTimeRef.current + accumulatedRef.current : accumulatedRef.current;
    const lapDuration = startTimeRef.current !== null ? now - startTimeRef.current + lapAccumulatedRef.current - lapStartRef.current : lapAccumulatedRef.current - lapStartRef.current;
    setLaps((prev) => {
      const newLap = {
        index: prev.length + 1,
        timeMs: Math.max(0, lapDuration),
        splitMs: elapsed,
        isFastest: false,
        isSlowest: false
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
          isSlowest: i === maxIdx
        }));
      }
      return all;
    });
    lapStartRef.current = startTimeRef.current !== null ? now - startTimeRef.current + accumulatedRef.current : accumulatedRef.current;
    lapAccumulatedRef.current = lapStartRef.current;
    setLapMs(0);
  }, [isRunning]);
  const handleReset = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  const avgLapMs = laps.length > 0 ? laps.reduce((acc, l) => acc + l.timeMs, 0) / laps.length : 0;
  const totalCs = Math.floor(displayMs / 10);
  const cs = totalCs % 100;
  const totalSecs = Math.floor(totalCs / 100);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-screen px-4 pt-8 pb-4",
      "data-ocid": "stopwatch.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-display text-2xl font-bold text-vibrant-primary mb-6", children: "Stopwatch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          GlassCard,
          {
            variant: "heavy",
            glow: "md",
            radius: "2xl",
            noPadding: true,
            className: cn(
              "flex flex-col items-center justify-center py-10 px-4 mb-4",
              isRunning && "pulse-glow"
            ),
            "data-ocid": "stopwatch.display",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  className: "flex items-baseline gap-0 select-none",
                  animate: isRunning ? { opacity: [1, 0.88, 1] } : { opacity: 1 },
                  transition: isRunning ? {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  } : { duration: 0.3 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-primary",
                        style: { fontSize: "clamp(4rem, 18vw, 7rem)", lineHeight: 1 },
                        "data-ocid": "stopwatch.minutes_display",
                        children: String(mins).padStart(2, "0")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-secondary",
                        style: { fontSize: "clamp(3.5rem, 16vw, 6rem)", lineHeight: 1 },
                        children: ":"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-primary",
                        style: { fontSize: "clamp(4rem, 18vw, 7rem)", lineHeight: 1 },
                        children: String(secs).padStart(2, "0")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-tertiary ml-1",
                        style: { fontSize: "clamp(1.8rem, 8vw, 3rem)", lineHeight: 1 },
                        children: "."
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-secondary",
                        style: { fontSize: "clamp(1.8rem, 8vw, 3rem)", lineHeight: 1 },
                        "data-ocid": "stopwatch.centiseconds_display",
                        children: String(cs).padStart(2, "0")
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: laps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 6 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -6 },
                  transition: { duration: 0.2 },
                  className: "mt-3 flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-vibrant-tertiary text-xs font-medium tracking-wider uppercase", children: "Current Lap" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock text-vibrant-secondary text-xl font-medium tabular-nums",
                        "data-ocid": "stopwatch.current_lap_display",
                        children: formatTime(lapMs)
                      }
                    )
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-8 mt-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlassButton,
                  {
                    variant: "default",
                    size: "icon",
                    onClick: handleReset,
                    disabled: isRunning || isAtZero,
                    "aria-label": "Reset stopwatch",
                    "data-ocid": "stopwatch.reset_button",
                    className: "w-14 h-14 rounded-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.button,
                  {
                    whileTap: { scale: 1.12 },
                    transition: { type: "spring", stiffness: 400, damping: 18 },
                    onClick: handleStartStop,
                    "aria-label": isRunning ? "Stop stopwatch" : "Start stopwatch",
                    "data-ocid": isRunning ? "stopwatch.stop_button" : "stopwatch.start_button",
                    className: cn(
                      "relative w-20 h-20 rounded-full border-2",
                      "inline-flex items-center justify-center",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
                      "transition-all duration-200 cursor-pointer select-none",
                      isRunning ? "border-[oklch(0.78_0.18_220_/_0.6)] active-glow" : "border-white/20 shadow-glass-md"
                    ),
                    style: isRunning ? {
                      background: "linear-gradient(135deg, oklch(0.78 0.20 220) 0%, oklch(0.68 0.22 230) 100%)",
                      boxShadow: "0 0 32px oklch(0.75 0.18 220 / 0.5), 0 0 64px oklch(0.75 0.18 220 / 0.25), inset 0 1px 0 rgba(255,255,255,0.2)"
                    } : {
                      background: "oklch(0.22 0.03 245 / 0.7)",
                      backdropFilter: "blur(12px)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        initial: { opacity: 0, scale: 0.6 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.6 },
                        transition: { duration: 0.15 },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Pause,
                          {
                            className: "w-8 h-8 text-[oklch(0.08_0.02_245)]",
                            fill: "currentColor",
                            strokeWidth: 0
                          }
                        )
                      },
                      "pause"
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        initial: { opacity: 0, scale: 0.6 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.6 },
                        transition: { duration: 0.15 },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Play,
                          {
                            className: cn(
                              "w-8 h-8 ml-1",
                              displayMs > 0 ? "text-vibrant-primary" : "text-[oklch(0.78_0.18_220)]"
                            ),
                            fill: "currentColor",
                            strokeWidth: 0
                          }
                        )
                      },
                      "play"
                    ) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlassButton,
                  {
                    variant: "default",
                    size: "icon",
                    onClick: handleLap,
                    disabled: !isRunning,
                    "aria-label": "Record lap",
                    "data-ocid": "stopwatch.lap_button",
                    className: "w-14 h-14 rounded-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-5 h-5" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 flex flex-col min-h-0",
            "data-ocid": "stopwatch.laps.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-vibrant-secondary tracking-wider uppercase", children: "Lap Times" }),
                laps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-vibrant-tertiary", children: [
                  laps.length,
                  " lap",
                  laps.length !== 1 ? "s" : ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: laps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.3 },
                  className: "flex-1 flex flex-col items-center justify-center py-12",
                  "data-ocid": "stopwatch.laps.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-14 h-14 rounded-full mb-4 flex items-center justify-center",
                        style: {
                          background: "oklch(0.18 0.03 245 / 0.6)",
                          border: "1px solid rgba(255,255,255,0.07)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-6 h-6 text-vibrant-tertiary" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-vibrant-tertiary text-sm text-center", children: "Start the stopwatch to record laps" })
                  ]
                },
                "empty"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "flex flex-col gap-2 overflow-y-auto scrollbar-hide",
                  "data-ocid": "stopwatch.laps.list",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: [...laps].reverse().map((lap) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LapRow,
                    {
                      lap,
                      totalLaps: laps.length,
                      avgMs: avgLapMs
                    },
                    lap.index
                  )) })
                },
                "list"
              ) })
            ]
          }
        )
      ]
    }
  );
}
export {
  StopwatchPage as default
};
