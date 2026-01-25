package com.pomodoro.pomodoro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pomodoro.pomodoro.dto.AnalyticsResponse;
import com.pomodoro.pomodoro.service.analytics.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/today")
    public AnalyticsResponse today() {
        return service.getTodayAnalytics();
    }
}
