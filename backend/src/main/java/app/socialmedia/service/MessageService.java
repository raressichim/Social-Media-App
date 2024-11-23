package app.socialmedia.service;

import app.socialmedia.dto.MessageDTO;
import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import app.socialmedia.exception.user.UserNotFoundException;
import app.socialmedia.repository.MessageRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class MessageService {
    private MessageRepository messageRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    public MessageDTO sendMessage(MessageDTO messageDTO, UserDetails userDetails) {
        User sender = userRepository.findByEmail(userDetails.getUsername());
        User receiver = userRepository.findById(messageDTO.getReceiverId()).orElseThrow(UserNotFoundException::new);
        Message message = new Message(messageDTO.getContent(), receiver, sender);
        messageRepository.save(message);
        return modelMapper.map(message, MessageDTO.class);
    }

    public List<MessageDTO> getMessages(Long receiverId, UserDetails userDetails) {
        User sender = userRepository.findByEmail(userDetails.getUsername());
        User receiver = userRepository.findById(receiverId).orElseThrow(UserNotFoundException::new);
        List<Message> messagesReceived = messageRepository.findMessagesBySenderAndReceiver(sender, receiver, Sort.by(Sort.Direction.DESC, "id"));
        log.info(messagesReceived.toString());
        List<MessageDTO> messagesToReturn = new ArrayList<>();
        for (Message message : messagesReceived) {
            MessageDTO messageDTO = modelMapper.map(message, MessageDTO.class);
            messagesToReturn.add(messageDTO);
        }
        log.info(messagesToReturn.toString());
        return messagesToReturn;
    }
}
