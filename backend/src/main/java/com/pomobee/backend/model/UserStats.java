package com.pomobee.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Document(collection = "stats")
@Getter
@Setter
public class UserStats extends BaseEntity {

    private String userId;
    private LocalDate date;
    private int totalFocusMinutes;
    private int sessionsCompleted;
}
