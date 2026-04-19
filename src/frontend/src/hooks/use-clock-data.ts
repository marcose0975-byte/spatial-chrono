import type { AlarmRecord, PinnedZone, TimerPreset } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useBackend } from "./use-backend";

// ─── Storage keys ──────────────────────────────────────────────────────────────
const ALARMS_KEY = "clock_alarms";
const ZONES_KEY = "clock_pinned_zones";
const PRESETS_KEY = "clock_timer_presets";

function loadList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    // ignore
  }
  return [];
}

function saveList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
}

// ─── Alarms ───────────────────────────────────────────────────────────────────
export function useAlarms() {
  const queryClient = useQueryClient();
  const { actor, isReady } = useBackend();

  const { data: alarms = [], isLoading } = useQuery<AlarmRecord[]>({
    queryKey: ["alarms"],
    queryFn: async () => {
      if (!actor) return loadList<AlarmRecord>(ALARMS_KEY);
      const result = await actor.getAlarms();
      // Persist locally as fallback
      saveList(ALARMS_KEY, result);
      return result;
    },
    enabled: true,
    placeholderData: () => loadList<AlarmRecord>(ALARMS_KEY),
    staleTime: 1000 * 30,
  });

  const saveAlarmMutation = useMutation({
    mutationFn: async (alarm: AlarmRecord) => {
      const current = queryClient.getQueryData<AlarmRecord[]>(["alarms"]) ?? [];
      const idx = current.findIndex((a) => a.id === alarm.id);
      const updated =
        idx >= 0
          ? current.map((a) => (a.id === alarm.id ? alarm : a))
          : [...current, alarm];
      saveList(ALARMS_KEY, updated);
      queryClient.setQueryData(["alarms"], updated);
      if (actor && isReady) await actor.saveAlarm(alarm);
    },
  });

  const deleteAlarmMutation = useMutation({
    mutationFn: async (id: string) => {
      const current = queryClient.getQueryData<AlarmRecord[]>(["alarms"]) ?? [];
      const updated = current.filter((a) => a.id !== id);
      saveList(ALARMS_KEY, updated);
      queryClient.setQueryData(["alarms"], updated);
      if (actor && isReady) await actor.deleteAlarm(id);
    },
  });

  const toggleAlarmMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const current = queryClient.getQueryData<AlarmRecord[]>(["alarms"]) ?? [];
      const updated = current.map((a) =>
        a.id === id ? { ...a, isEnabled: enabled } : a,
      );
      saveList(ALARMS_KEY, updated);
      queryClient.setQueryData(["alarms"], updated);
      if (actor && isReady) await actor.toggleAlarm(id, enabled);
    },
  });

  return {
    alarms,
    isLoading,
    saveAlarm: useCallback(
      (alarm: AlarmRecord) => saveAlarmMutation.mutate(alarm),
      [saveAlarmMutation],
    ),
    deleteAlarm: useCallback(
      (id: string) => deleteAlarmMutation.mutate(id),
      [deleteAlarmMutation],
    ),
    toggleAlarm: useCallback(
      (id: string, enabled: boolean) =>
        toggleAlarmMutation.mutate({ id, enabled }),
      [toggleAlarmMutation],
    ),
    isSaving: saveAlarmMutation.isPending,
    isDeleting: deleteAlarmMutation.isPending,
  };
}

// ─── Pinned Zones ─────────────────────────────────────────────────────────────
export function usePinnedZones() {
  const queryClient = useQueryClient();
  const { actor, isReady } = useBackend();

  const DEFAULT_ZONES: PinnedZone[] = [
    {
      id: "london",
      cityName: "London",
      timezone: "Europe/London",
      countryCode: "GB",
    },
    {
      id: "new-york",
      cityName: "New York",
      timezone: "America/New_York",
      countryCode: "US",
    },
    {
      id: "tokyo",
      cityName: "Tokyo",
      timezone: "Asia/Tokyo",
      countryCode: "JP",
    },
    {
      id: "sydney",
      cityName: "Sydney",
      timezone: "Australia/Sydney",
      countryCode: "AU",
    },
  ];

  const { data: zones = [], isLoading } = useQuery<PinnedZone[]>({
    queryKey: ["pinnedZones"],
    queryFn: async () => {
      if (!actor) {
        const stored = loadList<PinnedZone>(ZONES_KEY);
        return stored.length > 0 ? stored : DEFAULT_ZONES;
      }
      const result = await actor.getPinnedZones();
      const final = result.length > 0 ? result : DEFAULT_ZONES;
      saveList(ZONES_KEY, final);
      return final;
    },
    enabled: true,
    placeholderData: () => {
      const stored = loadList<PinnedZone>(ZONES_KEY);
      return stored.length > 0 ? stored : DEFAULT_ZONES;
    },
    staleTime: 1000 * 60,
  });

  const addZoneMutation = useMutation({
    mutationFn: async (zone: PinnedZone) => {
      const current =
        queryClient.getQueryData<PinnedZone[]>(["pinnedZones"]) ?? [];
      if (current.find((z) => z.id === zone.id)) return;
      const updated = [...current, zone];
      saveList(ZONES_KEY, updated);
      queryClient.setQueryData(["pinnedZones"], updated);
      if (actor && isReady) await actor.addPinnedZone(zone);
    },
  });

  const removeZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const current =
        queryClient.getQueryData<PinnedZone[]>(["pinnedZones"]) ?? [];
      const updated = current.filter((z) => z.id !== id);
      saveList(ZONES_KEY, updated);
      queryClient.setQueryData(["pinnedZones"], updated);
      if (actor && isReady) await actor.removePinnedZone(id);
    },
  });

  return {
    zones,
    isLoading,
    addZone: useCallback(
      (zone: PinnedZone) => addZoneMutation.mutate(zone),
      [addZoneMutation],
    ),
    removeZone: useCallback(
      (id: string) => removeZoneMutation.mutate(id),
      [removeZoneMutation],
    ),
    isAdding: addZoneMutation.isPending,
  };
}

// ─── Timer Presets ────────────────────────────────────────────────────────────
export function useTimerPresets() {
  const queryClient = useQueryClient();
  const { actor, isReady } = useBackend();

  const DEFAULT_PRESETS: TimerPreset[] = [
    {
      id: "pomodoro",
      name: "Pomodoro",
      durationSeconds: 1500n,
      category: "focus",
    },
    {
      id: "short-break",
      name: "Short Break",
      durationSeconds: 300n,
      category: "break",
    },
    {
      id: "long-break",
      name: "Long Break",
      durationSeconds: 900n,
      category: "break",
    },
    {
      id: "tabata-work",
      name: "Tabata Work",
      durationSeconds: 20n,
      category: "exercise",
    },
    {
      id: "tabata-rest",
      name: "Tabata Rest",
      durationSeconds: 10n,
      category: "exercise",
    },
  ];

  const { data: presets = [], isLoading } = useQuery<TimerPreset[]>({
    queryKey: ["timerPresets"],
    queryFn: async () => {
      if (!actor) {
        const stored = loadList<TimerPreset>(PRESETS_KEY);
        return stored.length > 0 ? stored : DEFAULT_PRESETS;
      }
      const result = await actor.getTimerPresets();
      const final = result.length > 0 ? result : DEFAULT_PRESETS;
      saveList(PRESETS_KEY, final);
      return final;
    },
    enabled: true,
    placeholderData: () => {
      const stored = loadList<TimerPreset>(PRESETS_KEY);
      return stored.length > 0 ? stored : DEFAULT_PRESETS;
    },
    staleTime: 1000 * 60,
  });

  const savePresetMutation = useMutation({
    mutationFn: async (preset: TimerPreset) => {
      const current =
        queryClient.getQueryData<TimerPreset[]>(["timerPresets"]) ?? [];
      const idx = current.findIndex((p) => p.id === preset.id);
      const updated =
        idx >= 0
          ? current.map((p) => (p.id === preset.id ? preset : p))
          : [...current, preset];
      saveList(PRESETS_KEY, updated);
      queryClient.setQueryData(["timerPresets"], updated);
      if (actor && isReady) await actor.saveTimerPreset(preset);
    },
  });

  const deletePresetMutation = useMutation({
    mutationFn: async (id: string) => {
      const current =
        queryClient.getQueryData<TimerPreset[]>(["timerPresets"]) ?? [];
      const updated = current.filter((p) => p.id !== id);
      saveList(PRESETS_KEY, updated);
      queryClient.setQueryData(["timerPresets"], updated);
      if (actor && isReady) await actor.deleteTimerPreset(id);
    },
  });

  return {
    presets,
    isLoading,
    savePreset: useCallback(
      (preset: TimerPreset) => savePresetMutation.mutate(preset),
      [savePresetMutation],
    ),
    deletePreset: useCallback(
      (id: string) => deletePresetMutation.mutate(id),
      [deletePresetMutation],
    ),
    isSaving: savePresetMutation.isPending,
    isDeleting: deletePresetMutation.isPending,
  };
}
