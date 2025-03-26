package app.socialmedia.service;

import app.socialmedia.dto.FriendRequestDto;
import app.socialmedia.entity.Friendship;
import app.socialmedia.entity.User;
import app.socialmedia.repository.FriendshipRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public User addFriendship(UserDetails userDetails, FriendRequestDto user) {
        User sender = userRepository.findByEmail(userDetails.getUsername());
        User receiver = userRepository.findById(user.getUserId()).orElse(null);

        List<Friendship> friendships = sender.getFriendships();
        for(Friendship tempFriendship : friendships) {
            if(tempFriendship.getFriend().equals(receiver)) {
                throw new RuntimeException("Friendship already exists");
            }
        }

        Friendship friendship = new Friendship(sender,receiver);

        friendshipRepository.save(friendship);

        sender.getFriendships().add(friendship);

        userRepository.save(sender);
        return sender;
    }

    public ResponseEntity<Friendship> acceptFriendShip(UserDetails userDetails, FriendRequestDto user) {
        User receiver = userRepository.findByEmail(userDetails.getUsername());
        User sender = userRepository.findById(user.getUserId()).orElse(null);

        Friendship friendship = new Friendship(receiver,sender);
        friendshipRepository.save(friendship);
        receiver.getFriendships().add(friendship);
        userRepository.save(receiver);

        return ResponseEntity.ok(friendship);

    }

    public List<Friendship> getRequests(UserDetails userDetails) {
        User receiver = userRepository.findByEmail(userDetails.getUsername());
        return friendshipRepository.findNonReciprocalFriendships(receiver);
    }



    public List<Friendship> getFriends(UserDetails user) {
        User tempUser = userRepository.findByEmail(user.getUsername());
        List<Friendship> friendshipList = friendshipRepository.findReciprocalFriendships(tempUser);
        List<Friendship> friends = new ArrayList<>();
        for(Friendship friendShip : friendshipList){
            if(tempUser.getFriendships().contains(friendShip)){
                friends.add(friendShip);
            }
        }
        return friends;
    }



    public ResponseEntity<String> declineFriendShip(UserDetails user, FriendRequestDto friendRequestDto) {
        User receiver = userRepository.findByEmail(user.getUsername());
        User sender = userRepository.findById(friendRequestDto.getUserId()).orElse(null);
        friendshipRepository.delete(friendshipRepository.findFriendship(receiver.getId(),sender.getId()));;
        sender.getFriendships().remove(friendshipRepository.findFriendship(receiver.getId(),sender.getId()));
        userRepository.save(sender);
        return ResponseEntity.ok("Friendship declined");
    }

}
