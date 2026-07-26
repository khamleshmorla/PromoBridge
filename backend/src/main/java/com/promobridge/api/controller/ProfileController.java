package com.promobridge.api.controller;

import com.promobridge.api.dto.BusinessProfileDTO;
import com.promobridge.api.dto.CreatorProfileDTO;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.BusinessProfileService;
import com.promobridge.api.service.CreatorProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final BusinessProfileService businessProfileService;
    private final CreatorProfileService creatorProfileService;

    // --- Business Profiles ---

    @GetMapping("/business")
    public ResponseEntity<ApiResponse<BusinessProfileDTO>> getMyBusinessProfile(@AuthenticationPrincipal Jwt jwt, HttpServletRequest request) {
        String userId = jwt.getSubject();
        BusinessProfileDTO profile = businessProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Business profile retrieved successfully", request.getRequestURI()));
    }

    @PostMapping("/business")
    public ResponseEntity<ApiResponse<BusinessProfileDTO>> createBusinessProfile(@AuthenticationPrincipal Jwt jwt,
                                                                                 @Valid @RequestBody BusinessProfileDTO dto,
                                                                                 HttpServletRequest request) {
        String userId = jwt.getSubject();
        BusinessProfileDTO profile = businessProfileService.createProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(profile, "Business profile created successfully", request.getRequestURI()));
    }

    @PutMapping("/business")
    public ResponseEntity<ApiResponse<BusinessProfileDTO>> updateBusinessProfile(@AuthenticationPrincipal Jwt jwt,
                                                                                 @Valid @RequestBody BusinessProfileDTO dto,
                                                                                 HttpServletRequest request) {
        String userId = jwt.getSubject();
        BusinessProfileDTO profile = businessProfileService.updateProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(profile, "Business profile updated successfully", request.getRequestURI()));
    }

    // --- Creator Profiles ---

    @GetMapping("/creator")
    public ResponseEntity<ApiResponse<CreatorProfileDTO>> getMyCreatorProfile(@AuthenticationPrincipal Jwt jwt, HttpServletRequest request) {
        String userId = jwt.getSubject();
        CreatorProfileDTO profile = creatorProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Creator profile retrieved successfully", request.getRequestURI()));
    }

    @PostMapping("/creator")
    public ResponseEntity<ApiResponse<CreatorProfileDTO>> createCreatorProfile(@AuthenticationPrincipal Jwt jwt,
                                                                               @Valid @RequestBody CreatorProfileDTO dto,
                                                                               HttpServletRequest request) {
        String userId = jwt.getSubject();
        CreatorProfileDTO profile = creatorProfileService.createProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(profile, "Creator profile created successfully", request.getRequestURI()));
    }

    @PutMapping("/creator")
    public ResponseEntity<ApiResponse<CreatorProfileDTO>> updateCreatorProfile(@AuthenticationPrincipal Jwt jwt,
                                                                               @Valid @RequestBody CreatorProfileDTO dto,
                                                                               HttpServletRequest request) {
        String userId = jwt.getSubject();
        CreatorProfileDTO profile = creatorProfileService.updateProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(profile, "Creator profile updated successfully", request.getRequestURI()));
    }
}
