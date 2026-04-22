package com.pomobee.backend.stats;

import com.pomobee.backend.model.UserStats;
import org.springframework.stereotype.Component;

@Component
public class StatsContext {

    private final DailyStatsStrategy daily;
    private final WeeklyStatsStrategy weekly;
    private final MonthlyStatsStrategy monthly;

    public StatsContext(DailyStatsStrategy daily,
                        WeeklyStatsStrategy weekly,
                        MonthlyStatsStrategy monthly) {
        this.daily = daily;
        this.weekly = weekly;
        this.monthly = monthly;
    }

    public UserStats getStats(String userId, String type) {

        return switch (type.toLowerCase()) {
            case "weekly" -> weekly.calculate(userId);
            case "monthly" -> monthly.calculate(userId);
            default -> daily.calculate(userId);
        };
    }
}