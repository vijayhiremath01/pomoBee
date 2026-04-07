package com.pomobee.backend.security;

import com.pomobee.backend.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    public JwtUtil(JwtProperties properties) {
        String secret = properties.getSecret();
        this.key = buildKey(secret);
        log.info("Loaded JWT secret (length={} characters)", secret == null ? 0 : secret.length());
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractUserId(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private Key buildKey(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be set (32+ chars or Base64 for HS256)");
        }

        byte[] keyBytes;

        // Allow either raw text or Base64-encoded secrets
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ignored) {
            keyBytes = secret.getBytes(); // raw text path
        }

        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET is too short; need at least 256 bits (32 bytes) for HS256");
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }
}
