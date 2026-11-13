package com.sparkle26.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    @Value("${APP_ALLOWED_ORIGINS:http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Trim spaces and trailing slashes: the browser sends "https://site.com", so a value set on
        // Render as "https://site.com/" or "a.com, b.com" would otherwise never match (403 Invalid CORS request).
        String[] origins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .map(o -> o.replaceAll("/+$", ""))
            .filter(o -> !o.isEmpty())
            .toArray(String[]::new);
        log.info("CORS allowed origins: {}", Arrays.toString(origins));

        registry.addMapping("/api/**")
            .allowedOrigins(origins)
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("Content-Type", "X-Volunteer-Key", "X-Admin-Key")
            .maxAge(3600);
    }
}
