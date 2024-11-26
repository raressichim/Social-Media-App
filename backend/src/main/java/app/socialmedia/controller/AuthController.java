package app.socialmedia.controller;

import app.socialmedia.dto.LoginRequestDto;
import app.socialmedia.entity.User;
import app.socialmedia.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private AuthService authService;

    @PostMapping("/login")
    public User login(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
       return authService.login(loginRequestDto, response);
    }

    @PostMapping("/refresh")
    public void refresh() {
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        authService.logout(response);
    }
}
