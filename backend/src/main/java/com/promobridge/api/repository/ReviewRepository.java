package com.promobridge.api.repository;

import com.promobridge.api.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    Page<Review> findByRevieweeId(String revieweeId, Pageable pageable);
    boolean existsByReviewerIdAndCampaignId(String reviewerId, UUID campaignId);
}
