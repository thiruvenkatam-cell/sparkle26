package com.sparkle26.attendance;
import com.sparkle26.payment.PaymentService;
import com.sparkle26.events.EventController;
import com.sparkle26.registration.OnSpotRequest;
import com.sparkle26.registration.Registration;
import com.sparkle26.registration.RegistrationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
 private final RegistrationRepository registrations;
 @Value("${VOLUNTEER_API_KEY:}") private String volunteerApiKey;
 private final PaymentService payments;
 public AttendanceController(RegistrationRepository registrations,PaymentService payments){this.registrations=registrations;this.payments=payments;}
 private void authorize(String suppliedKey){
  if(volunteerApiKey==null||volunteerApiKey.isBlank()||suppliedKey==null||!java.security.MessageDigest.isEqual(volunteerApiKey.getBytes(java.nio.charset.StandardCharsets.UTF_8),suppliedKey.getBytes(java.nio.charset.StandardCharsets.UTF_8)))
   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Volunteer authentication required");
 }
 @PostMapping("/check-in")
 public Map<String,Object> checkIn(@RequestHeader(value="X-Volunteer-Key",required=false) String key,@RequestBody CheckInRequest request){
  authorize(key); if(request==null||request.ticketCode()==null||request.ticketCode().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Ticket code is required");
  Registration r=registrations.findByTicketCode(request.ticketCode().trim()).filter(Registration::isPaid).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Invalid ticket"));
  String eventTitle=EventController.findById(r.getEventId()).map(EventController.Event::title).orElse("General registration");
  String eventLevel=EventController.findById(r.getEventId()).map(EventController.Event::level).orElse("");
  if(r.isCheckedIn()) return Map.of("status","ALREADY_CHECKED_IN","message","This ticket was already checked in","fullName",r.getFullName(),"ticketCode",r.getTicketCode(),"checkedInAt",r.getCheckedInAt(),"eventTitle",eventTitle,"eventLevel",eventLevel);
  r.setCheckedIn(true); r.setCheckedInAt(LocalDateTime.now()); registrations.save(r);
  return Map.of("status","CHECKED_IN","message","Attendance marked successfully","fullName",r.getFullName(),"ticketCode",r.getTicketCode(),"checkedInAt",r.getCheckedInAt(),"eventTitle",eventTitle,"eventLevel",eventLevel);
 }
 @GetMapping("/summary")
 public Map<String,Long> summary(@RequestHeader(value="X-Volunteer-Key",required=false) String key){authorize(key);return Map.of("totalRegistrations",registrations.countByPaymentStatus("PAID"),"checkedIn",registrations.countByCheckedInTrue());}
 @PostMapping("/onspot")
 public Registration onSpot(@RequestHeader(value="X-Volunteer-Key",required=false) String key,@Valid @RequestBody OnSpotRequest request){authorize(key);return payments.registerOnSpot(request);}
 @GetMapping("/present")
 public List<PresentParticipant> present(@RequestHeader(value="X-Volunteer-Key",required=false) String key){
  authorize(key); return registrations.findByCheckedInTrueOrderByCheckedInAtDesc().stream().map(r->new PresentParticipant(r.getId(),r.getFullName(),r.getEmail(),r.getCollege(),r.getPhone(),r.getTicketCode(),r.getCheckedInAt(),r.getDepartment(),r.getYear(),EventController.findById(r.getEventId()).map(EventController.Event::title).orElse(""),r.getSource()==null?Registration.ONLINE:r.getSource(),r.getAmount(),r.getPaymentMode())).toList();
 }
 public record PresentParticipant(Long id,String name,String email,String college,String phone,String ticketCode,LocalDateTime checkedInAt,String department,String year,String eventTitle,String source,Integer amount,String paymentMode){}
 public record CheckInRequest(String ticketCode){}
}
