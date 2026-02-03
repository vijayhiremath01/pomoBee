package com.pomodoro.pomodoro.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final List<String> allowedOrigins;

    public CorsConfig(@Value("${CORS_ALLOWED_ORIGINS:*}") String origins) {
        this.allowedOrigins = Arrays.stream(origins.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toList());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        var mapping = registry.addMapping("/**")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");

        if (allowedOrigins.contains("*")) {
            mapping.allowedOriginPatterns("*")
                .allowCredentials(false);
        } else {
            mapping.allowedOrigins(allowedOrigins.toArray(new String[0]))
                .allowCredentials(true);
        }
    }
}
