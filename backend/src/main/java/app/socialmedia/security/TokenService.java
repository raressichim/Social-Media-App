package app.socialmedia.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class TokenService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.sessionTokenDuration}")
    private int sessionTokenDuration;

    public String generateToken(String email) {
        Date sessionTokenExp = Date.from(ZonedDateTime.now().plusMinutes(sessionTokenDuration).toInstant());
        return Jwts.builder()
                .claim("user_id", email)
                .claim("type", "session")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(sessionTokenExp)
                .signWith(getJwtKey())
                .compact();
    }

    private SecretKey getJwtKey() {
        var keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    protected Claims getClaims(String token) {
        try {
            return Jwts.parser().verifyWith(getJwtKey()).build().parseSignedClaims(token).getPayload();
        } catch (UnsupportedJwtException e) {
            log.info("Token is invalid");
            return null;
        }
    }

    protected Map<String, Object> validateToken(String token) {
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
}
