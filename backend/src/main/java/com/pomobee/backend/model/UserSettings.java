package com.pomobee.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "settings")
@Getter
@Setter
public class UserSettings extends BaseEntity {

    private String userId;
    private int focusDuration;
    private int breakDuration;
}
