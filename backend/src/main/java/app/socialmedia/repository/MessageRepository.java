package app.socialmedia.repository;

import app.socialmedia.entity.Message;
import app.socialmedia.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findMessagesBySenderAndReceiverId(User user, Long receiverId);

    List<Message> findMessagesBySenderAndReceiver(User sender, User receiver, Sort ASC);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :senderId AND m.receiver.id = :receiverId) OR " +
            "(m.sender.id = :receiverId AND m.receiver.id = :senderId)")
    List<Message> findMessagesBetweenUsers(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId,
            Sort ASC);

}
