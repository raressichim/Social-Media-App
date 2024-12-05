package app.socialmedia.controller;

import app.socialmedia.entity.Message;
import app.socialmedia.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
public class MessageController {
    private MessageService messageService;

    @GetMapping("/{receiverId}")
    public List<Message> getMessages(@PathVariable Long receiverId, @AuthenticationPrincipal UserDetails user) {
        return messageService.getMessages(receiverId, user);
    }
}
