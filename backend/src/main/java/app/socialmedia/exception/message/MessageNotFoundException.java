package app.socialmedia.exception.message;

import app.socialmedia.exception.CustomException;
import org.springframework.http.HttpStatus;

public class MessageNotFoundException extends CustomException {
    public MessageNotFoundException(){
        setHttpStatus(HttpStatus.NOT_FOUND);
        setMessage("Message not found");
    }
}
