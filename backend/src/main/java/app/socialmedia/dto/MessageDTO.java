package app.socialmedia.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class MessageDTO {
    private Long senderId;
    private Long receiverId;
    private String content;
}
