package app.socialmedia.controller;

import app.socialmedia.dto.FriendRequestDto;
import app.socialmedia.entity.Friendship;
import app.socialmedia.entity.Post;
import app.socialmedia.entity.User;
import app.socialmedia.service.FriendshipService;
import app.socialmedia.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/friends")
@AllArgsConstructor
public class FriendController {

    private final PostService postService;
    private final FriendshipService friendshipService;

    @GetMapping
    public List<Friendship> getFriends(@AuthenticationPrincipal UserDetails user) {
        return friendshipService.getFriends(user);
    }

    @GetMapping("/requests")
    public List<Friendship> getFriendRequests(@AuthenticationPrincipal UserDetails user){
        return friendshipService.getRequests(user);
    }

    @PostMapping("/request")
    public User addFriend(@AuthenticationPrincipal UserDetails userDetails, @RequestBody FriendRequestDto friendRequestDto) {
        System.out.println("Friend request");
        return friendshipService.addFriendship(userDetails,friendRequestDto);
    }

    @PostMapping()
    public ResponseEntity<Friendship> acceptFriendShip(@AuthenticationPrincipal UserDetails userDetails, @RequestBody FriendRequestDto friendRequestDto) {
        return friendshipService.acceptFriendShip(userDetails,friendRequestDto);
    }

    @PostMapping("/decline")
    public ResponseEntity<String> declineFriendship(@AuthenticationPrincipal UserDetails userDetails, @RequestBody FriendRequestDto friendRequestDto) {
        return friendshipService.declineFriendShip(userDetails, friendRequestDto);
    }

    @GetMapping("/posts")
    public List<Post> getPosts(@AuthenticationPrincipal UserDetails user) {
        return postService.getFriendsPosts(user);
    }
}
