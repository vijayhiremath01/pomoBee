package com.pomodoro.pomodoro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔴 Required for H2 console
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})

            // 🔴 Allow H2 console + APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            )

            // 🔴 VERY IMPORTANT: allow H2 iframe
            .headers(headers ->
                headers.frameOptions(frame -> frame.disable())
            )

            // Disable login screens
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
