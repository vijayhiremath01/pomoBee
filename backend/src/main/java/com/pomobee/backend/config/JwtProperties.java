package com.pomobee.backend.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    @NotBlank(message = "JWT secret must be provided via JWT_SECRET (or use dev/local profile to auto-generate)")
    @Size(min = 32, message = "JWT secret must be at least 32 characters (256 bits) for HS256")
    private String secret;

    public void setSecret(String secret) {
        // Trim to avoid accidental whitespace-only secrets coming from shell exports
        this.secret = secret == null ? null : secret.trim();
    }
}
