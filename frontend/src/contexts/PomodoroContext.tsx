import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface Settings {
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoro: boolean;
  alarmSound: 'bell' | 'digital' | 'gentle' | 'none';
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

const defaultSettings: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoro: false,
  alarmSound: 'bell',
  darkMode: false,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [mode, setModeState] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDuration = useCallback((timerMode: TimerMode) => {
    switch (timerMode) {
      case 'pomodoro':
        return settings.pomodoroDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  }, [settings.pomodoroDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  const totalTime = getDuration(mode);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const playAlarm = useCallback(() => {
    if (settings.alarmSound === 'none') return;
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = settings.alarmSound === 'bell' ? 800 : 
                                  settings.alarmSound === 'digital' ? 1000 : 400;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [settings.alarmSound]);

  const setMode = useCallback((newMode: TimerMode) => {
    setModeState(newMode);
    setTimeLeft(getDuration(newMode));
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [getDuration]);

  const handleTimerComplete = useCallback(() => {
    playAlarm();
    
    if (mode === 'pomodoro') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      // Every 4 pomodoros, take a long break
      const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      setModeState(nextMode);
      setTimeLeft(getDuration(nextMode));
      
      if (settings.autoStartBreaks) {
        // Will start in next effect cycle
      } else {
        setIsRunning(false);
      }
    } else {
      setModeState('pomodoro');
      setTimeLeft(getDuration('pomodoro'));
      
      if (settings.autoStartPomodoro) {
        // Will start in next effect cycle
      } else {
        setIsRunning(false);
      }
    }
  }, [mode, completedPomodoros, getDuration, playAlarm, settings.autoStartBreaks, settings.autoStartPomodoro]);

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

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  }, [getDuration, mode]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // If duration changed for current mode, update timeLeft
      if (!isRunning) {
        if (mode === 'pomodoro' && newSettings.pomodoroDuration !== undefined) {
          setTimeLeft(newSettings.pomodoroDuration * 60);
        } else if (mode === 'shortBreak' && newSettings.shortBreakDuration !== undefined) {
          setTimeLeft(newSettings.shortBreakDuration * 60);
        } else if (mode === 'longBreak' && newSettings.longBreakDuration !== undefined) {
          setTimeLeft(newSettings.longBreakDuration * 60);
        }
      }
      return updated;
    });
  }, [isRunning, mode]);

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

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
}
