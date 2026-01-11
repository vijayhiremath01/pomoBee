import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function TimerControls() {
  const { isRunning, start, pause, reset } = usePomodoro();

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={reset}
        className="h-12 w-12 rounded-full"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      
      <Button
        onClick={isRunning ? pause : start}
        size="lg"
        className="h-14 px-8 rounded-full text-lg font-medium"
      >
        {isRunning ? (
          <>
            <Pause className="h-5 w-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Start
          </>
        )}
      </Button>
      
      <div className="w-12" /> {/* Spacer for visual balance */}
    </div>
  );
}
