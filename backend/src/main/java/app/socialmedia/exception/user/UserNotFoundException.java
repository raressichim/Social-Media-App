package app.socialmedia.exception.user;

import app.socialmedia.exception.CustomException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends CustomException {
    public UserNotFoundException() {
        setHttpStatus(HttpStatus.NOT_FOUND);
        setMessage("User not found!");
    }
}
