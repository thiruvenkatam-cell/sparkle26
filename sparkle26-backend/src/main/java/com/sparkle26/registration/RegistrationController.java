package com.sparkle26.registration;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

// Registration create panradhu ippo /api/payments/create-order la thaan.
// Pazhaya POST /api/registrations remove panniten, illana payment bypass panni ticket edukkalaam.
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    private final RegistrationRepository repository;
    public RegistrationController(RegistrationRepository repository) { this.repository = repository; }

    @GetMapping("/{ticketCode}")
    public Registration getTicket(@PathVariable String ticketCode) {
        return repository.findByTicketCode(ticketCode)
                .filter(Registration::isPaid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
    }
}
