package app.socialmedia.dto;

import app.socialmedia.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {

    private User user;

    private String body;

    private Date date;
}
