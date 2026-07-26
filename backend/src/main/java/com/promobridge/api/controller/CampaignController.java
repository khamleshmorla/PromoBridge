package com.promobridge.api.controller;

import com.promobridge.api.dto.CampaignDTO;
import com.promobridge.api.entity.CampaignStatus;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.service.CampaignService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<CampaignDTO>>> getMyCampaigns(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10) Pageable pageable,
            HttpServletRequest request) {
        String userId = jwt.getSubject();
        Page<CampaignDTO> campaigns = campaignService.getCampaignsByBusiness(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Campaigns retrieved", request.getRequestURI()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDTO>> getCampaign(@PathVariable UUID id, HttpServletRequest request) {
        CampaignDTO campaign = campaignService.getCampaignById(id);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign retrieved", request.getRequestURI()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignDTO>> createCampaign(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CampaignDTO dto,
            HttpServletRequest request) {
        String userId = jwt.getSubject();
        CampaignDTO campaign = campaignService.createCampaign(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign created", request.getRequestURI()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignDTO>> updateCampaign(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody CampaignDTO dto,
            HttpServletRequest request) {
        String userId = jwt.getSubject();
        CampaignDTO campaign = campaignService.updateCampaign(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign updated", request.getRequestURI()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            HttpServletRequest request) {
        String userId = jwt.getSubject();
        campaignService.deleteCampaign(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Campaign deleted", request.getRequestURI()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CampaignDTO>> updateStatus(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestParam CampaignStatus status,
            HttpServletRequest request) {
        String userId = jwt.getSubject();
        CampaignDTO campaign = campaignService.changeCampaignStatus(userId, id, status);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign status updated", request.getRequestURI()));
    }
}
