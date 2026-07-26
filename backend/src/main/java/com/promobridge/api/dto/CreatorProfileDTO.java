package com.promobridge.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorProfileDTO {

    private UUID id;

    @NotBlank(message = "Name is required")
    private String name;

    private String bio;
    private String profileImageUrl;
    
    private String instagramUsername;
    private String youtubeChannel;
    
    private Integer followers;
    private BigDecimal engagementRate;
    private Integer averageViews;
    
    private String city;
    private String state;
    private String location; // Display string like "Mumbai, India"
    
    private BigDecimal minCollabAmount;
    private String availability; // FULL_TIME, PART_TIME, WEEKENDS
    private String responseTime;
    
    private boolean isVerified;
    private BigDecimal averageRating;
    
    private String userId; // Reference to the Clerk user
}
