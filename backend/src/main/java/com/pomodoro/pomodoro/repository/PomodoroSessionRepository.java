package com.pomodoro.pomodoro.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pomodoro.pomodoro.model.PomodoroSession;

@Repository
public interface PomodoroSessionRepository
        extends JpaRepository<PomodoroSession, Long> {

    // ✅ TODAY / RANGE QUERY (JPQL SAFE)
    List<PomodoroSession> findByCompletedTrueAndStartTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}
