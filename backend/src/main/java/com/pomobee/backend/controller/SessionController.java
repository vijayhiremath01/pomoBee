package com.pomobee.backend.controller;

import com.pomobee.backend.dto.ApiResponse;
import com.pomobee.backend.dto.EndSessionRequest;
import com.pomobee.backend.dto.SessionResponse;
import com.pomobee.backend.model.PomodoroSession;
import com.pomobee.backend.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/focus/start")
    public ResponseEntity<ApiResponse<SessionResponse>> startFocus() {
        PomodoroSession session = sessionService.startFocusSession(currentUserId());
        SessionResponse response = toResponse(session);
        return ResponseEntity.ok(new ApiResponse<>(true, "Focus session started", response));
    }

    @PostMapping("/break/start")
    public ResponseEntity<ApiResponse<SessionResponse>> startBreak() {
        PomodoroSession session = sessionService.startBreakSession(currentUserId());
        SessionResponse response = toResponse(session);
        return ResponseEntity.ok(new ApiResponse<>(true, "Break started", response));
    }

    @PostMapping("/end")
    public ResponseEntity<ApiResponse<SessionResponse>> endSession(@Valid @RequestBody EndSessionRequest request) {
        PomodoroSession session = sessionService.endSession(
                currentUserId(),
                request.getSessionId(),
                request.getDurationMinutes(),
                request.getEndTime());
        SessionResponse response = toResponse(session);
        return ResponseEntity.ok(new ApiResponse<>(true, "Session ended", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<SessionResponse>>> history() {
        List<SessionResponse> history = sessionService.getHistory(currentUserId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ApiResponse<>(true, "History fetched", history));
    }

    private SessionResponse toResponse(PomodoroSession session) {
        return new SessionResponse(
                session.getId(),
                session.getType(),
                session.getStartTime(),
                session.getEndTime(),
                session.getDuration(),
                session.getCycleNumber(),
                session.isLongBreak()
        );
    }

    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? (String) auth.getPrincipal() : null;
    }
}
