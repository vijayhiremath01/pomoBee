package com.pomobee.backend.stats;

import com.pomobee.backend.model.UserStats;

public interface StatsStrategy {
    UserStats calculate(String userId);
}
