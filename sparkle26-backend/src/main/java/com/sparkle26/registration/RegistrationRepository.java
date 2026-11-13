package com.sparkle26.registration;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByTicketCode(String ticketCode);
    Optional<Registration> findByReference(String reference);
    boolean existsByUtr(String utr);
    List<Registration> findByEmailAndEventId(String email, String eventId);
    long countByCheckedInTrue();
    long countByPaymentStatus(String paymentStatus);
    List<Registration> findByCheckedInTrueOrderByCheckedInAtDesc();
    List<Registration> findByPaymentStatusOrderBySubmittedAtAsc(String paymentStatus);
    List<Registration> findByPaymentStatusOrderByPaidAtDesc(String paymentStatus);
    List<Registration> findByPaymentStatusOrderByRegisteredAtDesc(String paymentStatus);

    // two organizers clicking Approve together must not send two mails -> row lock
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Registration r where r.id = :id")
    Optional<Registration> findByIdForUpdate(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Registration r where r.reference = :reference")
    Optional<Registration> findByReferenceForUpdate(@Param("reference") String reference);
}
