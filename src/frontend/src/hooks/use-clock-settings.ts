import type { UserSettings } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useBackend } from "./use-backend";

const SETTINGS_KEY = "clock_user_settings";

const DEFAULT_SETTINGS: UserSettings = {
  use24HourFormat: false,
};

function loadFromStorage(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveToStorage(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useClockSettings() {
  const queryClient = useQueryClient();
  const { actor, isReady } = useBackend();

  // Local fallback state initialised from localStorage
  const [localSettings, setLocalSettings] =
    useState<UserSettings>(loadFromStorage);

  // Fetch from backend when ready
  const { data: backendSettings } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      if (!actor) return loadFromStorage();
      const result = await actor.getUserSettings();
      return result;
    },
    enabled: isReady,
    staleTime: 1000 * 60 * 5,
  });

  // Sync backend → local when loaded
  useEffect(() => {
    if (backendSettings) {
      setLocalSettings(backendSettings);
      saveToStorage(backendSettings);
    }
  }, [backendSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: UserSettings) => {
      saveToStorage(settings);
      if (actor && isReady) {
        await actor.saveUserSettings(settings);
      }
    },
    onSuccess: (_, settings) => {
      queryClient.setQueryData(["userSettings"], settings);
    },
  });

  const settings: UserSettings = backendSettings ?? localSettings;

  const toggle24Hour = useCallback(() => {
    const updated = { ...settings, use24HourFormat: !settings.use24HourFormat };
    setLocalSettings(updated);
    saveSettingsMutation.mutate(updated);
  }, [settings, saveSettingsMutation]);

  const updateSettings = useCallback(
    (partial: Partial<UserSettings>) => {
      const updated = { ...settings, ...partial };
      setLocalSettings(updated);
      saveSettingsMutation.mutate(updated);
    },
    [settings, saveSettingsMutation],
  );

  return {
    settings,
    toggle24Hour,
    updateSettings,
    isSaving: saveSettingsMutation.isPending,
  };
}
