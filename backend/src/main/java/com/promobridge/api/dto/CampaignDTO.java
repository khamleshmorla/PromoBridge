package com.promobridge.api.dto;

import com.promobridge.api.entity.CampaignStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignDTO {

    private UUID id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Budget is required")
    private BigDecimal budget;

    private String campaignType;
    private String platform;
    private String location;
    
    private Boolean isRemote;
    private String city;
    private LocalDateTime deadline;
    private String deliverables;
    
    private String creatorCategory;
    private Integer minFollowers;
    private Integer maxFollowers;
    private BigDecimal minEngagementRate;
    private String genderPreference;
    private String languages;
    private String specialInstructions;
    
    private CampaignStatus status;
    private UUID businessProfileId;
}
