package com.pomodoro.pomodoro.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pomodoro.pomodoro.model.PomodoroSession;
import com.pomodoro.pomodoro.repository.PomodoroSessionRepository;

@Service
public class PomodoroSessionService {

    private final PomodoroSessionRepository repository;

    public PomodoroSessionService(PomodoroSessionRepository repository) {
        this.repository = repository;
    }

    public PomodoroSession startSession(String sessionType, int duration) {
        PomodoroSession session = new PomodoroSession();
        session.setSessionType(sessionType);
        session.setDuration(duration);
        session.setCompleted(false);
        session.setStartTime(LocalDateTime.now());

        return repository.save(session);
    }

    public PomodoroSession completeSession(Long id) {
        PomodoroSession session = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setCompleted(true);
        session.setEndTime(LocalDateTime.now());

        return repository.save(session);
    }

    public List<PomodoroSession> getAllSessions() {
        return repository.findAll();
    }
}
