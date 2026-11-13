package com.sparkle26.events;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {
    // Event dates (ISO). Senior day / Junior day.
    private static final String SENIOR_DATE = "2026-11-26";
    private static final String JUNIOR_DATE = "2026-11-27";

    // Registration fees in rupees (0 = free).
    private static final int PAPER_FEE = 200;   // Senior: Paper Presentation
    private static final int SENIOR_FEE = 100;  // Senior: every other event
    private static final int JUNIOR_FEE = 0;    // Junior: free registration

    public record Event(String id, String title, String level, String category, String date, String icon, int fee) {}

    public static Optional<Event> findById(String id) {
        if (id == null) return Optional.empty();
        return EVENTS.stream().filter(e -> e.id().equals(id.trim())).findFirst();
    }

    private static final List<Event> EVENTS = List.of(
        new Event("paper-presentation", "Paper Presentation", "senior", "technical", SENIOR_DATE, "📄", PAPER_FEE),
        new Event("hackathon", "Hackathon", "senior", "technical", SENIOR_DATE, "💻", SENIOR_FEE),
        new Event("prompt-play", "Prompt Play", "senior", "technical", SENIOR_DATE, "🤖", SENIOR_FEE),
        new Event("ui-ux-battle", "UI/UX Battle", "senior", "technical", SENIOR_DATE, "🎨", SENIOR_FEE),
        new Event("tech-buzzle", "Tech Buzzle", "senior", "technical", SENIOR_DATE, "🧩", SENIOR_FEE),
        new Event("start-music", "Start Music", "senior", "non-technical", SENIOR_DATE, "🎵", SENIOR_FEE),
        new Event("screen-quiz", "Screen Quiz", "senior", "non-technical", SENIOR_DATE, "🎬", SENIOR_FEE),
        new Event("adaptune-senior", "Adaptune", "senior", "non-technical", SENIOR_DATE, "🎤", SENIOR_FEE),
        new Event("treasure-hunt", "Treasure Hunt", "senior", "non-technical", SENIOR_DATE, "🔎", SENIOR_FEE),
        new Event("chess", "Chess", "senior", "non-technical", SENIOR_DATE, "♟️", SENIOR_FEE),
        new Event("project-expo", "Project Expo", "junior", "technical", JUNIOR_DATE, "🚀", JUNIOR_FEE),
        new Event("idea-pitch", "Idea Pitch", "junior", "technical", JUNIOR_DATE, "💡", JUNIOR_FEE),
        new Event("quiz", "Quiz", "junior", "technical", JUNIOR_DATE, "🧠", JUNIOR_FEE),
        new Event("adzap", "Adzap", "junior", "non-technical", JUNIOR_DATE, "📣", JUNIOR_FEE),
        new Event("adaptune-junior", "Adaptune", "junior", "non-technical", JUNIOR_DATE, "🎤", JUNIOR_FEE),
        new Event("drawing", "Drawing", "junior", "non-technical", JUNIOR_DATE, "🖌️", JUNIOR_FEE),
        new Event("star-struck", "Star Struck", "junior", "non-technical", JUNIOR_DATE, "⭐", JUNIOR_FEE)
    );

    @GetMapping
    public List<Event> getEvents(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String category) {
        return EVENTS.stream()
                .filter(event -> level == null || event.level().equalsIgnoreCase(level))
                .filter(event -> category == null || event.category().equalsIgnoreCase(category))
                .toList();
    }
}
