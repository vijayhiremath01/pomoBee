package com.pomobee.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User extends BaseEntity {

    @Getter
    @Setter
    private String email ;

    @Setter
    @Getter
    private String password ;

}
