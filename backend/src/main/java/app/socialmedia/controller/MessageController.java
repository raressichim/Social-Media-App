package app.socialmedia.controller;

import app.socialmedia.entity.Message;
import app.socialmedia.service.MessageService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@AllArgsConstructor
@Slf4j
public class MessageController {
    private MessageService messageService;

    @GetMapping("/{receiverId}")
    public List<Message> getMessages(@PathVariable Long receiverId, @AuthenticationPrincipal UserDetails user) {
        return messageService.getMessages(receiverId, user);
    }

    @PostMapping(value = "/attachments")
    public void addAttachment(
            @RequestParam("id") Long id,
            @RequestParam("attachment") MultipartFile attachment) {
        String returnString = messageService.insertAttachment(id, attachment);
        log.info(returnString);
    }
}
