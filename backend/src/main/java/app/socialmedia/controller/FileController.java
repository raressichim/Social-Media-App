package app.socialmedia.controller;

import app.socialmedia.entity.User;
import app.socialmedia.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.file.Paths.get;

@RequestMapping("/api/files")
@RestController
public class FileController {

    private final String uploadDirectory = "uploads";
    private final UserRepository userRepository;

    public FileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {

            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String fileName = file.getOriginalFilename();
            Path filePath = get(uploadDirectory, fileName);
            Files.write(filePath, file.getBytes());


            return ResponseEntity.ok(new FileUploadResponse("/" + uploadDirectory + "/" + fileName));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
        }
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails user) {
        try {

            File dir = new File(uploadDirectory);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = file.getOriginalFilename();
            Path filePath = get(uploadDirectory, fileName);
            Files.write(filePath, file.getBytes());
            User tempUser = userRepository.findByEmail(user.getUsername());
            FileUploadResponse fileUploadResponse = new FileUploadResponse("/" + uploadDirectory + "/" + fileName);
            tempUser.setPicture("http://localhost:8080/api/files"+fileUploadResponse.getFileUrl());
            userRepository.save(tempUser);


            return ResponseEntity.ok(fileUploadResponse);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed", e);
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public Resource getFile(@PathVariable String filename) throws Exception{

        Path filePath = get("uploads").resolve(filename).normalize();

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + filePath.toAbsolutePath());
        }

        return new UrlResource(filePath.toUri());
    }

    @GetMapping("/download/{filename}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename) throws IOException {
        Path filePath = get(uploadDirectory).toAbsolutePath().normalize().resolve(filename);
        System.out.println("Path: " + filePath);
        if(!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + filename);
        }
        Resource resource = new UrlResource(filePath.toUri());
        HttpHeaders headers = new HttpHeaders();
        headers.add("File-Name", filename);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;File-Name="+ filename);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath))).headers(headers).body(resource);
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
