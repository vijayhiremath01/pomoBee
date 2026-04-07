package com.pomobee.backend.repository;

import com.pomobee.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User , String> {
    Optional<User> findByEmail(String email);
}
