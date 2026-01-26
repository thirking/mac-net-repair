import { create } from "zustand";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: string;
}

interface LogState {
  logs: LogEntry[];
  maxLogs: number;
  isVisible: boolean;

  // Actions
  addLog: (level: LogLevel, message: string, details?: string) => void;
  clearLogs: () => void;
  setVisible: (visible: boolean) => void;
  toggleVisible: () => void;
}

let logId = 0;

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  maxLogs: 100,
  isVisible: false,

  addLog: (level, message, details) =>
    set((state) => {
      const newLog: LogEntry = {
        id: `log-${++logId}`,
        timestamp: new Date(),
        level,
        message,
        details,
      };
      const logs = [newLog, ...state.logs].slice(0, state.maxLogs);
      return { logs };
    }),

  clearLogs: () => set({ logs: [] }),

  setVisible: (visible) => set({ isVisible: visible }),

  toggleVisible: () => set((state) => ({ isVisible: !state.isVisible })),
}));

// Helper functions for easy logging
export const logger = {
  info: (message: string, details?: string) =>
    useLogStore.getState().addLog("info", message, details),
  warn: (message: string, details?: string) =>
    useLogStore.getState().addLog("warn", message, details),
  error: (message: string, details?: string) =>
    useLogStore.getState().addLog("error", message, details),
  debug: (message: string, details?: string) =>
    useLogStore.getState().addLog("debug", message, details),
};
