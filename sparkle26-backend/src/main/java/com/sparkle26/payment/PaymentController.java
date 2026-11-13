package com.sparkle26.payment;

import com.sparkle26.registration.RegistrationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService service;

    public PaymentController(PaymentService service) { this.service = service; }

    public record SubmitRequest(@NotBlank String reference, @NotBlank String utr) {}

    // 1) Registration form -> saved as PENDING (free events get the ticket immediately)
    @PostMapping("/register")
    public PaymentService.RegisterResponse register(@Valid @RequestBody RegistrationRequest request) {
        return service.register(request);
    }

    // 2) Participant paid on the GPay QR -> submits the UTR for verification
    @PostMapping("/submit")
    public PaymentService.StatusResponse submit(@Valid @RequestBody SubmitRequest req) {
        return service.submitUtr(req.reference().trim(), req.utr());
    }

    // 3) Participant checks whether the organizers approved the payment
    @GetMapping("/status/{reference}")
    public PaymentService.StatusResponse status(@PathVariable String reference) {
        return service.status(reference.trim());
    }
}
