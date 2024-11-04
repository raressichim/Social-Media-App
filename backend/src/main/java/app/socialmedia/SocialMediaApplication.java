package app.socialmedia;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SocialMediaApplication {
    public static void main(String[] args) {
        SpringApplication.run(SocialMediaApplication.class, args);
    }

//    private static void generateSecret() {
//        var key = Jwts.SIG.HS256.key().build();
//        var keyEncoded = Encoders.BASE64.encode(key.getEncoded());
//
//        System.out.println("Secret: " + keyEncoded);
//    }
}
