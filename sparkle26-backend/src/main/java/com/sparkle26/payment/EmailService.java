package com.sparkle26.payment;

import com.sparkle26.events.EventController;
import com.sparkle26.registration.Registration;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private final String from;
    private final String siteUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username:}") String from,
                        @Value("${app.site-url}") String siteUrl) {
        this.mailSender = mailSender;
        this.from = from;
        // strip trailing "/" so links become https://site/ticket/X, not https://site//ticket/X
        this.siteUrl = siteUrl == null ? "" : siteUrl.trim().replaceAll("/+$", "");
        if (this.siteUrl.contains("localhost")) {
            log.warn("SITE_URL is {} - ticket links in emails will not work for students. Set SITE_URL on Render.", this.siteUrl);
        }
    }

    private String eventTitle(Registration r) {
        return EventController.findById(r.getEventId()).map(EventController.Event::title).orElse("Sparkle 26");
    }

    private void send(String to, String subject, String html, String logId) throws Exception {
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(msg, false, StandardCharsets.UTF_8.name());
        h.setFrom(from, "Sparkle 26");
        h.setTo(to);
        h.setSubject(subject);
        h.setText(html, true);
        mailSender.send(msg);
        log.info("Mail sent: {} -> {}", logId, to);
    }

    /** "Welcome to Sparkle26" + ticket number. Sent only after the organizers approve the payment. */
    @Async
    public void sendWelcomeMail(Registration r) {
        if (from == null || from.isBlank()) {
            log.warn("GMAIL_USER not set, skipping welcome mail: {}", r.getTicketCode());
            return;
        }
        try {
            String title = eventTitle(r);
            String link = siteUrl + "/ticket/" + r.getTicketCode();
            String html = """
                <div style="font-family:Arial,sans-serif;max-width:480px">
                  <h2>Welcome to Sparkle26 🎉</h2>
                  <p>Hi %s, your payment is verified and your registration for SPARKLE'26 is confirmed.</p>
                  <p><b>Event:</b> %s<br/>
                     <b>Ticket number:</b> <span style="font-size:18px;letter-spacing:1px">%s</span></p>
                  <p><a href="%s">View / print your ticket (QR)</a></p>
                  <p style="color:#777;font-size:12px">Please show this ticket QR / number at the venue on event day.</p>
                </div>""".formatted(
                    HtmlUtils.htmlEscape(r.getFullName()), HtmlUtils.htmlEscape(title),
                    r.getTicketCode(), link);
            send(r.getEmail(), "Welcome to Sparkle26 – your ticket " + r.getTicketCode(), html, r.getTicketCode());
        } catch (Exception e) {
            log.error("Welcome mail failed for {}", r.getTicketCode(), e);
        }
    }

    /** Payment could not be matched in the GPay account. */
    @Async
    public void sendRejectionMail(Registration r) {
        if (from == null || from.isBlank()) {
            log.warn("GMAIL_USER not set, skipping rejection mail: {}", r.getReference());
            return;
        }
        try {
            String html = """
                <div style="font-family:Arial,sans-serif;max-width:480px">
                  <h2>Payment not verified</h2>
                  <p>Hi %s, we could not verify your payment for <b>%s</b> (reference <b>%s</b>).</p>
                  <p><b>Reason:</b> %s</p>
                  <p>If you have already paid, please register again with the same email and enter the correct
                     12-digit UPI transaction ID, or contact the organizers.</p>
                  <p><a href="%s/register">Open registration page</a></p>
                </div>""".formatted(
                    HtmlUtils.htmlEscape(r.getFullName()), HtmlUtils.htmlEscape(eventTitle(r)),
                    HtmlUtils.htmlEscape(String.valueOf(r.getReference())),
                    HtmlUtils.htmlEscape(String.valueOf(r.getRejectReason())), siteUrl);
            send(r.getEmail(), "Sparkle26 – payment not verified (" + r.getReference() + ")", html, r.getReference());
        } catch (Exception e) {
            log.error("Rejection mail failed for {}", r.getReference(), e);
        }
    }
}
