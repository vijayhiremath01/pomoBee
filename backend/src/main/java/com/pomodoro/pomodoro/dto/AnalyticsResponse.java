package com.pomodoro.pomodoro.dto;

import java.util.List;

import com.pomodoro.pomodoro.model.PomodoroSession;

public class AnalyticsResponse {

    private int totalMinutes;
    private int sessions;
    private List<PomodoroSession> history;

    public AnalyticsResponse(int totalMinutes, int sessions, List<PomodoroSession> history) {
        this.totalMinutes = totalMinutes;
        this.sessions = sessions;
        this.history = history;
    }

    public int getTotalMinutes() {
        return totalMinutes;
    }

    public int getSessions() {
        return sessions;
    }

    public List<PomodoroSession> getHistory() {
        return history;
    }
}
