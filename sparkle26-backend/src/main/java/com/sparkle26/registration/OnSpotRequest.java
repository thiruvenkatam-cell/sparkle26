package com.sparkle26.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Walk-in registration entered by a volunteer at the venue desk. */
public record OnSpotRequest(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Pattern(regexp = "[0-9+() -]{8,20}") String phone,
        @NotBlank @Size(max = 150) String college,
        @NotBlank @Size(max = 100) String department,
        @NotBlank @Size(max = 30) String year,
        @NotBlank @Size(max = 80) String eventId,
        @Size(max = 10) String paymentMode) {}
