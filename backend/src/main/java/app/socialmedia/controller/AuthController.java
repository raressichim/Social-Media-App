package app.socialmedia.controller;

import app.socialmedia.dto.LoginRequestDto;
import app.socialmedia.repository.UserRepository;
import app.socialmedia.security.TokenService;
import app.socialmedia.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;
    private UserDetailsService userDetailsService;
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<String> login(@RequestBody LoginRequestDto loginRequestDto){
        Authentication authentication = new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        authenticationManager.authenticate(authentication);
        return ResponseEntity.ok(tokenService.generateToken(loginRequestDto.getEmail()));
    }

}
