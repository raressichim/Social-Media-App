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

import java.util.List;

@RestController
@Slf4j
@AllArgsConstructor
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/private-message")
    public Message sendMessage(MessageDTO message) {
            log.info(message.toString());
            User sender = userRepository.findById(message.getSenderId()).orElse(null);
            User receiver = userRepository.findById(message.getReceiverId()).orElse(null);

            Message tempMessage = new Message();
            tempMessage.setSender(sender);
            tempMessage.setReceiver(receiver);
            tempMessage.setContent(message.getContent());
            Message savedMessage = messageRepository.save(tempMessage);

            Message responseMessage = new Message();
            responseMessage.setSender(sender);
            responseMessage.setReceiver(receiver);
            responseMessage.setContent(message.getContent());

            messagingTemplate.convertAndSendToUser(sender.getEmail(),"/queue/messages", responseMessage);

            messagingTemplate.convertAndSendToUser(receiver.getEmail(),"/queue/messages", responseMessage);

            return responseMessage;
        }
    }

