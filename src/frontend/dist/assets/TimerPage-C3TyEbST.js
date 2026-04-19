import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as Timer, A as AnimatePresence, m as motion, F as cn } from "./index-Ch_J1oJE.js";
import { G as GlassButton, a as GlassCard } from "./GlassCard-B3o3pxl0.js";
import { e as useTimerPresets, X } from "./use-clock-data-lJiL_BHs.js";
import { P as Pause, a as Play } from "./play-CjKhwJyG.js";
import { T as Trash2 } from "./trash-2-96QQHyMJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
function newId() {
  return Math.random().toString(36).slice(2, 10);
}
function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  const s = secs % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatPresetDuration(secs) {
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
function timerReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.timer];
    case "START":
      return state.map(
        (t) => t.id === action.id ? {
          ...t,
          isRunning: true,
          isPaused: false,
          startedAt: Date.now(),
          pausedAt: null
        } : t
      );
    case "PAUSE":
      return state.map(
        (t) => t.id === action.id ? { ...t, isRunning: false, isPaused: true, pausedAt: Date.now() } : t
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
          startedAt: (t.startedAt ?? Date.now()) + pausedDuration
        };
      });
    case "CANCEL":
      return state.filter((t) => t.id !== action.id);
    case "DISMISS":
      return state.filter((t) => t.id !== action.id);
    case "FINISH":
      return state.map(
        (t) => t.id === action.id ? {
          ...t,
          isRunning: false,
          isFinished: true,
          remainingSeconds: 0
        } : t
      );
    case "TICK":
      return state.map((t) => {
        if (!t.isRunning || t.isFinished || !t.startedAt) return t;
        const elapsed = Math.floor((action.now - t.startedAt) / 1e3);
        const remaining = Math.max(0, t.durationSeconds - elapsed);
        return { ...t, remainingSeconds: remaining };
      });
    default:
      return state;
  }
}
function ProgressRing({
  size,
  strokeWidth,
  progress,
  isRunning,
  isFinished,
  color = "cyan"
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const cx = size / 2;
  const trackColor = "rgba(255,255,255,0.07)";
  const gradId = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      className: "absolute inset-0",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("linearGradient", { id: gradId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: color === "cyan" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.80 0.20 200)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.70 0.22 230)" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.88 0.20 85)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.75 0.18 60)" })
          ] }) }),
          isRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `glow-${gradId}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx,
            cy: cx,
            r,
            fill: "none",
            stroke: trackColor,
            strokeWidth
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx,
            cy: cx,
            r,
            fill: "none",
            stroke: `url(#${gradId})`,
            strokeWidth,
            strokeLinecap: "round",
            strokeDasharray: circ,
            strokeDashoffset: isFinished ? circ : offset,
            transform: `rotate(-90 ${cx} ${cx})`,
            filter: isRunning ? `url(#glow-${gradId})` : void 0,
            style: { transition: "stroke-dashoffset 0.9s linear" }
          }
        )
      ]
    }
  );
}
function TimerCard({
  timer,
  index,
  onPause,
  onResume,
  onCancel,
  onDismiss,
  onFullscreen
}) {
  const progress = timer.durationSeconds > 0 ? timer.remainingSeconds / timer.durationSeconds : 0;
  const ringSize = 120;
  const strokeW = 8;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      layoutId: `timer-card-${timer.id}`,
      initial: { opacity: 0, scale: 0.88 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.88 },
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      "data-ocid": `timer.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        GlassCard,
        {
          variant: "default",
          glow: timer.isFinished ? "lg" : timer.isRunning ? "md" : "none",
          radius: "2xl",
          noPadding: true,
          className: cn(
            "p-5 flex flex-col gap-4",
            timer.isRunning && "pulse-glow",
            timer.isFinished && "shadow-[0_0_40px_oklch(0.85_0.20_85_/_0.5)] border-[oklch(0.85_0.20_85_/_0.4)]"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-vibrant-primary truncate max-w-[60%]", children: timer.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                !timer.isFinished && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Fullscreen",
                    "data-ocid": `timer.fullscreen.${index + 1}`,
                    onClick: () => onFullscreen(timer.id),
                    className: "h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-vibrant-secondary hover:glass transition-all duration-200",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Cancel timer",
                    "data-ocid": `timer.delete_button.${index + 1}`,
                    onClick: () => timer.isFinished ? onDismiss(timer.id) : onCancel(timer.id),
                    className: "h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-warning hover:glass transition-all duration-200",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative flex-shrink-0",
                  style: { width: ringSize, height: ringSize },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ProgressRing,
                      {
                        size: ringSize,
                        strokeWidth: strokeW,
                        progress,
                        isRunning: timer.isRunning,
                        isFinished: timer.isFinished,
                        color: timer.isFinished ? "gold" : "cyan"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: timer.isFinished ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        initial: { scale: 0.6, opacity: 0 },
                        animate: { scale: 1, opacity: 1 },
                        className: "text-sm font-bold",
                        style: { color: "oklch(0.85 0.20 85)" },
                        children: "Done!"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-mono-clock font-bold text-vibrant-primary",
                        style: { fontSize: timer.remainingSeconds >= 3600 ? 18 : 22 },
                        children: formatTime(timer.remainingSeconds)
                      }
                    ) })
                  ]
                }
              ),
              !timer.isFinished ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                timer.isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlassButton,
                  {
                    size: "sm",
                    variant: "default",
                    "data-ocid": `timer.pause.${index + 1}`,
                    onClick: () => onPause(timer.id),
                    leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5" }),
                    children: "Pause"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlassButton,
                  {
                    size: "sm",
                    variant: "primary",
                    "data-ocid": `timer.resume.${index + 1}`,
                    onClick: () => onResume(timer.id),
                    leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" }),
                    children: "Resume"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GlassButton,
                  {
                    size: "sm",
                    variant: "danger",
                    "data-ocid": `timer.cancel.${index + 1}`,
                    onClick: () => onCancel(timer.id),
                    leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                    children: "Cancel"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlassButton,
                {
                  size: "sm",
                  variant: "success",
                  "data-ocid": `timer.dismiss.${index + 1}`,
                  onClick: () => onDismiss(timer.id),
                  children: "Dismiss"
                }
              ) })
            ] }),
            !timer.isFinished && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-white/5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full rounded-full",
                style: {
                  background: "linear-gradient(90deg, oklch(0.80 0.20 200), oklch(0.70 0.22 230))"
                },
                animate: { width: `${progress * 100}%` },
                transition: { duration: 0.9, ease: "linear" }
              }
            ) })
          ]
        }
      )
    }
  );
}
function FullscreenTimer({
  timer,
  onClose,
  onPause,
  onResume
}) {
  const progress = timer.durationSeconds > 0 ? timer.remainingSeconds / timer.durationSeconds : 0;
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layoutId: `timer-card-${timer.id}`,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      "data-ocid": "timer.fullscreen_overlay",
      className: "fixed inset-0 z-50 flex flex-col items-center justify-center",
      style: {
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        background: "oklch(0.05 0.03 230 / 0.92)"
      },
      onClick: onClose,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onClose();
      },
      role: "presentation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0",
            "aria-hidden": "true",
            style: {
              background: "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.75 0.18 220 / 0.12) 0%, transparent 70%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Exit fullscreen",
            "data-ocid": "timer.fullscreen.close_button",
            onClick: onClose,
            className: "absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-2xl glass text-vibrant-secondary hover:text-vibrant-primary transition-all duration-200",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-8",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            role: "presentation",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { width: 300, height: 300 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ProgressRing,
                  {
                    size: 300,
                    strokeWidth: 16,
                    progress,
                    isRunning: timer.isRunning,
                    isFinished: timer.isFinished,
                    color: timer.isFinished ? "gold" : "cyan"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: timer.isFinished ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.span,
                  {
                    initial: { scale: 0.5, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    className: "text-5xl font-bold",
                    style: { color: "oklch(0.85 0.20 85)" },
                    children: "Done!"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-mono-clock font-bold text-vibrant-primary",
                    style: { fontSize: 64, letterSpacing: "0.02em" },
                    children: formatTime(timer.remainingSeconds)
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-vibrant-secondary", children: timer.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-vibrant-tertiary mt-1", children: "Tap anywhere to exit" })
              ] }),
              !timer.isFinished && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: timer.isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlassButton,
                {
                  size: "lg",
                  variant: "default",
                  "data-ocid": "timer.fullscreen.pause_button",
                  onClick: (e) => {
                    e.stopPropagation();
                    onPause(timer.id);
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" }),
                  children: "Pause"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlassButton,
                {
                  size: "lg",
                  variant: "primary",
                  "data-ocid": "timer.fullscreen.resume_button",
                  onClick: (e) => {
                    e.stopPropagation();
                    onResume(timer.id);
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5" }),
                  children: "Resume"
                }
              ) })
            ]
          }
        )
      ]
    }
  );
}
const QUICK_PRESETS = [
  { name: "Pomodoro", h: 0, m: 25, s: 0 },
  { name: "Short Break", h: 0, m: 5, s: 0 },
  { name: "Tabata Work", h: 0, m: 0, s: 20 },
  { name: "Tabata Rest", h: 0, m: 0, s: 10 }
];
function AddTimerModal({ onAdd, onClose }) {
  const [name, setName] = reactExports.useState("");
  const [hours, setHours] = reactExports.useState(0);
  const [minutes, setMinutes] = reactExports.useState(5);
  const [seconds, setSeconds] = reactExports.useState(0);
  const applyQuickPreset = (p) => {
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
  reactExports.useEffect(() => {
    const handler = (e) => {
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
    ocid
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-vibrant-tertiary uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center glass rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(Math.min(max, value + 1)),
          className: "w-14 h-8 flex items-center justify-center text-vibrant-secondary hover:text-vibrant-primary hover:bg-white/5 transition-colors",
          "aria-label": `Increase ${label}`,
          children: "▲"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "number",
          min: 0,
          max,
          value,
          "data-ocid": ocid,
          onChange: (e) => onChange(Math.max(0, Math.min(max, Number(e.target.value)))),
          className: "w-14 h-10 bg-transparent text-center text-mono-clock text-xl font-bold text-vibrant-primary focus:outline-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(Math.max(0, value - 1)),
          className: "w-14 h-8 flex items-center justify-center text-vibrant-secondary hover:text-vibrant-primary hover:bg-white/5 transition-colors",
          "aria-label": `Decrease ${label}`,
          children: "▼"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
      className: "fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4",
      style: { backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.6)" },
      onClick: onClose,
      "data-ocid": "timer.add_timer.dialog",
      role: "presentation",
      "aria-label": "Add Timer",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 40, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 40, scale: 0.94 },
          transition: { duration: 0.28, ease: [0.34, 1.2, 0.64, 1] },
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { variant: "heavy", glow: "md", radius: "2xl", noPadding: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-vibrant-primary", children: "New Timer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "data-ocid": "timer.add_timer.close_button",
                  "aria-label": "Close",
                  className: "h-8 w-8 flex items-center justify-center rounded-xl glass text-vibrant-tertiary hover:text-vibrant-primary transition-all",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary uppercase tracking-wider mb-1.5", children: "Name (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Timer",
                  value: name,
                  "data-ocid": "timer.name.input",
                  onChange: (e) => setName(e.target.value),
                  className: "w-full h-10 px-3 glass rounded-xl text-sm text-vibrant-primary placeholder:text-vibrant-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary uppercase tracking-wider mb-3", children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: hours,
                    max: 23,
                    onChange: setHours,
                    label: "H",
                    ocid: "timer.hours.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-mono text-vibrant-tertiary pb-3", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: minutes,
                    max: 59,
                    onChange: setMinutes,
                    label: "M",
                    ocid: "timer.minutes.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-mono text-vibrant-tertiary pb-3", children: ":" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NumberInput,
                  {
                    value: seconds,
                    max: 59,
                    onChange: setSeconds,
                    label: "S",
                    ocid: "timer.seconds.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary uppercase tracking-wider mb-2", children: "Quick Select" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: QUICK_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `timer.quick_preset.${p.name.toLowerCase().replace(/\s+/g, "_")}`,
                  onClick: () => applyQuickPreset(p),
                  className: "px-3 py-1.5 rounded-full text-xs font-medium glass-light text-vibrant-secondary hover:text-vibrant-primary hover:glass transition-all duration-200",
                  children: [
                    p.name,
                    " ",
                    formatTime(p.h * 3600 + p.m * 60 + p.s)
                  ]
                },
                p.name
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GlassButton,
              {
                variant: "primary",
                size: "lg",
                "data-ocid": "timer.start.submit_button",
                onClick: handleStart,
                disabled: hours === 0 && minutes === 0 && seconds === 0,
                className: "w-full",
                children: "Start Timer"
              }
            )
          ] }) })
        }
      )
    }
  );
}
function EditPresetsModal({
  presets,
  onSave,
  onDelete,
  onClose
}) {
  const [form, setForm] = reactExports.useState({
    name: "",
    durationSeconds: 300,
    category: "custom"
  });
  const [formMinutes, setFormMinutes] = reactExports.useState(5);
  const [formSeconds, setFormSeconds] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const handler = (e) => {
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
      category: form.category
    });
    setForm({ name: "", durationSeconds: 300, category: "custom" });
    setFormMinutes(5);
    setFormSeconds(0);
  };
  const CATEGORIES = ["focus", "break", "exercise", "custom"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4",
      style: { backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.6)" },
      onClick: onClose,
      "data-ocid": "timer.edit_presets.dialog",
      role: "presentation",
      "aria-label": "Edit Presets",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 40, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 40, scale: 0.94 },
          transition: { duration: 0.28, ease: [0.34, 1.2, 0.64, 1] },
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { variant: "heavy", glow: "md", radius: "2xl", noPadding: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-vibrant-primary", children: "Edit Presets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "data-ocid": "timer.edit_presets.close_button",
                  "aria-label": "Close",
                  className: "h-8 w-8 flex items-center justify-center rounded-xl glass text-vibrant-tertiary hover:text-vibrant-primary transition-all",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 max-h-52 overflow-y-auto scrollbar-hide", children: presets.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `timer.preset.item.${i + 1}`,
                className: "flex items-center justify-between px-3 py-2 glass rounded-xl",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-vibrant-primary", children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-vibrant-tertiary ml-2", children: formatPresetDuration(p.durationSeconds) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": `Delete ${p.name}`,
                      "data-ocid": `timer.preset.delete_button.${i + 1}`,
                      onClick: () => onDelete(p.id),
                      className: "h-7 w-7 flex items-center justify-center rounded-lg text-vibrant-tertiary hover:text-warning transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              },
              p.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/8 pt-4 flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary uppercase tracking-wider", children: "Add Custom Preset" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Preset name",
                  value: form.name,
                  "data-ocid": "timer.preset.name.input",
                  onChange: (e) => setForm({ ...form, name: e.target.value }),
                  className: "w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary placeholder:text-vibrant-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary mb-1", children: "Min" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 1440,
                      value: formMinutes,
                      "data-ocid": "timer.preset.minutes.input",
                      onChange: (e) => setFormMinutes(Math.max(0, Number(e.target.value))),
                      className: "w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary mb-1", children: "Sec" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: formSeconds,
                      "data-ocid": "timer.preset.seconds.input",
                      onChange: (e) => setFormSeconds(
                        Math.max(0, Math.min(59, Number(e.target.value)))
                      ),
                      className: "w-full h-9 px-3 glass rounded-xl text-sm text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-vibrant-tertiary mb-1", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: form.category,
                      "data-ocid": "timer.preset.category.select",
                      onChange: (e) => setForm({ ...form, category: e.target.value }),
                      className: "w-full h-9 px-2 glass rounded-xl text-xs text-vibrant-primary focus:outline-none focus:ring-2 focus:ring-primary/40 bg-transparent",
                      children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-[#0d1117]", children: c }, c))
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                GlassButton,
                {
                  variant: "default",
                  size: "md",
                  "data-ocid": "timer.preset.add_button",
                  onClick: handleAdd,
                  disabled: !form.name.trim() || formMinutes === 0 && formSeconds === 0,
                  className: "w-full",
                  children: "Add Preset"
                }
              )
            ] })
          ] }) })
        }
      )
    }
  );
}
const CATEGORY_COLORS = {
  focus: "oklch(0.75 0.18 220 / 0.25)",
  break: "oklch(0.70 0.18 145 / 0.2)",
  exercise: "oklch(0.65 0.18 25 / 0.2)",
  hiit: "oklch(0.65 0.18 25 / 0.2)",
  custom: "oklch(0.65 0.18 270 / 0.2)"
};
function TimerPage() {
  const [timers, dispatch] = reactExports.useReducer(timerReducer, []);
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [showEditPresets, setShowEditPresets] = reactExports.useState(false);
  const [fullscreenId, setFullscreenId] = reactExports.useState(null);
  const { presets, savePreset, deletePreset } = useTimerPresets();
  const rafRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const tick = () => {
      dispatch({ type: "TICK", now: Date.now() });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    for (const t of timers) {
      if (t.isRunning && t.remainingSeconds === 0 && !t.isFinished) {
        dispatch({ type: "FINISH", id: t.id });
      }
    }
  }, [timers]);
  const finishedIds = timers.filter((t) => t.isFinished).map((t) => t.id).join(",");
  reactExports.useEffect(() => {
    if (!finishedIds) return;
    const ids = finishedIds.split(",");
    const handles = ids.map(
      (id) => setTimeout(() => dispatch({ type: "DISMISS", id }), 5e3)
    );
    return () => {
      for (const h of handles) clearTimeout(h);
    };
  }, [finishedIds]);
  const addTimer = reactExports.useCallback((name, durationSeconds) => {
    const timer = {
      id: newId(),
      name,
      durationSeconds,
      remainingSeconds: durationSeconds,
      isRunning: true,
      isPaused: false,
      isFinished: false,
      startedAt: Date.now(),
      pausedAt: null
    };
    dispatch({ type: "ADD", timer });
  }, []);
  const startFromPreset = reactExports.useCallback((preset) => {
    const secs = Number(preset.durationSeconds);
    const timer = {
      id: newId(),
      name: preset.name,
      durationSeconds: secs,
      remainingSeconds: secs,
      isRunning: true,
      isPaused: false,
      isFinished: false,
      startedAt: Date.now(),
      pausedAt: null
    };
    dispatch({ type: "ADD", timer });
  }, []);
  const fullscreenTimer = timers.find((t) => t.id === fullscreenId) ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen px-4 pt-8 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 flex items-center justify-center rounded-xl glass", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-4 h-4 text-vibrant-secondary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-display text-2xl font-bold text-vibrant-primary", children: "Timer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        GlassButton,
        {
          variant: "primary",
          size: "sm",
          "data-ocid": "timer.add_timer.open_modal_button",
          onClick: () => setShowAddModal(true),
          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          className: "glow-cyan-sm",
          children: "New Timer"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: timers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        "data-ocid": "timer.empty_state",
        className: "flex flex-col items-center justify-center py-16 gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-20 w-20 rounded-3xl glass flex items-center justify-center",
              style: {
                boxShadow: "0 0 30px oklch(0.75 0.18 220 / 0.15)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-9 h-9 text-vibrant-tertiary" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-vibrant-secondary font-medium", children: "No active timers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-vibrant-tertiary mt-1", children: "Start a preset or create a custom timer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GlassButton,
            {
              variant: "primary",
              size: "md",
              "data-ocid": "timer.empty_state.add_button",
              onClick: () => setShowAddModal(true),
              leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              children: "Start Timer"
            }
          )
        ]
      },
      "empty"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: timers.map((timer, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TimerCard,
      {
        timer,
        index: i,
        onPause: (id) => dispatch({ type: "PAUSE", id }),
        onResume: (id) => dispatch({ type: "RESUME", id }),
        onCancel: (id) => {
          if (fullscreenId === id) setFullscreenId(null);
          dispatch({ type: "CANCEL", id });
        },
        onDismiss: (id) => {
          if (fullscreenId === id) setFullscreenId(null);
          dispatch({ type: "DISMISS", id });
        },
        onFullscreen: (id) => setFullscreenId(id)
      },
      timer.id
    )) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-vibrant-secondary uppercase tracking-wider", children: "Presets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "timer.edit_presets.open_modal_button",
            onClick: () => setShowEditPresets(true),
            className: "flex items-center gap-1.5 text-xs text-vibrant-tertiary hover:text-vibrant-secondary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-3.5 h-3.5" }),
              "Edit"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex gap-3 overflow-x-auto scrollbar-hide pb-2",
          "data-ocid": "timer.presets.list",
          children: presets.map((preset, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              "data-ocid": `timer.preset.chip.${i + 1}`,
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: i * 0.05 },
              whileHover: { scale: 1.04 },
              whileTap: { scale: 0.96 },
              onClick: () => startFromPreset(preset),
              className: "flex-shrink-0 flex flex-col items-start gap-1 px-4 py-3 rounded-2xl glass-light hover:glass transition-all duration-200 min-w-[110px]",
              style: {
                borderColor: CATEGORY_COLORS[preset.category] ?? "transparent"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-vibrant-primary whitespace-nowrap", children: preset.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-vibrant-secondary font-mono", children: formatPresetDuration(preset.durationSeconds) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                    style: {
                      background: CATEGORY_COLORS[preset.category] ?? "oklch(0.65 0.18 270 / 0.2)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-vibrant-tertiary", children: preset.category })
                  }
                )
              ]
            },
            preset.id
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      showAddModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
        AddTimerModal,
        {
          onAdd: addTimer,
          onClose: () => setShowAddModal(false)
        },
        "add-modal"
      ),
      showEditPresets && /* @__PURE__ */ jsxRuntimeExports.jsx(
        EditPresetsModal,
        {
          presets,
          onSave: savePreset,
          onDelete: deletePreset,
          onClose: () => setShowEditPresets(false)
        },
        "edit-presets"
      ),
      fullscreenTimer && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FullscreenTimer,
        {
          timer: fullscreenTimer,
          onClose: () => setFullscreenId(null),
          onPause: (id) => dispatch({ type: "PAUSE", id }),
          onResume: (id) => dispatch({ type: "RESUME", id })
        },
        "fullscreen"
      )
    ] })
  ] });
}
export {
  TimerPage as default
};
