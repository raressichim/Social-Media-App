package app.socialmedia.repository;

import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findMessagesBySenderAndReceiverId(User user, Long receiverId);
}
