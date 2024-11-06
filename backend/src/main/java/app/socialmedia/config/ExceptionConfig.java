package app.socialmedia.config;

import app.socialmedia.exception.CustomException;
import app.socialmedia.exception.ErrorMessage;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionConfig {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorMessage> handleCustomException(CustomException ex) {
        ErrorMessage errorMessage = new ErrorMessage(ex.getMessage());
        return ResponseEntity.status(ex.getHttpStatus())
                .contentType(MediaType.APPLICATION_JSON)
                .body(errorMessage);
    }
}
