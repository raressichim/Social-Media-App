package app.socialmedia.controller;

import app.socialmedia.dto.MessageDTO;
import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import app.socialmedia.repository.MessageRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;

    private final MessageRepository messageRepository;

    private UserRepository userRepository;

    @MessageMapping("/private-message")
    public Message sendMessage(MessageDTO message) throws IOException {
        log.info(message.toString());

        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        User receiver = userRepository.findById(message.getReceiverId()).orElse(null);


        Message tempMessage = new Message();
        tempMessage.setSender(sender);
        tempMessage.setReceiver(receiver);
        tempMessage.setContent(message.getContent());
        tempMessage.setType(message.getType());

        if("FILE".equals(message.getType()) && message.getFileUrl() != null){
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            String fileName = message.getFileName();

            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            System.out.println(fileUrl);
            tempMessage.setFileUrl(fileUrl);

        }

        messageRepository.save(tempMessage);
        System.out.println(tempMessage.getFileUrl());

        messagingTemplate.convertAndSendToUser(sender.getEmail(), "/queue/messages", tempMessage);
        messagingTemplate.convertAndSendToUser(receiver.getEmail(), "/queue/messages", tempMessage);

        return tempMessage;
    }
}

