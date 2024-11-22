package app.socialmedia.controller;

import app.socialmedia.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload Message message) throws InterruptedException {
        Thread.sleep(1000);
        return message;
    }
}
