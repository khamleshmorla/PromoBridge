package com.promobridge.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Campaign extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private BusinessProfile businessProfile;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    private BigDecimal budget;
    
    @Column(name = "campaign_type")
    private String campaignType;
    
    private String platform;
    private String location;
    
    @Column(name = "is_remote")
    private Boolean isRemote;
    
    private String city;
    private LocalDateTime deadline;
    private String deliverables;
    
    @Column(name = "creator_category")
    private String creatorCategory;
    
    @Column(name = "min_followers")
    private Integer minFollowers;
    
    @Column(name = "max_followers")
    private Integer maxFollowers;
    
    @Column(name = "min_engagement_rate")
    private BigDecimal minEngagementRate;
    
    @Column(name = "gender_preference")
    private String genderPreference;
    
    private String languages;
    
    @Column(name = "special_instructions")
    private String specialInstructions;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;
}