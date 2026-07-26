package com.promobridge.api.controller;

import com.promobridge.api.entity.Role;
import com.promobridge.api.entity.User;
import com.promobridge.api.repository.UserRepository;
import com.svix.Webhook;
import com.svix.exceptions.WebhookVerificationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final UserRepository userRepository;

    @Value("${CLERK_WEBHOOK_SECRET:}")
    private String webhookSecret;

    @PostMapping("/clerk")
    public ResponseEntity<String> handleClerkWebhook(HttpServletRequest request) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("Clerk webhook secret is not configured.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook secret not configured.");
        }

        try {
            String payload = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            String svixId = request.getHeader("svix-id");
            String svixTimestamp = request.getHeader("svix-timestamp");
            String svixSignature = request.getHeader("svix-signature");

            if (svixId == null || svixTimestamp == null || svixSignature == null) {
                return ResponseEntity.badRequest().body("Missing svix headers");
            }

            java.util.Map<String, java.util.List<String>> headersMap = new java.util.HashMap<>();
            headersMap.put("svix-id", java.util.List.of(request.getHeader("svix-id")));
            headersMap.put("svix-timestamp", java.util.List.of(request.getHeader("svix-timestamp")));
            headersMap.put("svix-signature", java.util.List.of(request.getHeader("svix-signature")));
            
            java.net.http.HttpHeaders httpHeaders = java.net.http.HttpHeaders.of(headersMap, (k, v) -> true);

            Webhook webhook = new Webhook(webhookSecret);
            webhook.verify(payload, httpHeaders);

            log.info("Successfully received and verified Clerk Webhook.");
            
            // TODO: Parse the payload (e.g. using Jackson) and extract clerk user ID, email.
            // User user = User.builder().id("ext-id").email("user@example.com").role(Role.CREATOR).build();
            // userRepository.save(user);

            return ResponseEntity.ok().build();
            
        } catch (WebhookVerificationException e) {
            log.error("Failed to verify webhook signature", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IOException e) {
            log.error("Failed to read webhook payload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
