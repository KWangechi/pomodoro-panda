import type { TimerType } from "../constants/timerConstants";
import type { Task } from "./task";

// Timer settings
export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export interface UserSettings extends TimerSettings {
  addTasksToBottom: boolean;
}

export interface TimerSettingInputProps {
  label: string;
  settingKey: keyof UserSettings;
  value: number;
  unit: string;
  min: number;
  max: number;
  isEditing: boolean;
  onEdit: (key: string) => void;
  onChange: (value: number) => void;
  onSave: () => void;
}

// Core timer state interface used across the application
export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  hasStarted: boolean;
  timerType: TimerType;
  activeTaskId: string | null;
  startTime: number | null;
  expectedEndTime: number | undefined;
  sessionsCompleted: number;
  hasCompleted: boolean;
}

// Context-specific interface that extends the base state

// Define action types
export type TimerAction =
  | { type: "UPDATE_TIMER_STATE"; payload: Partial<TimerState> }
  | {
      type: "START_BREAK";
      payload: {
        startTime: number;
        expectedEndTime: number;
        duration: number;
        timerType: TimerType;
      };
    }
  | {
      type: "START_TIMER";
      payload?: {
        startTime?: number;
        expectedEndTime?: number;
        activeTaskId?: string;
      };
    }
  | { type: "PAUSE_TIMER" }
  | { type: "UPDATE_TIME_LEFT"; payload: { timeLeft: number } };

// Define context type

export interface TimerContextType {
  state: TimerState;
  startBreak: (breakType: TimerType) => void;
  startTimer: (task: Task) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchTimer: () => void;
  setOnComplete: (callback: (state: TimerState) => void) => void;
  settings: TimerSettings;
}
export interface TimerContextState
  extends Omit<TimerState, "sessionsCompleted"> {
  updateTimerState: (state: TimerStateUpdate) => void;
}

// Type for partial updates to timer state
export type TimerStateUpdate = Partial<
  Omit<TimerContextState, "updateTimerState">
>;

// Reference type for tracking previous state
export type TimerStateRef = Omit<TimerState, "sessionsCompleted">;

// Component props
export interface TimerProps {
  selectedTask: Task;
  onTaskComplete: () => Promise<void>;
}

export interface TimerDisplayProps {
  timeLeft: number;
}

export interface TimerControlsProps {
  isPaused: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onBreak: () => void;
  onResume: () => void;
  onPause: () => void;
  onStop: () => void;
  onDone: () => void;
  disableWorkTimer?: boolean;
  timerType: TimerType;
  onSkip: () => void;
}

// Hook props
export interface UseTimerProps {
  onComplete?: (state: TimerState) => void;
  settings?: TimerSettings;
}

// Time estimation interfaces
export interface TimeEstimate {
  completionTime: number;
  remainingDuration: number;
}
