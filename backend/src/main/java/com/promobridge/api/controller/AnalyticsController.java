package com.promobridge.api.controller;

import com.promobridge.api.dto.AnalyticsDTO;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.AnalyticsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/business")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getBusinessAnalytics(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        AnalyticsDTO analytics = analyticsService.getBusinessAnalytics(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(analytics, "Business analytics retrieved", request.getRequestURI()));
    }

    @GetMapping("/creator")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getCreatorAnalytics(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request) {
        AnalyticsDTO analytics = analyticsService.getCreatorAnalytics(jwt.getSubject());
        return ResponseEntity.ok(ApiResponse.success(analytics, "Creator analytics retrieved", request.getRequestURI()));
    }
}
