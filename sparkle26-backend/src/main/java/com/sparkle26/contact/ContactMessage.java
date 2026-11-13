package com.sparkle26.contact;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="contact_messages")
public class ContactMessage {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=100) private String name;
    @Column(nullable=false,length=150) private String email;
    @Column(nullable=false,length=150) private String subject;
    @Column(nullable=false,length=2000) private String message;
    @Column(nullable=false) private LocalDateTime createdAt;
    public ContactMessage() {}
    public Long getId(){return id;} public void setId(Long v){id=v;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getSubject(){return subject;} public void setSubject(String v){subject=v;}
    public String getMessage(){return message;} public void setMessage(String v){message=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}
