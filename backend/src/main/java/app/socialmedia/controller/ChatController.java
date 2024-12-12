package app.socialmedia.controller;

import app.socialmedia.dto.MessageDTO;
import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import app.socialmedia.exception.user.UserNotFoundException;
import app.socialmedia.repository.MessageRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;

    private final MessageRepository messageRepository;

    private UserRepository userRepository;

    @MessageMapping("/private-message")
    public Message sendMessage(MessageDTO message) {
        User sender = userRepository.findById(message.getSenderId()).orElseThrow(UserNotFoundException::new);
        User receiver = userRepository.findById(message.getReceiverId()).orElseThrow(UserNotFoundException::new);

        Message tempMessage = new Message(sender,receiver,message.getContent());
        Message chatMessage = messageRepository.save(tempMessage);
        log.info(String.valueOf(tempMessage.getId()));
        messagingTemplate.convertAndSendToUser(sender.getEmail(), "/queue/messages", tempMessage);

        messagingTemplate.convertAndSendToUser(receiver.getEmail(), "/queue/messages", tempMessage);
        messagingTemplate.convertAndSendToUser(
                sender.getEmail(), // User-specific channel
                "/queue/replies",
                chatMessage
        );
        return tempMessage;
    }
}

