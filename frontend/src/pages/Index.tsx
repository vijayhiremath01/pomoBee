import { Layout } from '@/components/Layout';
import { CircularTimer } from '@/components/CircularTimer';
import { TimerControls } from '@/components/TimerControls';
import { ModeSelector } from '@/components/ModeSelector';
import { SettingsModal } from '@/components/SettingsModal';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

const Index = () => {
  const { completedPomodoros } = usePomodoro();

  useEffect(() => {
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8081"   // ✅ FIXED
      : "https://pomobee-backend1.onrender.com";

  fetch(`${BASE_URL}/health`)
    .then(res => {
      res.ok
        ? console.log("Backend is healthy ✅")
        : console.log("Backend not OK ❌", res.status);
    })
    .catch(err => console.log("Backend unreachable ❌", err));
}, []);

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