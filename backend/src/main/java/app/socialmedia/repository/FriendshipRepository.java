package app.socialmedia.repository;

import app.socialmedia.entity.Friendship;
import app.socialmedia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE (f.user.id = :userId AND f.friend.id = :friendId) " +
            "OR (f.user.id = :friendId AND f.friend.id = :userId)")
    Friendship findFriendship(@Param("userId") Long userId, @Param("friendId") Long friendId);

    @Query("SELECT f1 FROM Friendship f1 " +
            "JOIN Friendship f2 ON f1.friend = f2.user AND f1.user = f2.friend " +
            "WHERE f1.user = :user OR f1.friend = :user")
    List<Friendship> findReciprocalFriendships(@Param("user") User user);

    @Query("SELECT f FROM Friendship f WHERE f.friend = :user AND NOT EXISTS " +
            "(SELECT 1 FROM Friendship f2 WHERE f2.user = :user AND f2.friend = f.user)")
    List<Friendship> findNonReciprocalFriendships(@Param("user") User user);


}
