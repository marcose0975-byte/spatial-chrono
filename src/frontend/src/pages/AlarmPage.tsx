import GlassButton from "@/components/layout/GlassButton";
import GlassCard from "@/components/layout/GlassCard";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAlarms } from "@/hooks/use-clock-data";
import { cn } from "@/lib/utils";
import type { AlarmFormData, AlarmRecord } from "@/types";
import { Bell, BellPlus, Brain, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const DAY_FULL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function generateId(): string {
  return `alarm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatAlarmTime(hour: number, minute: number): string {
  const h = hour.toString().padStart(2, "0");
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m}`;
}

function generateMathProblem(): { question: string; answer: number } {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * 3)];
  let a: number;
  let b: number;
  let answer: number;
  if (op === "+") {
    a = Math.floor(Math.random() * 19) + 2;
    b = Math.floor(Math.random() * 19) + 2;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 19) + 10;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

// ─── Math Dismissal Dialog ────────────────────────────────────────────────────
function MathDismissalDialog({
  open,
  onDismiss,
  onClose,
}: {
  open: boolean;
  onDismiss: () => void;
  onClose: () => void;
}) {
  const [problem] = useState(() => generateMathProblem());
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLInputElement>(null);

  const isCorrect =
    answer.trim() !== "" &&
    Number.parseInt(answer.trim(), 10) === problem.answer;

  useEffect(() => {
    if (open) {
      setAnswer("");
      setIsWrong(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleDismiss = useCallback(() => {
    if (!isCorrect) {
      setIsWrong(true);
      animate(
        scope.current,
        { x: [-8, 8, -6, 6, -4, 4, 0] },
        { duration: 0.45 },
      );
      setTimeout(() => setIsWrong(false), 500);
      return;
    }
    onDismiss();
  }, [isCorrect, onDismiss, animate, scope]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleDismiss();
    },
    [handleDismiss],
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="glass-heavy border-white/15 max-w-sm"
        style={{ background: "oklch(0.12 0.03 245 / 0.92)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-vibrant-primary flex items-center gap-2 text-lg font-bold">
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1.4,
              }}
            >
              <Bell className="w-5 h-5 text-primary" />
            </motion.div>
            Alarm Ringing
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-vibrant-secondary text-sm mb-2">
              Solve to dismiss
            </p>
            <p className="text-display text-2xl font-bold text-vibrant-primary">
              {problem.question}
            </p>
          </div>

          <div ref={scope}>
            <Label
              htmlFor="math-answer"
              className="text-vibrant-secondary text-sm sr-only"
            >
              Your answer
            </Label>
            <Input
              id="math-answer"
              ref={inputRef}
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter answer..."
              data-ocid="alarm.math_input"
              className={cn(
                "bg-white/5 border-white/15 text-vibrant-primary text-center text-xl font-mono h-12 rounded-xl",
                "focus:border-primary/60 focus:ring-primary/30 transition-all duration-200",
                isWrong && "border-red-500/60 ring-1 ring-red-500/30",
              )}
            />
            {isWrong && (
              <p
                className="text-warning text-xs mt-1 text-center"
                data-ocid="alarm.math_error"
              >
                Incorrect — try again
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <GlassButton
              variant={isCorrect ? "success" : "default"}
              className="flex-1"
              onClick={handleDismiss}
              disabled={answer.trim() === ""}
              data-ocid="alarm.math_dismiss_button"
            >
              Dismiss
            </GlassButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Alarm Form Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM: AlarmFormData = {
  name: "",
  timeHour: 7,
  timeMinute: 0,
  isEnabled: true,
  repeatDays: [],
  requireMathProblem: false,
};

function AlarmFormDialog({
  open,
  editAlarm,
  onSave,
  onClose,
}: {
  open: boolean;
  editAlarm: AlarmRecord | null;
  onSave: (form: AlarmFormData, id?: string) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<AlarmFormData>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      if (editAlarm) {
        setForm({
          name: editAlarm.name,
          timeHour: Number(editAlarm.timeHour),
          timeMinute: Number(editAlarm.timeMinute),
          isEnabled: editAlarm.isEnabled,
          repeatDays: editAlarm.repeatDays.map(Number),
          requireMathProblem: editAlarm.requireMathProblem,
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [open, editAlarm]);

  const timeValue = `${form.timeHour.toString().padStart(2, "0")}:${form.timeMinute.toString().padStart(2, "0")}`;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [h, m] = e.target.value.split(":").map(Number);
    setForm((f) => ({ ...f, timeHour: h || 0, timeMinute: m || 0 }));
  };

  const toggleDay = (day: number) => {
    setForm((f) => ({
      ...f,
      repeatDays: f.repeatDays.includes(day)
        ? f.repeatDays.filter((d) => d !== day)
        : [...f.repeatDays, day],
    }));
  };

  const handleSave = () => {
    onSave(form, editAlarm?.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="glass-heavy border-white/15 max-w-md"
        style={{ background: "oklch(0.12 0.03 245 / 0.95)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-vibrant-primary font-bold text-lg">
            {editAlarm ? "Edit Alarm" : "New Alarm"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Time picker */}
          <div className="flex flex-col items-center gap-2">
            <input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              data-ocid="alarm.time_input"
              className={cn(
                "text-5xl font-mono font-bold text-vibrant-primary text-center bg-transparent",
                "border-0 outline-none cursor-pointer w-full",
                "appearance-none [color-scheme:dark]",
              )}
            />
          </div>

          {/* Name input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="alarm-name"
              className="text-vibrant-secondary text-sm"
            >
              Label
            </Label>
            <Input
              id="alarm-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Alarm"
              data-ocid="alarm.name_input"
              className="bg-white/5 border-white/15 text-vibrant-primary rounded-xl focus:border-primary/60 focus:ring-primary/30"
            />
          </div>

          {/* Repeat days */}
          <div className="space-y-2">
            <Label className="text-vibrant-secondary text-sm">Repeat</Label>
            <div className="flex gap-1.5 flex-wrap">
              {DAY_FULL.map((day, idx) => {
                const active = form.repeatDays.includes(idx);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    data-ocid={`alarm.repeat_day.${idx + 1}`}
                    className={cn(
                      "h-9 px-3 rounded-full text-xs font-medium transition-all duration-200 select-none",
                      active
                        ? "text-[oklch(0.08_0.02_245)] shadow-glass-glow"
                        : "glass text-vibrant-tertiary hover:text-vibrant-secondary hover:border-white/20",
                    )}
                    style={
                      active
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(0.78 0.20 220) 0%, oklch(0.68 0.22 230) 100%)",
                            border: "1px solid rgba(255,255,255,0.25)",
                          }
                        : undefined
                    }
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Math problem toggle */}
          <div className="glass rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4 text-primary" />
              <div>
                <p className="text-vibrant-primary text-sm font-medium">
                  Math to dismiss
                </p>
                <p className="text-vibrant-tertiary text-xs">
                  Solve a problem to turn off
                </p>
              </div>
            </div>
            <Switch
              checked={form.requireMathProblem}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, requireMathProblem: v }))
              }
              data-ocid="alarm.math_toggle"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <GlassButton
              variant="ghost"
              className="flex-1"
              onClick={onClose}
              data-ocid="alarm.form_cancel_button"
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              data-ocid="alarm.form_save_button"
            >
              Save
            </GlassButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Single Alarm Card ────────────────────────────────────────────────────────
function AlarmCard({
  alarm,
  index,
  onToggle,
  onDelete,
  onEdit,
  onRing,
}: {
  alarm: AlarmRecord;
  index: number;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: AlarmRecord) => void;
  onRing: (alarm: AlarmRecord) => void;
}) {
  const hour = Number(alarm.timeHour);
  const minute = Number(alarm.timeMinute);
  const activeDays = alarm.repeatDays.map(Number);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      data-ocid={`alarm.item.${index + 1}`}
    >
      <GlassCard
        variant={alarm.isEnabled ? "default" : "light"}
        glow={alarm.isEnabled ? "sm" : "none"}
        radius="2xl"
        noPadding
        className={cn(
          "overflow-hidden transition-all duration-300",
          alarm.isEnabled && "hover:glow-cyan-sm",
        )}
      >
        <div className="p-4 flex items-center gap-3">
          {/* Tap area for ring simulation */}
          <button
            type="button"
            className="flex-1 text-left min-w-0 focus:outline-none"
            onClick={() => onEdit(alarm)}
            aria-label={`Edit alarm at ${formatAlarmTime(hour, minute)}`}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className={cn(
                  "text-mono-clock text-4xl font-bold leading-none",
                  alarm.isEnabled
                    ? "text-vibrant-primary"
                    : "text-vibrant-tertiary",
                )}
              >
                {formatAlarmTime(hour, minute)}
              </span>
              {alarm.requireMathProblem && (
                <span
                  className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: "oklch(0.65 0.18 270 / 0.18)",
                    border: "1px solid oklch(0.65 0.18 270 / 0.35)",
                    color: "oklch(0.75 0.18 270)",
                  }}
                  title="Requires math problem to dismiss"
                >
                  <Brain className="w-2.5 h-2.5" />
                  Math
                </span>
              )}
            </div>

            <p
              className={cn(
                "text-sm truncate",
                alarm.isEnabled
                  ? "text-vibrant-secondary"
                  : "text-vibrant-tertiary",
              )}
            >
              {alarm.name || "Alarm"}
            </p>

            {/* Day pills */}
            {activeDays.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {DAY_LABELS.map((day, idx) => {
                  const isActive = activeDays.includes(idx);
                  return isActive ? (
                    <span
                      key={day}
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        background: alarm.isEnabled
                          ? "oklch(0.75 0.18 220 / 0.22)"
                          : "oklch(0.4 0.02 245 / 0.3)",
                        color: alarm.isEnabled
                          ? "oklch(0.85 0.12 220)"
                          : "oklch(0.5 0.03 245)",
                        border: alarm.isEnabled
                          ? "1px solid oklch(0.75 0.18 220 / 0.3)"
                          : "1px solid oklch(0.4 0.02 245 / 0.2)",
                      }}
                    >
                      {day}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Simulate ring */}
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => onRing(alarm)}
              aria-label="Test ring alarm"
              data-ocid={`alarm.ring_button.${index + 1}`}
              className="w-8 h-8"
            >
              <Bell className="w-3.5 h-3.5" />
            </GlassButton>

            {/* Delete */}
            <GlassButton
              variant="danger"
              size="icon"
              onClick={() => onDelete(alarm.id)}
              aria-label="Delete alarm"
              data-ocid={`alarm.delete_button.${index + 1}`}
              className="w-8 h-8"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </GlassButton>

            {/* Toggle */}
            <Switch
              checked={alarm.isEnabled}
              onCheckedChange={(v) => onToggle(alarm.id, v)}
              data-ocid={`alarm.toggle.${index + 1}`}
              className={cn(
                "transition-all duration-300",
                alarm.isEnabled &&
                  "data-[state=checked]:bg-primary shadow-[0_0_10px_oklch(0.75_0.18_220_/_0.4)]",
              )}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AlarmPage() {
  const { alarms, saveAlarm, deleteAlarm, toggleAlarm } = useAlarms();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AlarmRecord | null>(null);
  const [ringTarget, setRingTarget] = useState<AlarmRecord | null>(null);

  const sortedAlarms = useMemo(
    () =>
      [...alarms].sort((a, b) => {
        const aMin = Number(a.timeHour) * 60 + Number(a.timeMinute);
        const bMin = Number(b.timeHour) * 60 + Number(b.timeMinute);
        return aMin - bMin;
      }),
    [alarms],
  );

  const handleOpenAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (alarm: AlarmRecord) => {
    setEditTarget(alarm);
    setFormOpen(true);
  };

  const handleSaveForm = useCallback(
    (form: AlarmFormData, id?: string) => {
      const record: AlarmRecord = {
        id: id ?? generateId(),
        name: form.name,
        timeHour: BigInt(form.timeHour),
        timeMinute: BigInt(form.timeMinute),
        isEnabled: form.isEnabled,
        repeatDays: form.repeatDays.map(BigInt),
        requireMathProblem: form.requireMathProblem,
      };
      saveAlarm(record);
    },
    [saveAlarm],
  );

  const handleDismissMath = useCallback(() => {
    setRingTarget(null);
  }, []);

  const handleRing = useCallback((alarm: AlarmRecord) => {
    if (alarm.requireMathProblem) {
      setRingTarget(alarm);
    }
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen px-4 pt-8 pb-4"
      data-ocid="alarm.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-display text-3xl font-bold text-vibrant-primary"
        >
          Alarms
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassButton
            variant="default"
            size="md"
            leftIcon={<BellPlus className="w-4 h-4 text-primary" />}
            onClick={handleOpenAdd}
            data-ocid="alarm.add_button"
            className="glow-cyan-sm border-primary/30 hover:border-primary/50"
          >
            Add Alarm
          </GlassButton>
        </motion.div>
      </div>

      {/* Alarm list */}
      <div className="flex-1 space-y-3" data-ocid="alarm.list">
        <AnimatePresence mode="popLayout">
          {sortedAlarms.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="alarm.empty_state"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center glass"
                  style={{ boxShadow: "0 0 40px oklch(0.75 0.18 220 / 0.12)" }}
                >
                  <Bell className="w-9 h-9 text-vibrant-tertiary" />
                </div>
                <div
                  className="absolute inset-0 rounded-full opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.75 0.18 220 / 0.08) 0%, transparent 70%)",
                  }}
                />
              </motion.div>
              <div className="text-center">
                <p className="text-vibrant-secondary font-medium text-lg">
                  No alarms set
                </p>
                <p className="text-vibrant-tertiary text-sm mt-1">
                  Tap "Add Alarm" to get started
                </p>
              </div>
              <GlassButton
                variant="default"
                leftIcon={<BellPlus className="w-4 h-4 text-primary" />}
                onClick={handleOpenAdd}
                data-ocid="alarm.empty_add_button"
                className="mt-2 border-primary/30"
              >
                Add Your First Alarm
              </GlassButton>
            </motion.div>
          ) : (
            sortedAlarms.map((alarm, index) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                index={index}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
                onEdit={handleEdit}
                onRing={handleRing}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add / Edit Dialog */}
      <AlarmFormDialog
        open={formOpen}
        editAlarm={editTarget}
        onSave={handleSaveForm}
        onClose={() => setFormOpen(false)}
      />

      {/* Math Dismissal Dialog */}
      <MathDismissalDialog
        open={ringTarget !== null}
        onDismiss={handleDismissMath}
        onClose={() => setRingTarget(null)}
      />
    </div>
  );
}
