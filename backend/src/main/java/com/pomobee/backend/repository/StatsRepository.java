package com.pomobee.backend.repository;

import com.pomobee.backend.model.UserStats;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface StatsRepository extends MongoRepository<UserStats , String> {
    Optional<UserStats> findByUserIdAndDate(String userId , LocalDate date);
}
