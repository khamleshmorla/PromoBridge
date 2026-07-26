package com.promobridge.api.mapper;

import com.promobridge.api.dto.CampaignDTO;
import com.promobridge.api.entity.Campaign;
import org.springframework.stereotype.Component;

@Component
public class CampaignMapper {

    public CampaignDTO toDTO(Campaign entity) {
        if (entity == null) return null;
        CampaignDTO dto = new CampaignDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setBudget(entity.getBudget());
        dto.setCampaignType(entity.getCampaignType());
        dto.setPlatform(entity.getPlatform());
        dto.setLocation(entity.getLocation());
        dto.setIsRemote(entity.getIsRemote());
        dto.setCity(entity.getCity());
        dto.setDeadline(entity.getDeadline());
        dto.setDeliverables(entity.getDeliverables());
        dto.setCreatorCategory(entity.getCreatorCategory());
        dto.setMinFollowers(entity.getMinFollowers());
        dto.setMaxFollowers(entity.getMaxFollowers());
        dto.setMinEngagementRate(entity.getMinEngagementRate());
        dto.setGenderPreference(entity.getGenderPreference());
        dto.setLanguages(entity.getLanguages());
        dto.setSpecialInstructions(entity.getSpecialInstructions());
        dto.setStatus(entity.getStatus());
        if (entity.getBusinessProfile() != null) {
            dto.setBusinessProfileId(entity.getBusinessProfile().getId());
        }
        return dto;
    }

    public Campaign toEntity(CampaignDTO dto) {
        if (dto == null) return null;
        return Campaign.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .budget(dto.getBudget())
                .campaignType(dto.getCampaignType())
                .platform(dto.getPlatform())
                .location(dto.getLocation())
                .isRemote(dto.getIsRemote())
                .city(dto.getCity())
                .deadline(dto.getDeadline())
                .deliverables(dto.getDeliverables())
                .creatorCategory(dto.getCreatorCategory())
                .minFollowers(dto.getMinFollowers())
                .maxFollowers(dto.getMaxFollowers())
                .minEngagementRate(dto.getMinEngagementRate())
                .genderPreference(dto.getGenderPreference())
                .languages(dto.getLanguages())
                .specialInstructions(dto.getSpecialInstructions())
                .status(dto.getStatus())
                .build();
    }

    public void updateEntityFromDTO(CampaignDTO dto, Campaign entity) {
        if (dto == null || entity == null) return;
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setBudget(dto.getBudget());
        entity.setCampaignType(dto.getCampaignType());
        entity.setPlatform(dto.getPlatform());
        entity.setLocation(dto.getLocation());
        entity.setIsRemote(dto.getIsRemote());
        entity.setCity(dto.getCity());
        entity.setDeadline(dto.getDeadline());
        entity.setDeliverables(dto.getDeliverables());
        entity.setCreatorCategory(dto.getCreatorCategory());
        entity.setMinFollowers(dto.getMinFollowers());
        entity.setMaxFollowers(dto.getMaxFollowers());
        entity.setMinEngagementRate(dto.getMinEngagementRate());
        entity.setGenderPreference(dto.getGenderPreference());
        entity.setLanguages(dto.getLanguages());
        entity.setSpecialInstructions(dto.getSpecialInstructions());
        if (dto.getStatus() != null) {
            entity.setStatus(dto.getStatus());
        }
    }
}
