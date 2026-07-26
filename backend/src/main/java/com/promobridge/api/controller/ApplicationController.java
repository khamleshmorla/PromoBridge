package com.promobridge.api.controller;

import com.promobridge.api.dto.CampaignApplicationDTO;
import com.promobridge.api.entity.ApplicationStatus;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.ApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/campaigns/{campaignId}")
    public ResponseEntity<ApiResponse<CampaignApplicationDTO>> apply(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID campaignId,
            @RequestParam(required = false) String proposal,
            HttpServletRequest request) {
        CampaignApplicationDTO dto = applicationService.applyToCampaign(jwt.getSubject(), campaignId, proposal);
        return ResponseEntity.ok(ApiResponse.success(dto, "Applied successfully", request.getRequestURI()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<CampaignApplicationDTO>>> myApplications(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10) Pageable pageable,
            HttpServletRequest request) {
        Page<CampaignApplicationDTO> apps = applicationService.getMyApplications(jwt.getSubject(), pageable);
        return ResponseEntity.ok(ApiResponse.success(apps, "Applications retrieved", request.getRequestURI()));
    }

    @GetMapping("/campaigns/{campaignId}")
    public ResponseEntity<ApiResponse<Page<CampaignApplicationDTO>>> campaignApplications(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID campaignId,
            @PageableDefault(size = 10) Pageable pageable,
            HttpServletRequest request) {
        Page<CampaignApplicationDTO> apps = applicationService.getApplicationsForCampaign(jwt.getSubject(), campaignId, pageable);
        return ResponseEntity.ok(ApiResponse.success(apps, "Applications retrieved", request.getRequestURI()));
    }

    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<CampaignApplicationDTO>> updateStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID applicationId,
            @RequestParam ApplicationStatus status,
            HttpServletRequest request) {
        CampaignApplicationDTO dto = applicationService.updateApplicationStatus(jwt.getSubject(), applicationId, status);
        return ResponseEntity.ok(ApiResponse.success(dto, "Status updated", request.getRequestURI()));
    }
}
