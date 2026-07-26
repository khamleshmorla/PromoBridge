package com.promobridge.api.controller;

import com.promobridge.api.exception.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> health(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("status", "UP", "service", "PromoBridge API"),
                "Service is operational",
                request.getRequestURI()
        ));
    }
}
