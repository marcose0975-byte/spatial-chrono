import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimerPreset {
    id: string;
    name: string;
    durationSeconds: bigint;
    category: string;
}
export interface UserSettings {
    use24HourFormat: boolean;
}
export interface AlarmRecord {
    id: string;
    repeatDays: Array<bigint>;
    name: string;
    isEnabled: boolean;
    timeHour: bigint;
    requireMathProblem: boolean;
    timeMinute: bigint;
}
export interface PinnedZone {
    id: string;
    timezone: string;
    cityName: string;
    countryCode: string;
}
export interface backendInterface {
    addPinnedZone(zone: PinnedZone): Promise<void>;
    deleteAlarm(id: string): Promise<void>;
    deleteTimerPreset(id: string): Promise<void>;
    getAlarms(): Promise<Array<AlarmRecord>>;
    getPinnedZones(): Promise<Array<PinnedZone>>;
    getTimerPresets(): Promise<Array<TimerPreset>>;
    getUserSettings(): Promise<UserSettings>;
    removePinnedZone(id: string): Promise<void>;
    saveAlarm(alarm: AlarmRecord): Promise<void>;
    saveTimerPreset(preset: TimerPreset): Promise<void>;
    saveUserSettings(settings: UserSettings): Promise<void>;
    toggleAlarm(id: string, enabled: boolean): Promise<void>;
}
