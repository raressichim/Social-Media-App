package app.socialmedia.controller;

import app.socialmedia.dto.EditUserDTO;
import app.socialmedia.dto.UserRequestDto;
import app.socialmedia.dto.UserResponseDto;
import app.socialmedia.entity.Post;
import app.socialmedia.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@Slf4j
public class UserController {
    private UserService userService;

    @GetMapping
    public List<UserResponseDto> getAllUsers(){
        return userService.findAllUsers();
    }

    @GetMapping("/{userId}")
    public UserResponseDto getUser(@PathVariable Long userId){
        return userService.findUserById(userId);
    }

    @PostMapping("/register")
    public UserResponseDto addUser(@RequestBody UserRequestDto userDto){
        log.info(userDto.toString());
        return userService.addUser(userDto);
    }

    @PostMapping("/edit")
    public UserResponseDto updateUser(@AuthenticationPrincipal UserDetails user, @RequestBody EditUserDTO updatedUser){
        return userService.updateUser(user,updatedUser);
    }

}
