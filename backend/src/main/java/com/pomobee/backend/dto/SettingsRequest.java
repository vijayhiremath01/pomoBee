package com.pomobee.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsRequest {

    @Min(value = 10, message = "Focus duration must be at least 10 minutes")
    @Max(value = 120, message = "Focus duration cannot exceed 120 minutes")
    private int focusDuration; // minutes

    @Min(value = 3, message = "Break duration must be at least 3 minutes")
    @Max(value = 60, message = "Break duration cannot exceed 60 minutes")
    private int breakDuration; // minutes
}
