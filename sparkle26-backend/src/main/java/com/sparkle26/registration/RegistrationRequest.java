package com.sparkle26.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegistrationRequest {
    @NotBlank @Size(min=2, max=100) private String fullName;
    @NotBlank @Email @Size(max=150) private String email;
    @NotBlank @Pattern(regexp="[0-9+() -]{8,20}") private String phone;
    @NotBlank @Size(max=150) private String college;
    @NotBlank @Size(max=100) private String department;
    @NotBlank @Size(max=30) private String year;
    @Size(max=80) private String eventId;

    public String getFullName(){return fullName;} public void setFullName(String v){this.fullName=v;}
    public String getEmail(){return email;} public void setEmail(String v){this.email=v;}
    public String getPhone(){return phone;} public void setPhone(String v){this.phone=v;}
    public String getCollege(){return college;} public void setCollege(String v){this.college=v;}
    public String getDepartment(){return department;} public void setDepartment(String v){this.department=v;}
    public String getYear(){return year;} public void setYear(String v){this.year=v;}
    public String getEventId(){return eventId;} public void setEventId(String v){this.eventId=v;}
}
