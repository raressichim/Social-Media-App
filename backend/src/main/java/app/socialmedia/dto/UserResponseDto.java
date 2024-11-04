package app.socialmedia.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
public class UserResponseDto {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private byte[] picture;
}
