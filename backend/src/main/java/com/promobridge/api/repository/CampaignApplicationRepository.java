package com.promobridge.api.repository;

import com.promobridge.api.entity.CampaignApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CampaignApplicationRepository extends JpaRepository<CampaignApplication, UUID> {
    Page<CampaignApplication> findByCampaignId(UUID campaignId, Pageable pageable);
    Page<CampaignApplication> findByCreatorProfileId(UUID creatorProfileId, Pageable pageable);
    boolean existsByCampaignIdAndCreatorProfileId(UUID campaignId, UUID creatorProfileId);

    @Query("SELECT COUNT(a) FROM CampaignApplication a WHERE a.campaign.businessProfile.id = :businessProfileId")
    long countByBusinessProfileId(@Param("businessProfileId") UUID businessProfileId);

    @Query("SELECT COUNT(a) FROM CampaignApplication a WHERE a.campaign.businessProfile.id = :businessProfileId AND CAST(a.status AS string) = :status")
    long countByBusinessProfileIdAndStatus(@Param("businessProfileId") UUID businessProfileId, @Param("status") String status);

    @Query("SELECT COUNT(a) FROM CampaignApplication a WHERE a.creatorProfile.id = :creatorProfileId")
    long countByCreatorProfileId(@Param("creatorProfileId") UUID creatorProfileId);

    @Query("SELECT COUNT(a) FROM CampaignApplication a WHERE a.creatorProfile.id = :creatorProfileId AND CAST(a.status AS string) = :status")
    long countByCreatorProfileIdAndStatus(@Param("creatorProfileId") UUID creatorProfileId, @Param("status") String status);
}
