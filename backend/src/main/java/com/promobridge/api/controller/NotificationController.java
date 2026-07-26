package com.promobridge.api.controller;

import com.promobridge.api.dto.NotificationDTO;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationDTO>>> getNotifications(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 20) Pageable pageable,
            HttpServletRequest request) {
        Page<NotificationDTO> notifications = notificationService.getNotificationsForUser(jwt.getSubject(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notifications, "Notifications retrieved", request.getRequestURI()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        long count = notificationService.getUnreadCount(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(Map.of("count", count), "Unread count retrieved", request.getRequestURI()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            HttpServletRequest request) {
        notificationService.markAsRead(id, jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read", request.getRequestURI()));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        notificationService.markAllAsRead(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(null, "All marked as read", request.getRequestURI()));
    }
}
