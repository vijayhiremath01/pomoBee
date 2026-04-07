package com.pomobee.backend.repository;

import com.pomobee.backend.model.UserSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SettingsRepository extends MongoRepository<UserSettings , String> {
    Optional<UserSettings> findByUserId(String userId);
}
