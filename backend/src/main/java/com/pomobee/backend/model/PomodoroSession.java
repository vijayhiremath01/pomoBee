package com.pomobee.backend.model;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "sessions")
public class PomodoroSession extends BaseEntity {

    private String userId ;
    private LocalDateTime startTime ;
    private LocalDateTime endTime ;
    private int duration ;
    private String type ;
    private int cycleNumber ;
    private boolean longBreak ;

}
