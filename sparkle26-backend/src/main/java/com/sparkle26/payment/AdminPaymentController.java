package com.sparkle26.payment;

import com.sparkle26.registration.Registration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

/** Organizer-only: verify GPay payments, approve (ticket + mail) or reject. Protected by ADMIN_API_KEY. */
@RestController
@RequestMapping("/api/admin/payments")
public class AdminPaymentController {
    private final PaymentService service;
    @Value("${ADMIN_API_KEY:}") private String adminApiKey;

    public AdminPaymentController(PaymentService service) { this.service = service; }

    public record RejectRequest(String reason) {}

    private void authorize(String supplied) {
        if (adminApiKey == null || adminApiKey.isBlank() || supplied == null
                || !MessageDigest.isEqual(adminApiKey.getBytes(StandardCharsets.UTF_8), supplied.getBytes(StandardCharsets.UTF_8)))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin authentication required");
    }

    @GetMapping
    public Map<String, Object> list(@RequestHeader(value = "X-Admin-Key", required = false) String key,
                                    @RequestParam(required = false) String status) {
        authorize(key);
        return service.adminList(status);
    }

    @PostMapping("/{id}/approve")
    public Map<String, String> approve(@RequestHeader(value = "X-Admin-Key", required = false) String key,
                                       @PathVariable Long id) {
        authorize(key);
        Registration r = service.approve(id);
        return Map.of("status", r.getPaymentStatus(), "ticketCode", r.getTicketCode());
    }

    @PostMapping("/{id}/reject")
    public Map<String, String> reject(@RequestHeader(value = "X-Admin-Key", required = false) String key,
                                      @PathVariable Long id,
                                      @RequestBody(required = false) RejectRequest body) {
        authorize(key);
        Registration r = service.reject(id, body == null ? null : body.reason());
        return Map.of("status", r.getPaymentStatus());
    }

    @PostMapping("/{id}/resend")
    public Map<String, Boolean> resend(@RequestHeader(value = "X-Admin-Key", required = false) String key,
                                       @PathVariable Long id) {
        authorize(key);
        service.resendMail(id);
        return Map.of("ok", true);
    }
}
