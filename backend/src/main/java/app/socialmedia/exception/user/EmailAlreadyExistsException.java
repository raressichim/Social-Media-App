package app.socialmedia.exception.user;

import app.socialmedia.exception.CustomException;
import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends CustomException {
    public EmailAlreadyExistsException() {
        setHttpStatus(HttpStatus.BAD_REQUEST);
        setMessage("There is already a user registered with this email");
    }
}
