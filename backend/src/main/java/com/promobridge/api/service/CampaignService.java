package com.promobridge.api.service;

import com.promobridge.api.dto.CampaignDTO;
import com.promobridge.api.entity.BusinessProfile;
import com.promobridge.api.entity.Campaign;
import com.promobridge.api.entity.CampaignStatus;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.mapper.CampaignMapper;
import com.promobridge.api.repository.BusinessProfileRepository;
import com.promobridge.api.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final BusinessProfileRepository businessProfileRepository;
    private final CampaignMapper campaignMapper;

    @Transactional(readOnly = true)
    public Page<CampaignDTO> getCampaignsByBusiness(String userId, Pageable pageable) {
        BusinessProfile businessProfile = getBusinessProfileByUserId(userId);
        return campaignRepository.findByBusinessProfileId(businessProfile.getId(), pageable)
                .map(campaignMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public CampaignDTO getCampaignById(UUID campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        return campaignMapper.toDTO(campaign);
    }

    @Transactional
    public CampaignDTO createCampaign(String userId, CampaignDTO dto) {
        BusinessProfile businessProfile = getBusinessProfileByUserId(userId);

        Campaign campaign = campaignMapper.toEntity(dto);
        campaign.setBusinessProfile(businessProfile);
        
        if (campaign.getStatus() == null) {
            campaign.setStatus(CampaignStatus.DRAFT);
        }

        campaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(campaign);
    }

    @Transactional
    public CampaignDTO updateCampaign(String userId, UUID campaignId, CampaignDTO dto) {
        Campaign campaign = getCampaignByUserIdAndCampaignId(userId, campaignId);
        
        campaignMapper.updateEntityFromDTO(dto, campaign);
        campaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(campaign);
    }

    @Transactional
    public void deleteCampaign(String userId, UUID campaignId) {
        Campaign campaign = getCampaignByUserIdAndCampaignId(userId, campaignId);
        campaign.setIsDeleted(true);
        campaignRepository.save(campaign);
    }

    @Transactional
    public CampaignDTO changeCampaignStatus(String userId, UUID campaignId, CampaignStatus newStatus) {
        Campaign campaign = getCampaignByUserIdAndCampaignId(userId, campaignId);
        campaign.setStatus(newStatus);
        campaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(campaign);
    }

    private BusinessProfile getBusinessProfileByUserId(String userId) {
        return businessProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Business Profile not found for user: " + userId));
    }

    private Campaign getCampaignByUserIdAndCampaignId(String userId, UUID campaignId) {
        BusinessProfile businessProfile = getBusinessProfileByUserId(userId);
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        
        if (!campaign.getBusinessProfile().getId().equals(businessProfile.getId())) {
            throw new IllegalStateException("You are not authorized to modify this campaign");
        }
        return campaign;
    }
}
