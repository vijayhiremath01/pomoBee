package com.pomobee.backend.stats;

import com.pomobee.backend.model.PomodoroSession;
import com.pomobee.backend.model.UserStats;
import com.pomobee.backend.repository.SessionRepository;
import com.pomobee.backend.repository.StatsRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DailyStatsStrategy implements StatsStrategy {

    private final SessionRepository sessionRepository;
    private final StatsRepository statsRepository;

    public DailyStatsStrategy(SessionRepository sessionRepository, StatsRepository statsRepository) {
        this.sessionRepository = sessionRepository;
        this.statsRepository = statsRepository;
    }

    @Override
    public UserStats calculate(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<PomodoroSession> sessions = sessionRepository.findByUserIdAndEndTimeBetween(userId, start, end);

        int totalMinutes = sessions.stream()
                .filter(s -> "FOCUS".equalsIgnoreCase(s.getType()))
                .mapToInt(PomodoroSession::getDuration)
                .sum();

        int sessionCount = (int) sessions.stream()
                .filter(s -> "FOCUS".equalsIgnoreCase(s.getType()))
                .count();

        UserStats stats = statsRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> {
                    UserStats s = new UserStats();
                    s.setUserId(userId);
                    s.setDate(today);
                    return s;
                });

        stats.setTotalFocusMinutes(totalMinutes);
        stats.setSessionsCompleted(sessionCount);

        return statsRepository.save(stats);
    }
}
