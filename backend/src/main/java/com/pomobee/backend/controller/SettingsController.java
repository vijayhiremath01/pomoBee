package com.pomobee.backend.controller;

import com.pomobee.backend.dto.ApiResponse;
import com.pomobee.backend.dto.SettingsRequest;
import com.pomobee.backend.dto.SettingsResponse;
import com.pomobee.backend.service.SettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> getSettings() {
        SettingsResponse response = settingsService.getSettings(currentUserId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Settings fetched", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> updateSettings(@Valid @RequestBody SettingsRequest request) {
        SettingsResponse response = settingsService.saveSettings(currentUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Settings updated", response));
    }

    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? (String) auth.getPrincipal() : null;
    }
}
