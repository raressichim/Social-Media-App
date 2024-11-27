package app.socialmedia.controller;

import app.socialmedia.dto.MessageDTO;
import app.socialmedia.entity.Message;
import app.socialmedia.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
public class MessageController {
    private final SimpMessagingTemplate brokerMessagingTemplate;
    private MessageService messageService;

    @GetMapping("/{receiverId}")
    public List<Message> getMessages(@PathVariable Long receiverId, @AuthenticationPrincipal UserDetails user) {
        return messageService.getMessages(receiverId, user);
    }

    @PostMapping("/send")
    public MessageDTO sendMessage(@AuthenticationPrincipal UserDetails user,
                                  @RequestBody MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO, user);
    }



}
