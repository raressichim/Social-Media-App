package app.socialmedia.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Blob;

@Getter
@Setter
@ToString
public class EditUserDTO {

    private String firstName;

    private String lastName;

    private String email;
}
