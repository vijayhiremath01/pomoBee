import { Layout } from '@/components/Layout';
import { CircularTimer } from '@/components/CircularTimer';
import { TimerControls } from '@/components/TimerControls';
import { ModeSelector } from '@/components/ModeSelector';
import { SettingsModal } from '@/components/SettingsModal';
import { usePomodoro } from '@/contexts/PomodoroContext';

const Index = () => {
  const { completedPomodoros } = usePomodoro();

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
        <SettingsModal />
        
        <div className="text-center space-y-8">
          <ModeSelector />
          
          <CircularTimer />
          
          <TimerControls />
          
          {completedPomodoros > 0 && (
            <p className="text-sm text-muted-foreground">
              Completed today: <span className="font-medium text-foreground">{completedPomodoros}</span>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
