package com.promobridge.api.dto;

import com.promobridge.api.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignApplicationDTO {
    private UUID id;
    private UUID campaignId;
    private String campaignTitle;
    private UUID creatorProfileId;
    private String creatorName;
    private String creatorProfileImageUrl;
    private String proposal;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
