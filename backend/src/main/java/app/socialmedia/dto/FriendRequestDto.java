package app.socialmedia.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestDto {
    private String email;
    private Long userId;
}
