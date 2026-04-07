package com.pomobee.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SessionResponse {
    private String sessionId;
    private String type;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int durationMinutes;
    private int cycleNumber;
    private boolean longBreak;
}
