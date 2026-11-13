package com.sparkle26.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactRepository repository;
    public ContactController(ContactRepository repository) { this.repository = repository; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> send(@Valid @RequestBody ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName().trim());
        message.setEmail(request.getEmail().trim().toLowerCase());
        message.setSubject(request.getSubject().trim());
        message.setMessage(request.getMessage().trim());
        message.setCreatedAt(LocalDateTime.now());
        repository.save(message);
        return Map.of("message", "Contact message saved successfully");
    }
}
