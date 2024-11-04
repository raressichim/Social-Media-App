package app.socialmedia.exception.user;

import app.socialmedia.exception.CustomException;
import org.springframework.http.HttpStatus;

public class InvalidEmailException extends CustomException {
    public InvalidEmailException() {
        setHttpStatus(HttpStatus.BAD_REQUEST);
        setMessage("The email doesn't have the correct format");
    }
}
