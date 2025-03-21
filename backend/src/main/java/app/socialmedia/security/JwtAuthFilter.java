package app.socialmedia.security;

import app.socialmedia.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private TokenService tokenService;
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if (request.getRequestURI().equals("/api/users/register") ||(request.getRequestURI().equals("api/files/upload")) || request.getRequestURI().equals("/api/auth/login") || request.getRequestURI().equals("/chat")) {
            filterChain.doFilter(request, response);
            return;
        }
        Cookie[] cookies = request.getCookies();
        String sessionToken = null;
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("sessionToken".equals(cookie.getName())) {
                    sessionToken = cookie.getValue();
                } else if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        } else{
            log.warn("Cookies are null");
        }

        if (request.getRequestURI().equals("/api/auth/refresh")) {
            if (!tokenService.validateRefreshToken(refreshToken)) {
                tokenService.addEmptyCookies(response,401);
                log.info("Invalid refresh token");
                return;
            }
            String email = tokenService.getClaims(sessionToken).get("user_id").toString();
            String newSessionToken = tokenService.generateToken(email, "session");
            String newRefreshToken = tokenService.generateToken(email, "refresh");
            tokenService.addTokensToCookies(newSessionToken, newRefreshToken, response);
            log.info("Refresh token sent");
            filterChain.doFilter(request, response);
            return;
        }

        if (!tokenService.validateSessionToken(sessionToken)) {
            tokenService.addEmptyCookies(response,401);
            log.error(" Invalid session token");
            return;
        }
        String email = tokenService.getClaims(sessionToken).get("user_id").toString();
        UserDetails userDetails = userService.loadUserByUsername(email);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
