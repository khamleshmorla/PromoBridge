package com.promobridge.api.repository;

import com.promobridge.api.entity.Campaign;
import com.promobridge.api.entity.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
    Page<Campaign> findByBusinessProfileId(UUID businessProfileId, Pageable pageable);
    long countByBusinessProfileId(UUID businessProfileId);
    long countByBusinessProfileIdAndStatus(UUID businessProfileId, CampaignStatus status);

    @Query("SELECT c FROM Campaign c WHERE c.status = :status AND (c.isDeleted IS NULL OR c.isDeleted = false)")
    Page<Campaign> findActiveCampaigns(@Param("status") CampaignStatus status, Pageable pageable);
}
