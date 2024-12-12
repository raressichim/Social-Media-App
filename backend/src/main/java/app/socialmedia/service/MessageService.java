package app.socialmedia.service;

import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import app.socialmedia.exception.message.MessageNotFoundException;
import app.socialmedia.exception.user.UserNotFoundException;
import app.socialmedia.repository.MessageRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class MessageService {
    private MessageRepository messageRepository;
    private UserRepository userRepository;

    public List<Message> getMessages(Long receiverId, UserDetails userDetails) {
        User sender = userRepository.findByEmail(userDetails.getUsername());
        User receiver = userRepository.findById(receiverId).orElseThrow(UserNotFoundException::new);
        return messageRepository.findMessagesBetweenUsers(sender.getId(), receiver.getId(), Sort.by(Sort.Direction.ASC, "id"));
    }

    public String insertAttachment(Long id, MultipartFile attachment) {
        Message tempMessage = messageRepository.findById(id).orElseThrow(MessageNotFoundException::new);
        try {
            tempMessage.setAttachment(attachment.getBytes());
            messageRepository.save(tempMessage);
        } catch (IOException e) {
            log.error("Failed to add attachment");
            throw new RuntimeException(e);
        }
        return "Inserted attachment";
    }
}
