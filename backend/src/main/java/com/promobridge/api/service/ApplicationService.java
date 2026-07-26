package com.promobridge.api.service;

import com.promobridge.api.dto.CampaignApplicationDTO;
import com.promobridge.api.entity.*;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final CampaignApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public CampaignApplicationDTO applyToCampaign(String userId, UUID campaignId, String proposal) {
        CreatorProfile creatorProfile = creatorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Creator Profile not found"));

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));

        if (campaign.getStatus() != CampaignStatus.ACTIVE) {
            throw new IllegalStateException("Campaign is not accepting applications");
        }

        boolean alreadyApplied = applicationRepository.existsByCampaignIdAndCreatorProfileId(campaignId, creatorProfile.getId());
        if (alreadyApplied) {
            throw new IllegalStateException("You have already applied to this campaign");
        }

        CampaignApplication application = CampaignApplication.builder()
                .campaign(campaign)
                .creatorProfile(creatorProfile)
                .proposal(proposal)
                .status(ApplicationStatus.APPLIED)
                .build();

        application = applicationRepository.save(application);

        // Notify business
        String businessUserId = campaign.getBusinessProfile().getUser().getId();
        notificationService.createNotification(businessUserId, "New Application", 
            creatorProfile.getName() + " has applied to your campaign: " + campaign.getTitle(),
            "APPLICATION", application.getId());

        return toDTO(application);
    }

    @Transactional(readOnly = true)
    public Page<CampaignApplicationDTO> getApplicationsForCampaign(String userId, UUID campaignId, Pageable pageable) {
        BusinessProfile businessProfile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found"));

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));

        if (!campaign.getBusinessProfile().getId().equals(businessProfile.getId())) {
            throw new IllegalStateException("Not authorized to view these applications");
        }

        return applicationRepository.findByCampaignId(campaignId, pageable).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<CampaignApplicationDTO> getMyApplications(String userId, Pageable pageable) {
        CreatorProfile creatorProfile = creatorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Creator Profile not found"));
        return applicationRepository.findByCreatorProfileId(creatorProfile.getId(), pageable).map(this::toDTO);
    }

    @Transactional
    public CampaignApplicationDTO updateApplicationStatus(String userId, UUID applicationId, ApplicationStatus newStatus) {
        BusinessProfile businessProfile = businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found"));

        CampaignApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        if (!application.getCampaign().getBusinessProfile().getId().equals(businessProfile.getId())) {
            throw new IllegalStateException("Not authorized to update this application");
        }

        application.setStatus(newStatus);
        application = applicationRepository.save(application);

        // Notify creator
        String creatorUserId = application.getCreatorProfile().getUser().getId();
        String statusMessage = newStatus == ApplicationStatus.ACCEPTED ? "accepted" : "rejected";
        notificationService.createNotification(creatorUserId, "Application Update",
            "Your application for '" + application.getCampaign().getTitle() + "' has been " + statusMessage,
            "APPLICATION_" + newStatus.name(), application.getId());

        return toDTO(application);
    }

    private CampaignApplicationDTO toDTO(CampaignApplication app) {
        return CampaignApplicationDTO.builder()
                .id(app.getId())
                .campaignId(app.getCampaign().getId())
                .campaignTitle(app.getCampaign().getTitle())
                .creatorProfileId(app.getCreatorProfile().getId())
                .creatorName(app.getCreatorProfile().getName())
                .creatorProfileImageUrl(app.getCreatorProfile().getProfileImageUrl())
                .proposal(app.getProposal())
                .status(app.getStatus())
                .appliedAt(app.getCreatedAt())
                .build();
    }
}
