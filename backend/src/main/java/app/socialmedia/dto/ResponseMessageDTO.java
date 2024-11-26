package app.socialmedia.dto;

import app.socialmedia.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseMessageDTO {
    private User sender;
    private User receiver;
    private String content;
}
