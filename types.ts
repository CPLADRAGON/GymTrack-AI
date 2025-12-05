export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface WorkoutLog {
  exerciseName: string;
  weight: string;
  reps: string;
  notes?: string;
}

export interface HistoryEntry {
  date: string;
  dayType: string;
  exerciseName: string;
  weight: number;
  reps: string;
  notes: string;
}

export type DayType = "Upper A" | "Lower A" | "Upper B" | "Lower B" | "Rest";

export interface User {
  accessToken: string;
  name: string;
  email: string;
}

export interface SheetConfig {
  spreadsheetId: string;
}

export enum AppStatus {
  IDLE,
  LOGGING_IN,
  CONFIGURING,
  READY,
}