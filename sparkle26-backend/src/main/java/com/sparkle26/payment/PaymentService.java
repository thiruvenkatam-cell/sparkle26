package com.sparkle26.payment;

import com.sparkle26.events.EventController;
import com.sparkle26.registration.OnSpotRequest;
import com.sparkle26.registration.Registration;
import com.sparkle26.registration.RegistrationRepository;
import com.sparkle26.registration.RegistrationRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Manual GPay / UPI QR payment flow:
 *   register (PENDING) -> participant pays on the QR and submits the UTR (SUBMITTED)
 *   -> organizer checks the GPay account and approves (PAID, ticket + welcome mail) or rejects.
 * The fee always comes from the server side event list.
 */
@Service
public class PaymentService {
    private static final String REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
    private static final SecureRandom RANDOM = new SecureRandom();

    public record RegisterResponse(boolean free, String reference, Integer amount, Registration registration) {}

    public record StatusResponse(String status, String fullName, String eventId, Integer amount,
                                 String ticketCode, String rejectReason) {}

    public record AdminRow(Long id, String reference, String fullName, String email, String phone,
                           String college, String department, String year, String eventId, String eventTitle,
                           Integer amount, String utr, String status, String ticketCode,
                           LocalDateTime registeredAt, LocalDateTime submittedAt, LocalDateTime paidAt,
                           String rejectReason) {}

    private final RegistrationRepository repo;
    private final EmailService email;

    public PaymentService(RegistrationRepository repo, EmailService email) {
        this.repo = repo;
        this.email = email;
    }

    private static String newReference() {
        StringBuilder sb = new StringBuilder("REG-");
        for (int i = 0; i < 8; i++) sb.append(REF_CHARS.charAt(RANDOM.nextInt(REF_CHARS.length())));
        return sb.toString();
    }

    private static String newTicketCode() {
        return "SPK26-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    // ------------------------------------------------------------------ public flow

    /** Step 1: save the registration. Free event -> ticket right away. Paid event -> wait for QR payment. */
    @Transactional
    public RegisterResponse register(RegistrationRequest req) {
        EventController.Event event = EventController.findById(req.getEventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid event"));
        String mail = req.getEmail().trim().toLowerCase();

        // Same person + same event: resume instead of creating duplicates
        for (Registration old : repo.findByEmailAndEventId(mail, event.id())) {
            if (Registration.PAID.equals(old.getPaymentStatus()))
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "This email is already registered for " + event.title() + ". Check your inbox for the ticket.");
            if (Registration.SUBMITTED.equals(old.getPaymentStatus()))
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Your payment for " + event.title() + " is already submitted and is being verified. Your ticket will be emailed once it is approved.");
            // PENDING / REJECTED -> let them continue with the same registration
            old.setFullName(req.getFullName().trim());
            old.setPhone(req.getPhone().trim());
            old.setCollege(req.getCollege().trim());
            old.setDepartment(req.getDepartment().trim());
            old.setYear(req.getYear());
            old.setAmount(event.fee());
            old.setPaymentStatus(Registration.PENDING);
            old.setRejectReason(null);
            old.setUtr(null);
            old.setSubmittedAt(null);
            if (old.getReference() == null) old.setReference(newReference());
            return new RegisterResponse(false, repo.save(old).getReference(), event.fee(), null);
        }

        Registration r = new Registration();
        r.setFullName(req.getFullName().trim());
        r.setEmail(mail);
        r.setPhone(req.getPhone().trim());
        r.setCollege(req.getCollege().trim());
        r.setDepartment(req.getDepartment().trim());
        r.setYear(req.getYear());
        r.setEventId(event.id());
        r.setRegisteredAt(LocalDateTime.now());
        r.setAmount(event.fee());
        r.setReference(newReference());

        if (event.fee() <= 0) { // free event -> direct ticket
            r.setTicketCode(newTicketCode());
            r.setPaymentStatus(Registration.PAID);
            r.setPaidAt(LocalDateTime.now());
            final Registration saved = repo.save(r);
            afterCommit(() -> email.sendWelcomeMail(saved));
            return new RegisterResponse(true, saved.getReference(), 0, saved);
        }

        r.setTicketCode("PENDING-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        r.setPaymentStatus(Registration.PENDING);
        r = repo.save(r);
        return new RegisterResponse(false, r.getReference(), event.fee(), null);
    }

    /** Step 2: participant paid on the QR and types the 12-digit UPI transaction ID. */
    @Transactional
    public StatusResponse submitUtr(String reference, String utr) {
        String clean = utr == null ? "" : utr.replaceAll("\\s", "");
        if (!clean.matches("\\d{12}"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Enter the 12-digit UPI transaction ID (UTR) shown in your GPay payment details.");

        Registration r = repo.findByReferenceForUpdate(reference)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        if (Registration.PAID.equals(r.getPaymentStatus())) return toStatus(r);
        if (Registration.SUBMITTED.equals(r.getPaymentStatus()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment already submitted. Verification is in progress.");
        if (repo.existsByUtr(clean))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This transaction ID has already been used.");

        r.setUtr(clean);
        r.setPaymentStatus(Registration.SUBMITTED);
        r.setSubmittedAt(LocalDateTime.now());
        r.setRejectReason(null);
        try {
            return toStatus(repo.saveAndFlush(r));
        } catch (DataIntegrityViolationException e) { // two people typed the same UTR at once
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This transaction ID has already been used.");
        }
    }

    public StatusResponse status(String reference) {
        return repo.findByReference(reference).map(PaymentService::toStatus)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
    }

    private static StatusResponse toStatus(Registration r) {
        boolean paid = Registration.PAID.equals(r.getPaymentStatus());
        return new StatusResponse(r.getPaymentStatus(), r.getFullName(), r.getEventId(), r.getAmount(),
                paid ? r.getTicketCode() : null, r.getRejectReason());
    }

    // ------------------------------------------------------------------ on-spot (walk-in) registration

    /**
     * Volunteer registers a walk-in at the venue: fee collected in cash / UPI at the desk,
     * ticket is issued right away and the participant is marked present (they are standing there).
     */
    @Transactional
    public Registration registerOnSpot(OnSpotRequest req) {
        EventController.Event event = EventController.findById(req.eventId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid event"));
        String mail = req.email().trim().toLowerCase();

        Registration r = null;
        for (Registration old : repo.findByEmailAndEventId(mail, event.id())) {
            if (Registration.PAID.equals(old.getPaymentStatus()))
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Already registered for " + event.title() + " (ticket " + old.getTicketCode()
                                + "). Scan their ticket to mark attendance instead.");
            r = old; // an unfinished online registration -> complete it at the desk instead of duplicating
        }
        if (r == null) {
            r = new Registration();
            r.setRegisteredAt(LocalDateTime.now());
            r.setReference(newReference());
        } else if (r.getReference() == null) {
            r.setReference(newReference());
        }

        r.setFullName(req.fullName().trim());
        r.setEmail(mail);
        r.setPhone(req.phone().trim());
        r.setCollege(req.college().trim());
        r.setDepartment(req.department().trim());
        r.setYear(req.year().trim());
        r.setEventId(event.id());
        r.setAmount(event.fee());
        r.setTicketCode(newTicketCode());
        r.setPaymentStatus(Registration.PAID);
        r.setRejectReason(null);
        r.setPaidAt(LocalDateTime.now());
        r.setSource(Registration.ONSPOT);
        r.setPaymentMode(event.fee() <= 0 ? "FREE" : "UPI".equalsIgnoreCase(req.paymentMode()) ? "UPI" : "CASH");
        r.setCheckedIn(true);
        r.setCheckedInAt(LocalDateTime.now());

        final Registration saved = repo.save(r);
        afterCommit(() -> email.sendWelcomeMail(saved));
        return saved;
    }

    // ------------------------------------------------------------------ organizer actions

    /** Payment seen in the GPay account -> issue the ticket number and send the welcome mail (once). */
    @Transactional
    public Registration approve(Long id) {
        Registration r = repo.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        if (Registration.PAID.equals(r.getPaymentStatus())) return r; // idempotent, no duplicate mail

        r.setTicketCode(newTicketCode());
        r.setPaymentStatus(Registration.PAID);
        r.setPaidAt(LocalDateTime.now());
        r.setRejectReason(null);
        final Registration saved = repo.save(r);
        afterCommit(() -> email.sendWelcomeMail(saved));
        return saved;
    }

    @Transactional
    public Registration reject(Long id, String reason) {
        Registration r = repo.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        if (Registration.PAID.equals(r.getPaymentStatus()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already approved - cannot reject.");
        String why = (reason == null || reason.isBlank())
                ? "We could not find your payment in our account." : reason.trim();
        if (why.length() > 200) why = why.substring(0, 200);
        r.setPaymentStatus(Registration.REJECTED);
        r.setRejectReason(why);
        final Registration saved = repo.save(r);
        afterCommit(() -> email.sendRejectionMail(saved));
        return saved;
    }

    /** Re-send the welcome mail for an approved registration (e.g. it landed in spam / typo fixed). */
    public void resendMail(Long id) {
        Registration r = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        if (!Registration.PAID.equals(r.getPaymentStatus()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ticket is not issued yet.");
        email.sendWelcomeMail(r);
    }

    public Map<String, Object> adminList(String status) {
        String st = (status == null || status.isBlank()) ? Registration.SUBMITTED : status.toUpperCase();
        List<Registration> rows = switch (st) {
            case Registration.PAID -> repo.findByPaymentStatusOrderByPaidAtDesc(st);
            case Registration.PENDING, Registration.REJECTED -> repo.findByPaymentStatusOrderByRegisteredAtDesc(st);
            case Registration.SUBMITTED -> repo.findByPaymentStatusOrderBySubmittedAtAsc(st);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status");
        };
        Map<String, Long> counts = new LinkedHashMap<>();
        for (String s : List.of(Registration.SUBMITTED, Registration.PAID, Registration.PENDING, Registration.REJECTED))
            counts.put(s, repo.countByPaymentStatus(s));
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("counts", counts);
        out.put("items", rows.stream().map(PaymentService::toRow).toList());
        return out;
    }

    private static AdminRow toRow(Registration r) {
        String title = EventController.findById(r.getEventId()).map(EventController.Event::title).orElse(r.getEventId());
        return new AdminRow(r.getId(), r.getReference(), r.getFullName(), r.getEmail(), r.getPhone(), r.getCollege(),
                r.getDepartment(), r.getYear(), r.getEventId(), title, r.getAmount(), r.getUtr(),
                r.getPaymentStatus(), Registration.PAID.equals(r.getPaymentStatus()) ? r.getTicketCode() : null,
                r.getRegisteredAt(), r.getSubmittedAt(), r.getPaidAt(), r.getRejectReason());
    }

    /** Run after the DB commit (mail must never go out for a rolled-back change). */
    private static void afterCommit(Runnable task) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override public void afterCommit() { task.run(); }
            });
        } else {
            task.run();
        }
    }
}
