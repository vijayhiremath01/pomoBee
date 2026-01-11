import { usePomodoro, TimerMode } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

const modes: { id: TimerMode; label: string }[] = [
  { id: 'pomodoro', label: 'Pomodoro' },
  { id: 'shortBreak', label: 'Short Break' },
  { id: 'longBreak', label: 'Long Break' },
];

export function ModeSelector() {
  const { mode, setMode, isRunning } = usePomodoro();

  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-full">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          disabled={isRunning}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
            mode === m.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
            isRunning && mode !== m.id && 'opacity-50 cursor-not-allowed'
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
