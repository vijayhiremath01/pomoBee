import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

type TodayAnalytics = {
  totalMinutes: number;
  sessions: number;
};

type SessionHistoryItem = {
  sessionId: string;
  type: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  cycleNumber: number;
  longBreak: boolean;
};

// Fetches today's analytics from backend
// Future analytics (weekly/monthly) can plug into similar hooks with different endpoints.
function useTodayAnalytics() {
  return useQuery<TodayAnalytics>({
    queryKey: ["stats", "daily"],
    queryFn: () => api.get<TodayAnalytics>("/api/stats/daily"),
    staleTime: 30_000,
  });
}

function useHistory() {
  return useQuery<SessionHistoryItem[]>({
    queryKey: ["sessions", "history"],
    queryFn: () => api.get<SessionHistoryItem[]>("/api/session/history"),
    staleTime: 10_000,
  });
}

const History = () => {
  const { data, isLoading, isError, error } = useTodayAnalytics();
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
  } = useHistory();

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <PageHeader
          title="History"
          description="Your focus analytics. Today only — more coming soon."
        />

        <Tabs defaultValue="today" className="mb-6">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekly" disabled>
              Weekly <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" disabled>
              Monthly <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <section aria-labelledby="today-summary">
              <h2 id="today-summary" className="sr-only">Today’s focus summary</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Today’s Summary</CardTitle>
                  <CardDescription>Simple snapshot of your productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="py-4 text-sm text-muted-foreground">Loading analytics…</div>
                  )}

                  {isError && (
                    <div className="py-4 text-sm text-destructive">
                      {(error as Error)?.message ?? 'Something went wrong'}
                    </div>
                  )}

                  {!isLoading && !isError && data && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span className="font-medium text-foreground">Total Focus Time</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                          {data.totalMinutes} <span className="text-sm font-normal text-muted-foreground">min</span>
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span className="font-medium text-foreground">Completed Sessions</span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                          {data.sessions}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />
                  <div className="text-xs text-muted-foreground">
                    More insights (streaks, trends, charts) are on the way.
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Latest 20 sessions with durations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {historyLoading && (
                    <div className="py-2 text-sm text-muted-foreground">Loading history…</div>
                  )}
                  {historyError && (
                    <div className="py-2 text-sm text-destructive">
                      Could not load history. Try again.
                    </div>
                  )}
                  {!historyLoading && !historyError && history && history.length === 0 && (
                    <div className="py-2 text-sm text-muted-foreground">No sessions yet.</div>
                  )}
                  {!historyLoading && !historyError && history && history.length > 0 && (
                    <ul className="space-y-2">
                      {history.slice(0, 20).map((item) => (
                        <li
                          key={item.sessionId}
                          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-foreground">
                            {item.type === "FOCUS" ? "Focus" : item.longBreak ? "Long break" : "Break"}
                          </span>
                          <span className="text-muted-foreground">
                            {item.durationMinutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default History;
