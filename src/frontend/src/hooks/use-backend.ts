import { createActor } from "@/backend";
import type { backendInterface } from "@/backend.d";
import { useActor } from "@caffeineai/core-infrastructure";

export interface BackendState {
  actor: backendInterface | null;
  isReady: boolean;
  isLoading: boolean;
}

/**
 * Thin wrapper around the backend actor with consistent loading state.
 * All data hooks should use this instead of useActor directly.
 */
export function useBackend(): BackendState {
  const { actor, isFetching } = useActor(createActor);

  return {
    actor: (actor as backendInterface | null | undefined) ?? null,
    isReady: !!actor && !isFetching,
    isLoading: isFetching,
  };
}

/**
 * Safely unwraps a backend Option<T> type.
 */
export function unwrapOption<T>(
  opt: { __kind__: "Some"; value: T } | { __kind__: "None" },
): T | null {
  if (opt.__kind__ === "Some") return opt.value;
  return null;
}

/**
 * Maps repeat day indices (bigint) to day names.
 */
export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRepeatDays(days: bigint[]): string {
  if (days.length === 0) return "Never";
  if (days.length === 7) return "Every day";
  const weekdays = [1n, 2n, 3n, 4n, 5n];
  const weekend = [0n, 6n];
  if (
    weekdays.every((d) => days.includes(d)) &&
    !weekend.some((d) => days.includes(d))
  )
    return "Weekdays";
  if (
    weekend.every((d) => days.includes(d)) &&
    !weekdays.some((d) => days.includes(d))
  )
    return "Weekends";
  return days.map((d) => DAY_NAMES[Number(d)]).join(", ");
}
