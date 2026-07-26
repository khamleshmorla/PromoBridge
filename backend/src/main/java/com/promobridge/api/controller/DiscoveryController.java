package com.promobridge.api.controller;

import com.promobridge.api.dto.CampaignDTO;
import com.promobridge.api.dto.CreatorProfileDTO;
import com.promobridge.api.entity.CampaignStatus;
import com.promobridge.api.exception.ApiResponse;
import com.promobridge.api.mapper.CampaignMapper;
import com.promobridge.api.mapper.ProfileMapper;
import com.promobridge.api.repository.CampaignRepository;
import com.promobridge.api.repository.CreatorProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DiscoveryController {

    private final CampaignRepository campaignRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final CampaignMapper campaignMapper;
    private final ProfileMapper profileMapper;

    @GetMapping({"/discovery/campaigns", "/public/campaigns"})
    public ResponseEntity<ApiResponse<Page<CampaignDTO>>> discoverCampaigns(
            @PageableDefault(size = 12) Pageable pageable,
            HttpServletRequest request) {
        Page<CampaignDTO> campaigns = campaignRepository.findActiveCampaigns(CampaignStatus.ACTIVE, pageable)
                .map(campaignMapper::toDTO);
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Campaigns discovered", request.getRequestURI()));
    }

    @GetMapping({"/discovery/creators", "/public/creators"})
    public ResponseEntity<ApiResponse<Page<CreatorProfileDTO>>> discoverCreators(
            @PageableDefault(size = 12) Pageable pageable,
            HttpServletRequest request) {
        Page<CreatorProfileDTO> creators = creatorProfileRepository.findAll(pageable)
                .map(profileMapper::toCreatorProfileDTO);
        return ResponseEntity.ok(ApiResponse.success(creators, "Creators discovered", request.getRequestURI()));
    }
}
