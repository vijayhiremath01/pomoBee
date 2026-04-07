package com.pomobee.backend.repository;

import com.pomobee.backend.model.PomodoroSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends MongoRepository<PomodoroSession , String> {
    List<PomodoroSession> findByUserId(String userId);
    List<PomodoroSession> findByUserIdOrderByStartTimeDesc(String userId);
    long countByUserIdAndTypeAndEndTimeBetween(String userId, String type, LocalDateTime start, LocalDateTime end);
    List<PomodoroSession> findByUserIdAndEndTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
}
