import Map   "mo:core/Map";
import Types "../types/clock";

module {
  // ── Alarms ──────────────────────────────────────────────────────────────

  /// Return all alarm records stored in the map.
  public func getAlarms(store : Map.Map<Text, Types.AlarmRecord>) : [Types.AlarmRecord] {
    store.values().toArray()
  };

  /// Insert or replace an alarm record keyed by its id.
  public func saveAlarm(store : Map.Map<Text, Types.AlarmRecord>, alarm : Types.AlarmRecord) {
    store.add(alarm.id, alarm)
  };

  /// Remove an alarm record by id (no-op when id absent).
  public func deleteAlarm(store : Map.Map<Text, Types.AlarmRecord>, id : Text) {
    store.remove(id)
  };

  /// Flip the isEnabled flag of an alarm.
  public func toggleAlarm(store : Map.Map<Text, Types.AlarmRecord>, id : Text, enabled : Bool) {
    switch (store.get(id)) {
      case (?alarm) { store.add(id, { alarm with isEnabled = enabled }) };
      case null {};
    }
  };

  // ── Pinned Zones ────────────────────────────────────────────────────────

  /// Return all pinned time-zone entries.
  public func getPinnedZones(store : Map.Map<Text, Types.PinnedZone>) : [Types.PinnedZone] {
    store.values().toArray()
  };

  /// Insert or replace a pinned zone keyed by its id.
  public func addPinnedZone(store : Map.Map<Text, Types.PinnedZone>, zone : Types.PinnedZone) {
    store.add(zone.id, zone)
  };

  /// Remove a pinned zone by id (no-op when id absent).
  public func removePinnedZone(store : Map.Map<Text, Types.PinnedZone>, id : Text) {
    store.remove(id)
  };

  // ── Timer Presets ────────────────────────────────────────────────────────

  /// Return all timer presets.
  public func getTimerPresets(store : Map.Map<Text, Types.TimerPreset>) : [Types.TimerPreset] {
    store.values().toArray()
  };

  /// Insert or replace a timer preset keyed by its id.
  public func saveTimerPreset(store : Map.Map<Text, Types.TimerPreset>, preset : Types.TimerPreset) {
    store.add(preset.id, preset)
  };

  /// Remove a timer preset by id (no-op when id absent).
  public func deleteTimerPreset(store : Map.Map<Text, Types.TimerPreset>, id : Text) {
    store.remove(id)
  };

  // ── User Settings ────────────────────────────────────────────────────────

  let settingsKey : Text = "__settings__";

  /// Return user settings, falling back to sensible defaults when absent.
  public func getUserSettings(store : Map.Map<Text, Types.UserSettings>) : Types.UserSettings {
    switch (store.get(settingsKey)) {
      case (?s) s;
      case null { { use24HourFormat = false } };
    }
  };

  /// Persist user settings under a fixed sentinel key.
  public func saveUserSettings(store : Map.Map<Text, Types.UserSettings>, settings : Types.UserSettings) {
    store.add(settingsKey, settings)
  };
};
