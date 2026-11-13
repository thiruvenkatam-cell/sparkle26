package com.sparkle26.registration;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", indexes = {
        @Index(name = "idx_ticket_code", columnList = "ticketCode", unique = true),
        @Index(name = "idx_reference", columnList = "reference", unique = true),
        @Index(name = "idx_utr", columnList = "utr", unique = true)
})
public class Registration {
    /** Registered, QR payment not yet reported by the participant. */
    public static final String PENDING = "PENDING";
    /** Participant reported the UPI reference (UTR); organizers must check the GPay account. */
    public static final String SUBMITTED = "SUBMITTED";
    /** Organizer verified the payment -> ticket issued. (Also used for free events.) */
    public static final String PAID = "PAID";
    /** Organizer could not find the payment. */
    public static final String REJECTED = "REJECTED";

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100) private String fullName;
    @Column(nullable = false, length = 150) private String email;
    @Column(nullable = false, length = 20) private String phone;
    @Column(nullable = false, length = 150) private String college;
    @Column(nullable = false, length = 100) private String department;
    @Column(nullable = false, length = 30) private String year;
    @Column(length = 80) private String eventId;
    /** Real ticket number (SPK26-...) exists only after approval; before that it is an internal placeholder. */
    @Column(nullable = false, unique = true, length = 40) private String ticketCode;
    @Column(nullable = false) private LocalDateTime registeredAt;
    @Column(nullable = false) private boolean checkedIn = false;
    private LocalDateTime checkedInAt;

    // ---- payment (GPay / UPI QR, verified manually) ----
    // existing rows get default PAID
    @Column(length = 20, columnDefinition = "varchar(20) default 'PAID'")
    private String paymentStatus = PAID;
    /** Public id the participant uses to track the registration (never the ticket number). */
    @Column(length = 30) private String reference;
    /** UPI transaction reference (12 digits) typed in by the participant. */
    @Column(length = 30) private String utr;
    private Integer amount; // rupees
    private LocalDateTime submittedAt;
    private LocalDateTime paidAt; // = approval time
    @Column(length = 200) private String rejectReason;

    // ---- how the registration happened ----
    /** ONLINE (website + GPay QR) or ONSPOT (registered at the venue desk). Old rows = ONLINE. */
    public static final String ONLINE = "ONLINE";
    public static final String ONSPOT = "ONSPOT";
    @Column(length = 10, columnDefinition = "varchar(10) default 'ONLINE'")
    private String source = ONLINE;
    /** On-spot only: CASH / UPI / FREE */
    @Column(length = 10) private String paymentMode;

    public Registration() {}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getFullName(){return fullName;} public void setFullName(String v){this.fullName=v;}
    public String getEmail(){return email;} public void setEmail(String v){this.email=v;}
    public String getPhone(){return phone;} public void setPhone(String v){this.phone=v;}
    public String getCollege(){return college;} public void setCollege(String v){this.college=v;}
    public String getDepartment(){return department;} public void setDepartment(String v){this.department=v;}
    public String getYear(){return year;} public void setYear(String v){this.year=v;}
    public String getEventId(){return eventId;} public void setEventId(String v){this.eventId=v;}
    public String getTicketCode(){return ticketCode;} public void setTicketCode(String v){this.ticketCode=v;}
    public LocalDateTime getRegisteredAt(){return registeredAt;} public void setRegisteredAt(LocalDateTime v){this.registeredAt=v;}
    public boolean isCheckedIn(){return checkedIn;} public void setCheckedIn(boolean v){this.checkedIn=v;}
    public LocalDateTime getCheckedInAt(){return checkedInAt;} public void setCheckedInAt(LocalDateTime v){this.checkedInAt=v;}

    public String getPaymentStatus(){return paymentStatus;} public void setPaymentStatus(String v){this.paymentStatus=v;}
    public String getReference(){return reference;} public void setReference(String v){this.reference=v;}
    @JsonIgnore public String getUtr(){return utr;} public void setUtr(String v){this.utr=v;}
    public Integer getAmount(){return amount;} public void setAmount(Integer v){this.amount=v;}
    public LocalDateTime getSubmittedAt(){return submittedAt;} public void setSubmittedAt(LocalDateTime v){this.submittedAt=v;}
    public LocalDateTime getPaidAt(){return paidAt;} public void setPaidAt(LocalDateTime v){this.paidAt=v;}
    public String getRejectReason(){return rejectReason;} public void setRejectReason(String v){this.rejectReason=v;}
    public String getSource(){return source;} public void setSource(String v){this.source=v;}
    public String getPaymentMode(){return paymentMode;} public void setPaymentMode(String v){this.paymentMode=v;}
    @JsonIgnore public boolean isPaid(){return paymentStatus == null || PAID.equals(paymentStatus);}
}
