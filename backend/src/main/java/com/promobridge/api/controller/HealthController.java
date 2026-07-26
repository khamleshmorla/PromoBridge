package com.promobridge.api.controller;

import com.promobridge.api.exception.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/api/public/health"})
    public ResponseEntity<ApiResponse<Map<String, Object>>> health(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of(
                        "status", "UP",
                        "service", "PromoBridge API",
                        "version", "1.0.0",
                        "message", "PromoBridge Backend API is online and operational."
                ),
                "Service is operational",
                request.getRequestURI()
        ));
    }
}
