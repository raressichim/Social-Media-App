package app.socialmedia.controller;

import app.socialmedia.dto.CommentDTO;
import app.socialmedia.entity.Comment;
import app.socialmedia.entity.Post;
import app.socialmedia.service.CommentService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getAllComments(@PathVariable("postId") Long postId) {
        return commentService.getAllComentsForPost(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@AuthenticationPrincipal UserDetails user, @RequestBody CommentDTO commentDTO) {
        return commentService.addCommentForPost(commentDTO,user);
    }
}
