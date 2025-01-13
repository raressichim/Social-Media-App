package app.socialmedia.controller;

import app.socialmedia.dto.PostRequest;
import app.socialmedia.entity.Post;
import app.socialmedia.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
public class PostController {

    private PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(){
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<Post> addPost(@AuthenticationPrincipal UserDetails userDetails, @RequestBody PostRequest postRequest){
        return ResponseEntity.ok(postService.addPost(userDetails,postRequest));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getPost(@PathVariable Long userId){
        return ResponseEntity.ok(postService.getPostsForUser(userId));
    }
}
