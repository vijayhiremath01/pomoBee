package com.pomobee.backend.service;

import com.pomobee.backend.dto.SettingsRequest;
import com.pomobee.backend.dto.SettingsResponse;
import com.pomobee.backend.model.UserSettings;
import com.pomobee.backend.repository.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private static final int DEFAULT_FOCUS = 25;
    private static final int DEFAULT_BREAK = 5;

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public SettingsResponse getSettings(String userId) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefault(userId));
        return new SettingsResponse(settings.getFocusDuration(), settings.getBreakDuration());
    }

    public SettingsResponse saveSettings(String userId, SettingsRequest request) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefault(userId));
        settings.setFocusDuration(request.getFocusDuration());
        settings.setBreakDuration(request.getBreakDuration());
        settingsRepository.save(settings);
        return new SettingsResponse(settings.getFocusDuration(), settings.getBreakDuration());
    }

    private UserSettings createDefault(String userId) {
        UserSettings settings = new UserSettings();
        settings.setUserId(userId);
        settings.setFocusDuration(DEFAULT_FOCUS);
        settings.setBreakDuration(DEFAULT_BREAK);
        return settingsRepository.save(settings);
    }
}
