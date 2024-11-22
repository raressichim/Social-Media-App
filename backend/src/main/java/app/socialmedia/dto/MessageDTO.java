package app.socialmedia.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class MessageDTO {
    private Long receiverId;
    private String content;
}
