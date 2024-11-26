package app.socialmedia.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
public class TokenService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.sessionTokenDuration}")
    private int sessionTokenDuration;

    public String generateToken(String email,String type) {
        Date sessionTokenExp = Date.from(ZonedDateTime.now().plusMinutes(sessionTokenDuration).toInstant());
        return Jwts.builder()
                .claim("user_id", email)
                .claim("type", type)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(sessionTokenExp)
                .signWith(getJwtKey())
                .compact();
    }

    private SecretKey getJwtKey() {
        var keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser().verifyWith(getJwtKey()).build().parseSignedClaims(token).getPayload();
        } catch (UnsupportedJwtException e) {
            log.info("Token is invalid");
            return null;
        }
    }

    protected boolean validateToken(String token) {
        if (token == null) {
            return false;
        }
        try {
            Map<String, Object> validatedSessionToken = validateClaims(token);
            if (!Objects.equals(validatedSessionToken.get("valid").toString(), "true")) {
                log.error(validatedSessionToken.get("error").toString());
                return false;
            }

        } catch (Exception e) {
            return false;
        }
        return true;
    }

    public boolean validateSessionToken(String token) {
        if (!validateToken(token)) {
            return false;
        }
        Claims claims = getClaims(token);
        return claims.get("type").equals("session");
    }

    protected boolean validateRefreshToken(String token) {
        if (!validateToken(token)) {
            return false;
        }
        Claims claims = getClaims(token);
        return claims.get("type").equals("refresh");
    }

    protected Map<String, Object> validateClaims(String token) {
        Map<String, Object> response = new HashMap<>();
        boolean valid = true;

        try {
            Claims claims = getClaims(token);

            response.put("user_id", claims.get("user_id"));

        } catch (ExpiredJwtException e) {
            valid = false;
            response.put("error", "Token has expired: " + e.getMessage());
        } catch (JwtException e) {
            valid = false;
            response.put("error", "Token is invalid: " + e.getMessage());
        }

        response.put("valid", valid);
        return response;
    }

    public void addEmptyCookies(HttpServletResponse response, int status) {
        ResponseCookie invalidSessionTokenCookie = ResponseCookie.from("sessionToken", "").httpOnly(true).secure(false).path("/").maxAge(0) // Expire immediately
                .build();
        ResponseCookie invalidRefreshTokenCookie = ResponseCookie.from("refreshToken", "").httpOnly(true).secure(false).path("/").maxAge(0) // Expire immediately
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, invalidSessionTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, invalidRefreshTokenCookie.toString());
        response.setStatus(status);
    }

    public void addTokensToCookies(String sessionToken, String refreshToken, HttpServletResponse response) {
        ResponseCookie sessionTokenCookie =
                ResponseCookie.from("sessionToken", sessionToken)
                        .httpOnly(true) // Set HttpOnly to prevent JavaScript access
                        .secure(false) // Set secure to false, consider true in production with HTTPS
                        .path("/") // Set cookie path to the root
                        .maxAge(3600)
                        .build();

        ResponseCookie refreshTokenCookie =
                ResponseCookie.from("refreshToken", refreshToken)
                        .httpOnly(true) // Set HttpOnly to prevent JavaScript access
                        .secure(false) // Set secure to false, consider true in production with HTTPS
                        .path("/") // Set cookie path to the root
                        .maxAge(3600)
                        .build();

        response.addHeader(HttpHeaders.SET_COOKIE, sessionTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }
}
