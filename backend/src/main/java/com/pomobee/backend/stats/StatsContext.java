package com.pomobee.backend.stats;

import com.pomobee.backend.model.UserStats;
import org.springframework.stereotype.Component;

@Component
public class StatsContext {

    private final DailyStatsStrategy dailyStatsStrategy;

    public StatsContext(DailyStatsStrategy dailyStatsStrategy) {
        this.dailyStatsStrategy = dailyStatsStrategy;
    }

    public UserStats getDailyStats(String userId) {
        return dailyStatsStrategy.calculate(userId);
    }
}
