package com.pomobee.backend.controller;

import com.pomobee.backend.dto.ApiResponse;
import com.pomobee.backend.dto.StatsResponse;
import com.pomobee.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<StatsResponse>> daily() {
        String userId = currentUserId();
        StatsResponse stats = statsService.getDailyStats(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Daily stats", stats));
    }

    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? (String) auth.getPrincipal() : null;
    }
}
