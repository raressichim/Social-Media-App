package app.socialmedia.service;

import app.socialmedia.dto.FriendRequestDto;
import app.socialmedia.entity.Friendship;
import app.socialmedia.entity.User;
import app.socialmedia.repository.FriendshipRepository;
import app.socialmedia.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public User addFriend(UserDetails userDetails, FriendRequestDto user) {
        User tempUser = userRepository.findByEmail(userDetails.getUsername());
        User friend = userRepository.findByEmail(user.getEmail());

        List<Friendship> friendships = tempUser.getFriendships();
        for(Friendship tempFriendship : friendships) {
            if(tempFriendship.getFriend().equals(friend)) {
                throw new RuntimeException("Friendship already exists");
            }
        }

        Friendship friendship = new Friendship(tempUser,friend);
        Friendship reciprocalFriendShip = new Friendship(friend,tempUser);

        friendshipRepository.save(friendship);
        friendshipRepository.save(reciprocalFriendShip);

        tempUser.getFriendships().add(friendship);
        friend.getFriendships().add(reciprocalFriendShip);

        userRepository.save(tempUser);
        userRepository.save(friend);
        return tempUser;
    }

    public List<Friendship> getFriends(UserDetails user) {
        User tempUser = userRepository.findByEmail(user.getUsername());
        return tempUser.getFriendships();
    }
}
