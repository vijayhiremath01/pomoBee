package com.pomobee.backend.service;

import com.pomobee.backend.exception.SessionNotFoundException;
import com.pomobee.backend.model.PomodoroSession;
import com.pomobee.backend.repository.SessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Slf4j
public class SessionService {

    private final SessionRepository sessionRepository;
    private final StatsService statsService;

    public SessionService(SessionRepository sessionRepository,
                          StatsService statsService) {
        this.sessionRepository = sessionRepository;
        this.statsService = statsService;
    }

    public PomodoroSession startFocusSession(String userId) {
        int cycle = nextCycleNumber(userId);

        PomodoroSession session = new PomodoroSession();
        session.setUserId(userId);
        session.setStartTime(LocalDateTime.now());
        session.setType("FOCUS");
        session.setCycleNumber(cycle);
        session.setLongBreak(false);

        PomodoroSession saved = sessionRepository.save(session);
        log.info("Started focus session {} for user {} (cycle {})", saved.getId(), userId, cycle);
        return saved;
    }

    public PomodoroSession startBreakSession(String userId) {
        long completedFocus = completedFocusToday(userId);
        boolean isLong = completedFocus > 0 && completedFocus % 4 == 0;
        int cycleForBreak = (int) (completedFocus == 0 ? 1 : (completedFocus % 4 == 0 ? 4 : completedFocus % 4));

        PomodoroSession session = new PomodoroSession();
        session.setUserId(userId);
        session.setStartTime(LocalDateTime.now());
        session.setType("BREAK");
        session.setLongBreak(isLong);
        session.setCycleNumber(cycleForBreak);

        PomodoroSession saved = sessionRepository.save(session);
        log.info("Started break session {} for user {} (cycle {}, longBreak={})", saved.getId(), userId, cycleForBreak, isLong);
        return saved;
    }

    public PomodoroSession endSession(String userId, String sessionId, Integer durationOverride, LocalDateTime endTimeOverride) {
        PomodoroSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));

        if (!session.getUserId().equals(userId)) {
            throw new SessionNotFoundException("Session not found for user");
        }

        LocalDateTime end = endTimeOverride != null ? endTimeOverride : LocalDateTime.now();
        session.setEndTime(end);

        int calculated = (int) Duration.between(session.getStartTime(), end).toMinutes();
        int duration = durationOverride != null && durationOverride > 0 ? durationOverride : Math.max(calculated, 0);
        session.setDuration(duration);

        sessionRepository.save(session);
        log.info("Ended session {} for user {} with duration {} minutes", sessionId, userId, duration);

        if ("FOCUS".equalsIgnoreCase(session.getType())) {
            statsService.recordFocusSession(session.getUserId(), duration);
        }

        return session;
    }

    public List<PomodoroSession> getHistory(String userId) {
        return sessionRepository.findByUserIdOrderByStartTimeDesc(userId);
    }

    private int nextCycleNumber(String userId) {
        long completedFocus = completedFocusToday(userId);
        return (int) (completedFocus % 4) + 1;
    }

    private long completedFocusToday(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        return sessionRepository.countByUserIdAndTypeAndEndTimeBetween(userId, "FOCUS", start, end);
    }
}
