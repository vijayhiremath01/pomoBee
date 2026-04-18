import { useEffect, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { usePomodoro } from "@/contexts/PomodoroContext";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { getToken } from "@/lib/auth"; // ✅ IMPORTANT

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = usePomodoro();
  const hasLoadedRemote = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔥 LOAD SETTINGS (SAFE FOR GUEST MODE)
  useEffect(() => {
    const load = async () => {
      // ✅ Skip API call if not logged in
      if (!getToken()) {
        console.log("Guest user → skipping settings load");
        hasLoadedRemote.current = true;
        return;
      }

      try {
        const data = await api.get<{ focusDuration: number; breakDuration: number }>("/api/settings");

        updateSettings({
          pomodoroDuration: data.focusDuration,
          shortBreakDuration: data.breakDuration,
        });

        hasLoadedRemote.current = true;
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          console.log("Guest user → no remote settings");
        } else {
          console.warn("Unable to load settings", error);
        }
        hasLoadedRemote.current = true;
      }
    };

    load();
  }, [updateSettings]);

  // 🔥 SAVE SETTINGS (ONLY IF LOGGED IN)
  useEffect(() => {
    if (!hasLoadedRemote.current) return;

    // ✅ Skip saving if not logged in
    if (!getToken()) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      api
        .post("/api/settings", {
          focusDuration: settings.pomodoroDuration,
          breakDuration: settings.shortBreakDuration,
        })
        .catch((error: any) => {
          if (error.message === "Unauthorized") return; // ✅ silent ignore

          toast({
            title: "Could not save settings",
            description: error.message,
            variant: "destructive",
          });
        });
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [
    settings.pomodoroDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    settings.autoStartBreaks,
    settings.autoStartPomodoro,
    settings.alarmSound,
    settings.darkMode,
  ]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 rounded-full"
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl shadow-lg transition-all duration-300",
          isOpen
            ? "opacity-100 -translate-y-1/2 scale-100"
            : "opacity-0 -translate-y-[45%] scale-95 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 🔥 SHOW LOGIN MESSAGE */}
        {!getToken() && (
          <div className="px-6 pt-4 text-sm text-yellow-500">
            Login to sync your settings across devices
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Timer (minutes)
            </h3>

            {/* Pomodoro */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Pomodoro</Label>
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.pomodoroDuration} min
                </span>
              </div>
              <Slider
                value={[settings.pomodoroDuration]}
                onValueChange={([value]) => updateSettings({ pomodoroDuration: value })}
                min={1}
                max={60}
                step={1}
              />
            </div>

            {/* Short Break */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Short Break</Label>
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.shortBreakDuration} min
                </span>
              </div>
              <Slider
                value={[settings.shortBreakDuration]}
                onValueChange={([value]) => updateSettings({ shortBreakDuration: value })}
                min={1}
                max={30}
                step={1}
              />
            </div>

            {/* Long Break */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Long Break</Label>
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.longBreakDuration} min
                </span>
              </div>
              <Slider
                value={[settings.longBreakDuration]}
                onValueChange={([value]) => updateSettings({ longBreakDuration: value })}
                min={1}
                max={60}
                step={1}
              />
            </div>
          </div>

          {/* (rest UI unchanged) */}
        </div>
      </div>
    </>
  );
}