package com.sparkle26.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequest {
    @NotBlank @Size(max=100) private String name;
    @NotBlank @Email @Size(max=150) private String email;
    @NotBlank @Size(max=150) private String subject;
    @NotBlank @Size(max=2000) private String message;
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getSubject(){return subject;} public void setSubject(String v){subject=v;}
    public String getMessage(){return message;} public void setMessage(String v){message=v;}
}
