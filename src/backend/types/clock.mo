module {
  // Alarm record — persisted per user
  public type AlarmRecord = {
    id             : Text;
    name           : Text;
    timeHour       : Nat;
    timeMinute     : Nat;
    isEnabled      : Bool;
    repeatDays     : [Nat]; // 0 = Sunday … 6 = Saturday
    requireMathProblem : Bool;
  };

  // Pinned time zone for world clock
  public type PinnedZone = {
    id          : Text;
    cityName    : Text;
    timezone    : Text; // IANA timezone string e.g. "America/New_York"
    countryCode : Text; // ISO 3166-1 alpha-2 e.g. "US"
  };

  // Named timer preset (Pomodoro, Tabata, custom …)
  public type TimerPreset = {
    id              : Text;
    name            : Text;
    durationSeconds : Nat;
    category        : Text; // e.g. "pomodoro", "hiit", "custom"
  };

  // Per-user display preferences
  public type UserSettings = {
    use24HourFormat : Bool;
  };
};
