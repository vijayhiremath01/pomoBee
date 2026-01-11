import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Clock, Target, Coffee, Brain } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <PageHeader 
          title="About Pomodoro Timer" 
          description="A minimal, distraction-free productivity tool"
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">What is the Pomodoro Technique?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. 
              It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. 
              These intervals are known as "pomodoros."
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-xl bg-card border border-border">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Focus Session</h3>
                <p className="text-sm text-muted-foreground">
                  Work with full concentration for 25 minutes. Avoid all distractions during this time.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Coffee className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Short Break</h3>
                <p className="text-sm text-muted-foreground">
                  Take a 5-minute break to rest your mind. Stretch, grab a drink, or relax.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Long Break</h3>
                <p className="text-sm text-muted-foreground">
                  After 4 pomodoros, take a longer 15-30 minute break to recharge.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Stay Focused</h3>
                <p className="text-sm text-muted-foreground">
                  The technique helps maintain high productivity while preventing mental fatigue.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Why Use This App?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Clean, minimal interface with no distractions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Customizable timer durations to match your workflow</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Dark mode for comfortable use in any environment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Works offline with local storage for your settings</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;
