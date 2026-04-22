package com.pomobee.backend.stats;

import com.pomobee.backend.model.PomodoroSession;
import com.pomobee.backend.model.UserStats;
import com.pomobee.backend.repository.SessionRepository;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public abstract class WeeklyStatsStrategy implements StatsStrategy{

     private final SessionRepository sessionRepository ;


     public WeeklyStatsStrategy(SessionRepository sessionRepository){
         this.sessionRepository = sessionRepository ;
     }

     @Override
    public UserStats calculate(String userId){

         LocalDate today = LocalDate.now();

         LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
         LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

         LocalDateTime start = startOfWeek.atStartOfDay();
         LocalDateTime end = endOfWeek.atTime(LocalTime.MAX);
         List<PomodoroSession> sessions =
                 sessionRepository.findByUserIdAndEndTimeBetween(userId, start, end);

         int totalMinutes = sessions.stream()
                 .filter(s -> "FOCUS".equalsIgnoreCase(s.getType()))
                 .mapToInt(PomodoroSession::getDuration)
                 .sum();

         int sessionCount = (int) sessions.stream()
                 .filter(s -> "FOCUS".equalsIgnoreCase(s.getType()))
                 .count();

         UserStats stats = new UserStats();
         stats.setUserId(userId);
         stats.setDate(today);
         stats.setTotalFocusMinutes(totalMinutes);
         stats.setSessionsCompleted(sessionCount);

         return stats;
     }
}
