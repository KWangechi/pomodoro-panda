export const TIMER_TYPES = {
  WORK: 'work',
  BREAK: 'break',
  LONG_BREAK: 'longBreak'
} as const;

export type TimerType = typeof TIMER_TYPES[keyof typeof TIMER_TYPES];

export const DEFAULT_TIMER_SETTINGS = {
  workDuration: 90 * 60,  // 90 minutes
  breakDuration: 30 * 60,  // 30 minutes
  longBreakDuration: 60 * 60,  // 60 minutes
  sessionsUntilLongBreak: 4
} as const;

export const NOTIFICATION_MESSAGES = {
  [TIMER_TYPES.WORK]: "Time to focus!",
  [TIMER_TYPES.BREAK]: "Take a short break!",
  [TIMER_TYPES.LONG_BREAK]: "Time for a long break!"
} as const;

export const COMPLETION_MESSAGES = {
  [TIMER_TYPES.WORK]: "Work session completed!",
  [TIMER_TYPES.BREAK]: "Break session completed!",
  [TIMER_TYPES.LONG_BREAK]: "Long break session completed!"
} as const;

export const ERROR_MESSAGES = {
  TASK_LOAD_FAILED: "Failed to load tasks",
  TASK_UPDATE_FAILED: "Failed to update task",
  TASK_COMPLETE_FAILED: "Failed to complete task"
} as const;

export const TIMER_TITLES = {
  [TIMER_TYPES.WORK]: (session: number) => `Pomodoro ${session}`,
  [TIMER_TYPES.BREAK]: "Short Break",
  [TIMER_TYPES.LONG_BREAK]: "Long Break",
  DEFAULT: "Timer"
} as const;