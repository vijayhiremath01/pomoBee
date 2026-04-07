package com.pomobee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EndSessionRequest {
    @NotBlank
    private String sessionId;
    private Integer durationMinutes; // optional, prefer frontend timer
    private LocalDateTime endTime;
}
