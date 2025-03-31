package app.socialmedia.service;

import app.socialmedia.dto.CommentDTO;
import app.socialmedia.entity.Comment;
import app.socialmedia.entity.Post;
import app.socialmedia.entity.User;
import app.socialmedia.repository.CommentRepository;
import app.socialmedia.repository.PostRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@AllArgsConstructor
public class CommentService {


    private final ModelMapper modelMapper;
    private final PostService postService;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public ResponseEntity<List<Comment>> getAllComentsForPost(Long postId) {
        Post post = postRepository.findById(postId).orElse(null);
        return ResponseEntity.ok(post.getComments());
    }

    public ResponseEntity<Comment> addCommentForPost(CommentDTO commentDTO, UserDetails user) {
        Post post = postRepository.findById(commentDTO.getPostId()).orElse(null);
        User tempUser = userRepository.findByEmail(user.getUsername());
        Comment comment = new Comment(tempUser,commentDTO.getContent(),post);
        commentRepository.save(comment);
        return ResponseEntity.ok(comment);
    }
}
