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
@Table(name = "business_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BusinessProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "owner_name")
    private String ownerName;

    private String category;
    private String description;
    private String website;
    private String instagram;
    private String facebook;
    private String youtube;
    private String location;
    private String city;
    private String state;
    private String country;
    private String gst;
    
    @Column(name = "is_verified")
    private Boolean isVerified;
    
    @Column(name = "average_rating")
    private BigDecimal averageRating;
    
    @Column(name = "campaign_count")
    private Integer campaignCount;
    
    @Column(name = "completed_collaborations")
    private Integer completedCollaborations;
    
    @Column(name = "response_rate")
    private BigDecimal responseRate;
    
    @Column(name = "preferred_language")
    private String preferredLanguage;
    
    @Column(name = "business_size")
    private String businessSize;
    
    @Column(name = "budget_range")
    private String budgetRange;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Builder.Default
    @OneToMany(mappedBy = "businessProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Campaign> campaigns = new ArrayList<>();
}