package app.socialmedia.controller;

import app.socialmedia.dto.LoginRequestDto;
import app.socialmedia.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthService authService;

    @PostMapping("/login")
    public void login(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response) {
        authService.login(loginRequestDto,response);
    }
    @PostMapping("/refresh")
    public void refresh() {}
}
