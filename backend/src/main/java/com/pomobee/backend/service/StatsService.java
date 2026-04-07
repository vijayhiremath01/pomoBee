package com.pomobee.backend.service;

import com.pomobee.backend.dto.StatsResponse;
import com.pomobee.backend.model.UserStats;
import com.pomobee.backend.repository.StatsRepository;
import com.pomobee.backend.stats.StatsContext;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class StatsService {

    private final StatsContext statsContext;
    private final StatsRepository statsRepository;

    public StatsService(StatsContext statsContext, StatsRepository statsRepository) {
        this.statsContext = statsContext;
        this.statsRepository = statsRepository;
    }

    @Cacheable(value = "stats", key = "#userId")
    public StatsResponse getDailyStats(String userId) {
        UserStats stats = statsContext.getDailyStats(userId);
        return new StatsResponse(stats.getTotalFocusMinutes(), stats.getSessionsCompleted());
    }

    @CacheEvict(value = "stats", key = "#userId")
    public void evictStats(String userId) {
        // annotation handles eviction
    }

    @CacheEvict(value = "stats", key = "#userId")
    public void recordFocusSession(String userId, int durationMinutes) {
        LocalDate today = LocalDate.now();
        UserStats stats = statsRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> {
                    UserStats s = new UserStats();
                    s.setUserId(userId);
                    s.setDate(today);
                    s.setTotalFocusMinutes(0);
                    s.setSessionsCompleted(0);
                    return s;
                });

        stats.setTotalFocusMinutes(stats.getTotalFocusMinutes() + durationMinutes);
        stats.setSessionsCompleted(stats.getSessionsCompleted() + 1);
        statsRepository.save(stats);
    }
}
