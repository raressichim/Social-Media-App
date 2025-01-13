package app.socialmedia.repository;

import app.socialmedia.entity.Friendship;
import app.socialmedia.entity.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id IN :friendIds OR p.user.id = :userId")
    List<Post> findPostsByFriendsAndUser(@Param("friendIds") List<Long> friendIds, @Param("userId") Long userId, Sort sort);

    List<Post> findPostsByUserId(Long userId);

}
