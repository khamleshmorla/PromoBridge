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
@Table(name = "creator_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CreatorProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String bio;
    
    @Column(name = "instagram_username")
    private String instagramUsername;
    
    @Column(name = "youtube_channel")
    private String youtubeChannel;
    
    private Integer followers;
    
    @Column(name = "average_views")
    private Integer averageViews;
    
    @Column(name = "engagement_rate")
    private BigDecimal engagementRate;
    
    private String location;
    private String city;
    private String state;
    
    @Column(name = "min_collab_amount")
    private BigDecimal minCollabAmount;
    
    @Column(name = "is_verified")
    private Boolean isVerified;
    
    @Column(name = "response_time")
    private String responseTime;
    
    @Column(name = "average_rating")
    private BigDecimal averageRating;
    
    private String availability;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
}