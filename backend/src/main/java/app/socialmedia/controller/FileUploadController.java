package app.socialmedia.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RequestMapping("/api/files")
@RestController
public class FileUploadController {

    private final String uploadDirectory = "uploads";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {

            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDirectory, fileName);
            Files.write(filePath, file.getBytes());


            return ResponseEntity.ok(new FileUploadResponse("/" + uploadDirectory + "/" + fileName));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
        }
    }

    static class FileUploadResponse {
        private String fileUrl;

        public FileUploadResponse(String fileUrl) {
            this.fileUrl = fileUrl;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }
    }
}
