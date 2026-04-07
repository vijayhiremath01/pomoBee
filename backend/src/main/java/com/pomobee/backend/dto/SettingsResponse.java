package com.pomobee.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SettingsResponse {
    private int focusDuration;
    private int breakDuration;
}
