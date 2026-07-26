import os

base_pkg = "package com.promobridge.api.entity;\n\n"
imports = """import jakarta.persistence.*;
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

"""

base_entity = base_pkg + imports + """@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Version
    @Column(name = "version")
    private Integer version;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isDeleted == null) {
            isDeleted = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
"""

entities = {
    "BusinessProfile": """@Entity
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
    
    @OneToMany(mappedBy = "businessProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Campaign> campaigns = new ArrayList<>();
}""",
    
    "CreatorProfile": """@Entity
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
}""",

    "Campaign": """@Entity
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
}""",

    "CampaignStatus": """public enum CampaignStatus {
    DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED
}""",
    
    "CampaignApplication": """@Entity
@Table(name = "campaign_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CampaignApplication extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private CreatorProfile creatorProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private String message;
    
    @Column(name = "proposed_rate")
    private BigDecimal proposedRate;
    
    @Column(name = "ai_match_score")
    private Integer aiMatchScore;
}""",

    "ApplicationStatus": """public enum ApplicationStatus {
    APPLIED, SHORTLISTED, ACCEPTED, REJECTED, COMPLETED
}""",

    "Conversation": """@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Conversation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private CampaignApplication application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private BusinessProfile businessProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private CreatorProfile creatorProfile;
}""",

    "Message": """@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    private String content;
    
    @Column(name = "message_type")
    private String messageType;
    
    @Column(name = "file_url")
    private String fileUrl;
}""",

    "Review": """@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Review extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @Column(nullable = false)
    private Integer rating;

    private String comment;
}""",

    "Notification": """@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(name = "reference_id")
    private UUID referenceId;

    @Column(name = "is_read")
    private Boolean isRead;
}"""
}

def generate():
    path = "src/main/java/com/promobridge/api/entity"
    os.makedirs(path, exist_ok=True)
    
    with open(f"{path}/BaseEntity.java", "w") as f:
        f.write(base_entity)
        
    for name, content in entities.items():
        with open(f"{path}/{name}.java", "w") as f:
            if name.endswith("Status"):
                f.write(base_pkg + content)
            else:
                f.write(base_pkg + imports + content)
                
    # Update User.java to extend BaseEntity or fix it
    user_file = f"{path}/User.java"
    if os.path.exists(user_file):
        with open(user_file, "r") as f:
            user_content = f.read()
        # Ensure it has correct structure, or just let it be string ID for Clerk
        # Note: Clerk ID is a String, so it shouldn't extend BaseEntity because BaseEntity has UUID id
        # We will keep User.java as is, since it has a String ID.

if __name__ == "__main__":
    generate()
    print("Entities generated successfully.")
