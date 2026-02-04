import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

/* ---------------- TYPES ---------------- */
export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface Settings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoro: boolean;
  alarmSound: "bell" | "digital" | "gentle" | "none";
  darkMode: boolean;
}

interface PomodoroContextType {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  progress: number;
  completedPomodoros: number;
}

/* ---------------- DEFAULT SETTINGS ---------------- */
const defaultSettings: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoro: false,
  alarmSound: "bell",
  darkMode: false,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);
const STORAGE_KEYS = {
  settings: "pomodoroSettings",
  mode: "pomodoroMode",
  timeLeft: "pomodoroTimeLeft",
  isRunning: "pomodoroIsRunning",
  completed: "completedPomodoros",
  sessionId: "pomodoroSessionId",
  endAt: "pomodoroEndAt",
};

/* ================= PROVIDER ================= */
export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  /* ---------- SETTINGS ---------- */
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.settings);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  /* ---------- TIMER STATE (with persistence) ---------- */
  const [mode, setMode] = useState<TimerMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.mode);
    return (saved as TimerMode) || "pomodoro";
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.timeLeft);
    const savedIsRunning = localStorage.getItem(STORAGE_KEYS.isRunning) === "true";
    const savedEndAt = localStorage.getItem(STORAGE_KEYS.endAt);

    if (savedIsRunning && savedEndAt) {
      const remaining = Math.max(
        0,
        Math.ceil((parseInt(savedEndAt, 10) - Date.now()) / 1000)
      );
      if (remaining > 0) return remaining;
    }

    return saved ? parseInt(saved, 10) : settings.pomodoroDuration * 60;
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.isRunning);
    return saved ? saved === "true" : false;
  });

  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.completed);
    return saved ? parseInt(saved, 10) : 0;
  });

  /* ---------- REFS ---------- */
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Absolute end timestamp (ms since epoch). Drives time-difference based countdown.
  const timerEndAtRef = useRef<number | null>(null);
  // 🔑 STORES BACKEND SESSION ID
  const sessionIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Restore sessionId and end timestamp from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
    if (savedSessionId) {
      sessionIdRef.current = parseInt(savedSessionId, 10);
    }

    const savedEndAt = localStorage.getItem(STORAGE_KEYS.endAt);
    if (savedEndAt) {
      timerEndAtRef.current = parseInt(savedEndAt, 10);
    }
  }, []);

  /* ---------- SAVE STATE TO LOCALSTORAGE ---------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    localStorage.setItem(STORAGE_KEYS.timeLeft, timeLeft.toString());
    localStorage.setItem(STORAGE_KEYS.isRunning, isRunning.toString());
    localStorage.setItem(STORAGE_KEYS.completed, completedPomodoros.toString());
  }, [mode, timeLeft, isRunning, completedPomodoros]);

  /* ---------- HELPERS ---------- */
  const getDuration = useCallback(
    (timerMode: TimerMode) => {
      switch (timerMode) {
        case "pomodoro":
          return settings.pomodoroDuration * 60;
        case "shortBreak":
          return settings.shortBreakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
      }
    },
    [
      settings.pomodoroDuration,
      settings.shortBreakDuration,
      settings.longBreakDuration,
    ]
  );

  const totalTime = getDuration(mode);
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const playAlarm = useCallback(() => {
    if (settings.alarmSound === "none") return;

    if (!audioContextRef.current) {
      // @ts-expect-error - webkitAudioContext is a legacy vendor prefix
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    const audioContext = audioContextRef.current!;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value =
      settings.alarmSound === "bell"
        ? 800
        : settings.alarmSound === "digital"
          ? 1000
          : 400;

    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [settings.alarmSound]);

  /* ================= START SESSION ================= */
  const start = useCallback(async () => {
    // Set end timestamp based on current remaining time.
    const endAt = Date.now() + timeLeft * 1000;
    timerEndAtRef.current = endAt;
    localStorage.setItem(STORAGE_KEYS.endAt, endAt.toString());

    setIsRunning(true);

    // Resume AudioContext on user gesture
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    } else if (!audioContextRef.current) {
      // Pre-initialize it so it's ready when needed
      // @ts-expect-error - webkitAudioContext is a legacy vendor prefix
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    try {
      const response = await fetch(
        `/api/sessions/start?sessionType=${mode}&duration=${Math.floor(
          getDuration(mode) / 60
        )}`,
        { method: "POST" }
      );

      const data = await response.json();
      sessionIdRef.current = data.id;
      localStorage.setItem(STORAGE_KEYS.sessionId, data.id.toString());
      console.log("Session started with id:", data.id);
    } catch (error) {
      console.error("Failed to start session", error);
    }
  }, [mode, getDuration, timeLeft]);

  const pause = useCallback(() => {
    if (timerEndAtRef.current) {
      const remaining = Math.max(
        0,
        Math.ceil((timerEndAtRef.current - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
    }

    timerEndAtRef.current = null;
    localStorage.removeItem(STORAGE_KEYS.endAt);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
    timerEndAtRef.current = null;
    localStorage.removeItem(STORAGE_KEYS.endAt);
    sessionIdRef.current = null; // Clear session id on reset
    localStorage.removeItem(STORAGE_KEYS.sessionId);
  }, [getDuration, mode]);

  /* ================= MODE CHANGE ================= */
  const handleModeChange = useCallback(
    (newMode: TimerMode) => {
      setIsRunning(false);
      setMode(newMode);
      const newDuration = getDuration(newMode);
      setTimeLeft(newDuration);

      timerEndAtRef.current = null;
      localStorage.removeItem(STORAGE_KEYS.endAt);
      sessionIdRef.current = null;
      localStorage.removeItem(STORAGE_KEYS.sessionId);
    },
    [getDuration]
  );

  /* ================= TIMER COMPLETE ================= */
  const handleTimerComplete = useCallback(async () => {
    // Inform backend that session is complete
    if (sessionIdRef.current) {
      try {
        await fetch(
          `/api/sessions/complete/${sessionIdRef.current}`,
          { method: "POST" }
        );
        console.log("Session completed:", sessionIdRef.current);
      } catch (error) {
        console.error("Failed to complete session", error);
      }
      sessionIdRef.current = null;
      localStorage.removeItem(STORAGE_KEYS.sessionId);
    }

    playAlarm();

    if (mode === "pomodoro") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      const nextMode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      setMode(nextMode);
      setTimeLeft(getDuration(nextMode));
      setIsRunning(false);
    } else {
      setMode("pomodoro");
      setTimeLeft(getDuration("pomodoro"));
      setIsRunning(false);
    }
  }, [mode, completedPomodoros, getDuration, playAlarm]);

  // Recompute remaining seconds from the absolute end time.
  // This avoids drift/throttling issues from setInterval in background tabs.
  const syncTimeLeft = useCallback(() => {
    if (!timerEndAtRef.current) return;

    const remaining = Math.max(
      0,
      Math.ceil((timerEndAtRef.current - Date.now()) / 1000)
    );

    setTimeLeft((prev) => (prev === remaining ? prev : remaining));

    if (remaining <= 0) {
      timerEndAtRef.current = null;
      localStorage.removeItem(STORAGE_KEYS.endAt);
      handleTimerComplete();
    }
  }, [handleTimerComplete]);

  /* ================= TIMER INTERVAL ================= */
  useEffect(() => {
    if (isRunning) {
      if (!timerEndAtRef.current) {
        const endAt = Date.now() + timeLeft * 1000;
        timerEndAtRef.current = endAt;
        localStorage.setItem(STORAGE_KEYS.endAt, endAt.toString());
      }

      syncTimeLeft();
      intervalRef.current = setInterval(() => {
        syncTimeLeft();
      }, 250);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, syncTimeLeft, timeLeft]);

  /* ================= VISIBILITY / FOCUS ================= */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncTimeLeft();
      }
    };

    const handleFocus = () => syncTimeLeft();
    const handleBlur = () => syncTimeLeft();
    const handleBeforeUnload = () => syncTimeLeft();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [syncTimeLeft]);

  /* ================= DARK MODE ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  /* ================= SAVE SETTINGS ================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  /* ================= UPDATE SETTINGS ================= */
  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  /* ================= CONTEXT ================= */
  return (
    <PomodoroContext.Provider
      value={{
        mode,
        setMode: handleModeChange,
        timeLeft,
        isRunning,
        start,
        pause,
        reset,
        settings,
        updateSettings,
        progress,
        completedPomodoros,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

/* ================= HOOK ================= */
// eslint-disable-next-line react-refresh/only-export-components
export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider");
  }
  return context;
}
