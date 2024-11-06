package app.socialmedia.service;

import app.socialmedia.dto.LoginRequestDto;
import app.socialmedia.security.TokenService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private AuthenticationManager authenticationManager;
    private TokenService tokenService;

    public void login(LoginRequestDto loginRequestDto, HttpServletResponse response) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        authenticationManager.authenticate(authentication);
        String email = loginRequestDto.getEmail();
        String sessionToken = tokenService.generateToken(email, "session");
        String refreshToken = tokenService.generateToken(email, "refresh");
        tokenService.addTokensToCookies(sessionToken, refreshToken, response);
        log.info("Logged in user with email: {}", email);
        log.warn(sessionToken);
        log.warn(refreshToken);
    }
}
