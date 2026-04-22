package com.pomobee.backend.stats;

import com.pomobee.backend.model.PomodoroSession;
import com.pomobee.backend.model.UserStats;
import com.pomobee.backend.repository.SessionRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public abstract class MonthlyStatsStrategy implements StatsStrategy{

       public SessionRepository sessionRepository ;

       public MonthlyStatsStrategy(SessionRepository sessionRepository){
           this.sessionRepository = sessionRepository ;
       }

       @Override
       public UserStats calculate(String userId){

           LocalDate today = LocalDate.now();

           LocalDate startOfMonth = today.withDayOfMonth(1);
           LocalDate endOfMonth  = today.withDayOfMonth(today.lengthOfMonth());


           LocalDateTime start = startOfMonth.atStartOfDay();
           LocalDateTime end = endOfMonth.atTime(LocalTime.MAX);

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
