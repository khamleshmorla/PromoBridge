package com.promobridge.api.mapper;

import com.promobridge.api.dto.BusinessProfileDTO;
import com.promobridge.api.dto.CreatorProfileDTO;
import com.promobridge.api.entity.BusinessProfile;
import com.promobridge.api.entity.CreatorProfile;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public BusinessProfileDTO toBusinessProfileDTO(BusinessProfile businessProfile) {
        if (businessProfile == null) return null;
        BusinessProfileDTO dto = new BusinessProfileDTO();
        dto.setId(businessProfile.getId());
        dto.setBusinessName(businessProfile.getBusinessName());
        dto.setCategory(businessProfile.getCategory());
        dto.setWebsite(businessProfile.getWebsite());
        dto.setLogoUrl(businessProfile.getLogoUrl());
        dto.setDescription(businessProfile.getDescription());
        dto.setVerified(businessProfile.getIsVerified() != null && businessProfile.getIsVerified());
        if (businessProfile.getUser() != null) dto.setUserId(businessProfile.getUser().getId());
        return dto;
    }

    public BusinessProfile toBusinessProfileEntity(BusinessProfileDTO dto) {
        if (dto == null) return null;
        return BusinessProfile.builder()
                .businessName(dto.getBusinessName())
                .category(dto.getCategory())
                .website(dto.getWebsite())
                .logoUrl(dto.getLogoUrl())
                .description(dto.getDescription())
                .build();
    }

    public void updateBusinessProfileFromDTO(BusinessProfileDTO dto, BusinessProfile entity) {
        if (dto == null || entity == null) return;
        entity.setBusinessName(dto.getBusinessName());
        entity.setCategory(dto.getCategory());
        entity.setWebsite(dto.getWebsite());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setDescription(dto.getDescription());
    }

    public CreatorProfileDTO toCreatorProfileDTO(CreatorProfile creatorProfile) {
        if (creatorProfile == null) return null;
        CreatorProfileDTO dto = new CreatorProfileDTO();
        dto.setId(creatorProfile.getId());
        dto.setName(creatorProfile.getName());
        dto.setBio(creatorProfile.getBio());
        dto.setProfileImageUrl(creatorProfile.getProfileImageUrl());
        dto.setInstagramUsername(creatorProfile.getInstagramUsername());
        dto.setYoutubeChannel(creatorProfile.getYoutubeChannel());
        dto.setFollowers(creatorProfile.getFollowers());
        dto.setEngagementRate(creatorProfile.getEngagementRate());
        dto.setAverageViews(creatorProfile.getAverageViews());
        dto.setCity(creatorProfile.getCity());
        dto.setState(creatorProfile.getState());
        dto.setLocation(creatorProfile.getLocation());
        dto.setMinCollabAmount(creatorProfile.getMinCollabAmount());
        dto.setAvailability(creatorProfile.getAvailability());
        dto.setResponseTime(creatorProfile.getResponseTime());
        dto.setVerified(creatorProfile.getIsVerified() != null && creatorProfile.getIsVerified());
        dto.setAverageRating(creatorProfile.getAverageRating());
        if (creatorProfile.getUser() != null) dto.setUserId(creatorProfile.getUser().getId());
        return dto;
    }

    public CreatorProfile toCreatorProfileEntity(CreatorProfileDTO dto) {
        if (dto == null) return null;
        return CreatorProfile.builder()
                .name(dto.getName())
                .bio(dto.getBio())
                .profileImageUrl(dto.getProfileImageUrl())
                .instagramUsername(dto.getInstagramUsername())
                .youtubeChannel(dto.getYoutubeChannel())
                .followers(dto.getFollowers())
                .engagementRate(dto.getEngagementRate())
                .averageViews(dto.getAverageViews())
                .city(dto.getCity())
                .state(dto.getState())
                .location(dto.getLocation())
                .minCollabAmount(dto.getMinCollabAmount())
                .availability(dto.getAvailability())
                .responseTime(dto.getResponseTime())
                .build();
    }

    public void updateCreatorProfileFromDTO(CreatorProfileDTO dto, CreatorProfile entity) {
        if (dto == null || entity == null) return;
        entity.setName(dto.getName());
        entity.setBio(dto.getBio());
        entity.setProfileImageUrl(dto.getProfileImageUrl());
        entity.setInstagramUsername(dto.getInstagramUsername());
        entity.setYoutubeChannel(dto.getYoutubeChannel());
        entity.setFollowers(dto.getFollowers());
        entity.setEngagementRate(dto.getEngagementRate());
        entity.setAverageViews(dto.getAverageViews());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setLocation(dto.getLocation());
        entity.setMinCollabAmount(dto.getMinCollabAmount());
        entity.setAvailability(dto.getAvailability());
        entity.setResponseTime(dto.getResponseTime());
    }
}
