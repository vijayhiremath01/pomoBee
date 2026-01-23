package com.pomodoro.pomodoro.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pomodoro.pomodoro.model.PomodoroSession;
import com.pomodoro.pomodoro.service.PomodoroSessionService;

@RestController
@RequestMapping("/api/sessions")
public class PomodoroSessionController {
    private final PomodoroSessionService service;

    public PomodoroSessionController(PomodoroSessionService service) {
        this.service = service ; 
}

    @PostMapping("/start")
    public PomodoroSession stratSession(
        @RequestParam String sessionType ,
        @RequestParam int duration 
    ) {
        return service.startSession(sessionType, duration);
    }

    @PostMapping("/complete/{id}")
    public PomodoroSession completeSession(@PathVariable Long id){
        return service.completeSession(id);
    }
}