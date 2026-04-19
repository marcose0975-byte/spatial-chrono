import Map        "mo:core/Map";
import Types      "types/clock";
import ClockApi   "mixins/clock-api";

actor {
  // ── Stable state (enhanced orthogonal persistence — no `stable` keyword) ──

  let alarms       : Map.Map<Text, Types.AlarmRecord>  = Map.empty();
  let pinnedZones  : Map.Map<Text, Types.PinnedZone>   = Map.empty();
  let timerPresets : Map.Map<Text, Types.TimerPreset>  = Map.empty();
  let userSettings : Map.Map<Text, Types.UserSettings> = Map.empty();

  // ── Compose domain API ────────────────────────────────────────────────────

  include ClockApi(alarms, pinnedZones, timerPresets, userSettings);
};
