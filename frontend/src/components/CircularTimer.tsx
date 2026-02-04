import { usePomodoro } from '@/contexts/PomodoroContext';

export function CircularTimer() {
  const { timeLeft, progress, mode } = usePomodoro();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getModeLabel = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: progress <= 0 || progress >= 100 ? 'none' : 'stroke-dashoffset 300ms ease-linear' }}
          className="transition-all"
        />
      </svg>

      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-medium text-muted-foreground mb-2">
          {getModeLabel()}
        </span>
        <span className="text-6xl font-semibold tracking-tight text-foreground font-mono">
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
