package com.pomodoro.pomodoro.service.analytics;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pomodoro.pomodoro.dto.AnalyticsResponse;
import com.pomodoro.pomodoro.model.PomodoroSession;
import com.pomodoro.pomodoro.repository.PomodoroSessionRepository;

@Service
public class AnalyticsService {

    private final PomodoroSessionRepository repository;

    public AnalyticsService(PomodoroSessionRepository repository) {
        this.repository = repository;
    }

    // ✅ TODAY ANALYTICS
    public AnalyticsResponse getTodayAnalytics() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<PomodoroSession> sessions =
                repository.findByCompletedTrueAndStartTimeBetween(
                        startOfDay,
                        endOfDay
                );

        int totalMinutes = sessions.stream()
                .mapToInt(PomodoroSession::getDuration)
                .sum();

        return new AnalyticsResponse(
                totalMinutes,
                sessions.size(),
                sessions   // 👈 IMPORTANT for History UI
        );
    }
}
