import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings } = usePomodoro();

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
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl shadow-lg transition-all duration-300',
          isOpen
            ? 'opacity-100 -translate-y-1/2 scale-100'
            : 'opacity-0 -translate-y-[45%] scale-95 pointer-events-none'
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

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Timer (minutes)
            </h3>
            
            <div className="space-y-4">
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
                  className="w-full"
                />
              </div>

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
                  className="w-full"
                />
              </div>

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
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Auto Start */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Auto Start
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-breaks">Auto start breaks</Label>
                <Switch
                  id="auto-breaks"
                  checked={settings.autoStartBreaks}
                  onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-pomodoro">Auto start pomodoro</Label>
                <Switch
                  id="auto-pomodoro"
                  checked={settings.autoStartPomodoro}
                  onCheckedChange={(checked) => updateSettings({ autoStartPomodoro: checked })}
                />
              </div>
            </div>
          </div>

          {/* Sound & Display */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Sound & Display
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Alarm Sound</Label>
                <Select
                  value={settings.alarmSound}
                  onValueChange={(value: 'bell' | 'digital' | 'gentle' | 'none') => 
                    updateSettings({ alarmSound: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="gentle">Gentle</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
