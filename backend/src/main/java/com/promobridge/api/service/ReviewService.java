package com.promobridge.api.service;

import com.promobridge.api.dto.ReviewDTO;
import com.promobridge.api.entity.Campaign;
import com.promobridge.api.entity.Review;
import com.promobridge.api.entity.User;
import com.promobridge.api.exception.EntityNotFoundException;
import com.promobridge.api.repository.CampaignRepository;
import com.promobridge.api.repository.ReviewRepository;
import com.promobridge.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;

    @Transactional
    public ReviewDTO createReview(String reviewerId, ReviewDTO dto) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new EntityNotFoundException("Reviewer not found"));
        User reviewee = userRepository.findById(dto.getRevieweeId())
                .orElseThrow(() -> new EntityNotFoundException("Reviewee not found"));

        if (reviewRepository.existsByReviewerIdAndCampaignId(reviewerId, dto.getCampaignId())) {
            throw new IllegalStateException("You have already reviewed for this campaign");
        }

        Campaign campaign = dto.getCampaignId() != null
                ? campaignRepository.findById(dto.getCampaignId()).orElse(null) : null;

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(reviewee)
                .campaign(campaign)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        review = reviewRepository.save(review);
        return toDTO(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsForUser(String userId, Pageable pageable) {
        return reviewRepository.findByRevieweeId(userId, pageable).map(this::toDTO);
    }

    private ReviewDTO toDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .reviewerId(r.getReviewer().getId())
                .revieweeId(r.getReviewee().getId())
                .campaignId(r.getCampaign() != null ? r.getCampaign().getId() : null)
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
