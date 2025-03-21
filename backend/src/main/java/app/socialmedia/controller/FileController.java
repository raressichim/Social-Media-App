package app.socialmedia.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
public class FileController {
    private final Path uploadDir = Paths.get("uploads");



    @GetMapping("/{filename:.+}")
    public Resource getFile(@PathVariable String filename) throws Exception{

        Path filePath = uploadDir.resolve(filename).normalize();

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + filePath.toAbsolutePath());
        }

        return new UrlResource(filePath.toUri());
    }
}
