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

/* ================= PROVIDER ================= */
export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  /* ---------- SETTINGS ---------- */
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("pomodoroSettings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  /* ---------- TIMER STATE (with persistence) ---------- */
  const [mode, setMode] = useState<TimerMode>(() => {
    const saved = localStorage.getItem("pomodoroMode");
    return (saved as TimerMode) || "pomodoro";
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem("pomodoroTimeLeft");
    return saved ? parseInt(saved, 10) : settings.pomodoroDuration * 60;
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = localStorage.getItem("pomodoroIsRunning");
    return saved ? saved === "true" : false;
  });

  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const saved = localStorage.getItem("completedPomodoros");
    return saved ? parseInt(saved, 10) : 0;
  });

  /* ---------- REFS ---------- */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // 🔑 STORES BACKEND SESSION ID
  const sessionIdRef = useRef<number | null>(null);

  // Restore sessionId from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("pomodoroSessionId");
    if (savedSessionId) {
      sessionIdRef.current = parseInt(savedSessionId, 10);
    }
  }, []);

  /* ---------- SAVE STATE TO LOCALSTORAGE ---------- */
  useEffect(() => {
    localStorage.setItem("pomodoroMode", mode);
    localStorage.setItem("pomodoroTimeLeft", timeLeft.toString());
    localStorage.setItem("pomodoroIsRunning", isRunning.toString());
    localStorage.setItem("completedPomodoros", completedPomodoros.toString());
  }, [mode, timeLeft, isRunning, completedPomodoros]);

  useEffect(() => {
    if (sessionIdRef.current !== null) {
      localStorage.setItem("pomodoroSessionId", sessionIdRef.current.toString());
    } else {
      localStorage.removeItem("pomodoroSessionId");
    }
  }, [sessionIdRef.current]);

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

  /* ---------- ALARM ---------- */
  const playAlarm = useCallback(() => {
    if (settings.alarmSound === "none") return;

    const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

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
    setIsRunning(true);

    try {
      const response = await fetch(
          `http://localhost:8080/api/sessions/start?sessionType=${mode}&duration=${Math.floor(
              getDuration(mode) / 60
          )}`,
          { method: "POST" }
      );

      const data = await response.json();
      sessionIdRef.current = data.id;
      console.log("Session started with id:", data.id);
    } catch (error) {
      console.error("Failed to start session", error);
    }
  }, [mode, getDuration]);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
    sessionIdRef.current = null; // Clear session id on reset
    localStorage.removeItem("pomodoroSessionId");
  }, [getDuration, mode]);

  /* ================= TIMER COMPLETE ================= */
  const handleTimerComplete = useCallback(async () => {
    // Inform backend that session is complete
    if (sessionIdRef.current) {
      try {
        await fetch(
            `http://localhost:8080/api/sessions/complete/${sessionIdRef.current}`,
            { method: "POST" }
        );
        console.log("Session completed:", sessionIdRef.current);
      } catch (error) {
        console.error("Failed to complete session", error);
      }
      sessionIdRef.current = null;
      localStorage.removeItem("pomodoroSessionId");
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

  /* ================= TIMER INTERVAL ================= */
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  /* ================= DARK MODE ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  /* ================= SAVE SETTINGS ================= */
  useEffect(() => {
    localStorage.setItem("pomodoroSettings", JSON.stringify(settings));
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
            setMode,
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