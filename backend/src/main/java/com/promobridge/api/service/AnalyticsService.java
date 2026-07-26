package com.promobridge.api.service;

import com.promobridge.api.dto.AnalyticsDTO;
import com.promobridge.api.entity.CampaignStatus;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BusinessProfileRepository businessProfileRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final CampaignRepository campaignRepository;
    private final CampaignApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public AnalyticsDTO getBusinessAnalytics(String userId) {
        var businessProfile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found"));

        long totalCampaigns = campaignRepository.countByBusinessProfileId(businessProfile.getId());
        long activeCampaigns = campaignRepository.countByBusinessProfileIdAndStatus(businessProfile.getId(), CampaignStatus.ACTIVE);
        long totalReceived = applicationRepository.countByBusinessProfileId(businessProfile.getId());
        long accepted = applicationRepository.countByBusinessProfileIdAndStatus(businessProfile.getId(), "ACCEPTED");

        double acceptanceRate = totalReceived > 0 ? (double) accepted / totalReceived * 100.0 : 0.0;

        Map<String, Long> campaignsByStatus = new HashMap<>();
        for (CampaignStatus status : CampaignStatus.values()) {
            long count = campaignRepository.countByBusinessProfileIdAndStatus(businessProfile.getId(), status);
            campaignsByStatus.put(status.name(), count);
        }

        return AnalyticsDTO.builder()
                .totalCampaigns(totalCampaigns)
                .activeCampaigns(activeCampaigns)
                .totalApplicationsReceived(totalReceived)
                .acceptedApplications(accepted)
                .applicationAcceptanceRate(acceptanceRate)
                .campaignsByStatus(campaignsByStatus)
                .build();
    }

    @Transactional(readOnly = true)
    public AnalyticsDTO getCreatorAnalytics(String userId) {
        var creatorProfile = creatorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Creator Profile not found"));

        long totalSent = applicationRepository.countByCreatorProfileId(creatorProfile.getId());
        long totalAccepted = applicationRepository.countByCreatorProfileIdAndStatus(creatorProfile.getId(), "ACCEPTED");
        double successRate = totalSent > 0 ? (double) totalAccepted / totalSent * 100.0 : 0.0;

        return AnalyticsDTO.builder()
                .totalApplicationsSent(totalSent)
                .totalAcceptedApplications(totalAccepted)
                .successRate(successRate)
                .build();
    }
}
