package com.pomodoro.pomodoro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pomodoro.pomodoro.model.PomodoroSession;

public interface PomodoroSessionRepository
        extends JpaRepository<PomodoroSession, Long> {
}

