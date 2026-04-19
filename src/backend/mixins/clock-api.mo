import Map      "mo:core/Map";
import ClockLib "../lib/clock";
import Types    "../types/clock";

mixin (
  alarms       : Map.Map<Text, Types.AlarmRecord>,
  pinnedZones  : Map.Map<Text, Types.PinnedZone>,
  timerPresets : Map.Map<Text, Types.TimerPreset>,
  userSettings : Map.Map<Text, Types.UserSettings>,
) {
  // ── Alarms ──────────────────────────────────────────────────────────────

  public query func getAlarms() : async [Types.AlarmRecord] {
    ClockLib.getAlarms(alarms)
  };

  public func saveAlarm(alarm : Types.AlarmRecord) : async () {
    ClockLib.saveAlarm(alarms, alarm)
  };

  public func deleteAlarm(id : Text) : async () {
    ClockLib.deleteAlarm(alarms, id)
  };

  public func toggleAlarm(id : Text, enabled : Bool) : async () {
    ClockLib.toggleAlarm(alarms, id, enabled)
  };

  // ── Pinned Time Zones ────────────────────────────────────────────────────

  public query func getPinnedZones() : async [Types.PinnedZone] {
    ClockLib.getPinnedZones(pinnedZones)
  };

  public func addPinnedZone(zone : Types.PinnedZone) : async () {
    ClockLib.addPinnedZone(pinnedZones, zone)
  };

  public func removePinnedZone(id : Text) : async () {
    ClockLib.removePinnedZone(pinnedZones, id)
  };

  // ── Timer Presets ────────────────────────────────────────────────────────

  public query func getTimerPresets() : async [Types.TimerPreset] {
    ClockLib.getTimerPresets(timerPresets)
  };

  public func saveTimerPreset(preset : Types.TimerPreset) : async () {
    ClockLib.saveTimerPreset(timerPresets, preset)
  };

  public func deleteTimerPreset(id : Text) : async () {
    ClockLib.deleteTimerPreset(timerPresets, id)
  };

  // ── User Settings ────────────────────────────────────────────────────────

  public query func getUserSettings() : async Types.UserSettings {
    ClockLib.getUserSettings(userSettings)
  };

  public func saveUserSettings(settings : Types.UserSettings) : async () {
    ClockLib.saveUserSettings(userSettings, settings)
  };
};
